import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./RelationshipDetail.css";

function RelationshipDetail() {
  const { pairKey } = useParams();
  const navigate = useNavigate();
  const [memoInputs, setMemoInputs] = useState({});

  const [records, setRecords] = useState([]);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    const res = await fetch("https://capstone-swkb.onrender.com/analysis", {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });

    const data = await res.json();
    setRecords(Array.isArray(data) ? data : []);
  };

  const getPairKey = (petNames = []) => {
    return [...petNames].sort().join(" ↔ ");
  };

  const pairRecords = records
    .filter((record) => getPairKey(record.petNames) === decodeURIComponent(pairKey))
    .sort(
      (a, b) =>
        new Date(b.dateTime || b.createdAt) -
        new Date(a.dateTime || a.createdAt)
    );

  const latest = pairRecords[0];

  const harmonyCount = pairRecords.filter(
    (record) => record.relationshipTrend === "harmony"
  ).length;

  const conflictCount = pairRecords.filter(
    (record) => record.relationshipTrend === "conflict"
  ).length;

  const stressCount = pairRecords.filter(
    (record) => record.relationshipTrend === "stress"
  ).length;

  const updateAnalysisSolutions = async (analysisId, updatedSolutions) => {
    await fetch(
      `https://capstone-swkb.onrender.com/analysis/${analysisId}/solutions`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify({
          solutions: updatedSolutions,
        }),
      }
    );

    fetchRecords();
  };

  const toggleTodayMission = async (record) => {
    await fetch(
      `https://capstone-swkb.onrender.com/analysis/${record._id}/today-mission`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify({
          todayMissionCompleted: !record.todayMissionCompleted,
        }),
      }
    );

    fetchRecords();
  };

  const getTodayMission = (record) => {
    if (record.relationshipTrend === "harmony") {
      return {
        title: "긍정 행동 강화 미션",
        goal: "좋은 관계 행동을 반복해서 안정적인 관계로 이어가요.",
        description:
          "두 반려동물이 같은 공간에서 차분하게 머물거나 함께 놀이하는 시간을 만들어주세요.",
        successCondition:
          "공격, 추격, 회피 없이 10분 이상 편안하게 있으면 성공",
        reward: "성공 후 간식 또는 칭찬으로 긍정 행동을 강화해주세요.",
      };
    }

    if (record.relationshipTrend === "conflict") {
      return {
        title: "갈등 완화 미션",
        goal: "갈등 행동을 줄이고 안전한 거리를 유지해요.",
        description:
          "두 반려동물이 바로 접촉하지 않도록 거리를 두고, 보호자가 차분한 상태를 유지해주세요.",
        successCondition:
          "으르렁, 하악질, 추격, 공격 행동 없이 5분 이상 유지하면 성공",
        reward: "차분히 있으면 간식이나 칭찬으로 보상해주세요.",
      };
    }

    return {
      title: "스트레스 안정 미션",
      goal: "긴장과 회피 행동을 줄이고 안정감을 높여요.",
      description:
        "각자의 공간을 확보한 뒤, 짧은 시간 동안 서로의 존재에 익숙해지도록 해주세요.",
      successCondition:
        "숨기, 떨기, 반복 울음 없이 안정적으로 머무르면 성공",
      reward: "안정적으로 머문 뒤 조용히 칭찬해주세요.",
    };
  };

  const getHarmonyJourney = (record) => {
  const solutions = record.solutions || [];

  const totalCount = solutions.length;

  const completedCount = solutions.filter(
    (solution) =>
      solution.checked ||
      solution.mission?.completed
  ).length;

  const progress =
    totalCount === 0
      ? 0
      : Math.round((completedCount / totalCount) * 100);

  const stageList = [1, 2, 3, 4];

  const currentStage =
    stageList.find((stage) =>
      solutions.some(
        (solution) =>
          solution.stage === stage &&
          !solution.checked &&
          !solution.mission?.completed
      )
    ) || 5;

  const nextSolution = solutions.find(
    (solution) =>
      solution.stage === currentStage &&
      !solution.checked &&
      !solution.mission?.completed
  );

  const stageTitleMap = {
    1: "1단계 안전 확보",
    2: "2단계 환경 준비",
    3: "3단계 적응 훈련",
    4: "4단계 화합 유지",
    5: "화합 유지 단계",
  };

  const goalMap = {
    1: "두 반려동물이 다치지 않도록 안전한 거리를 확보하세요.",
    2: "각자의 공간과 자원을 분리해 갈등 요인을 줄이세요.",
    3: "짧은 만남과 긍정 보상을 통해 서로에게 익숙해지도록 도와주세요.",
    4: "좋은 관계 행동을 반복하며 안정적인 공존을 유지하세요.",
    5: "현재의 좋은 관계를 유지하며 정기적으로 행동 변화를 관찰하세요.",
  };

  return {
    totalCount,
    completedCount,
    progress,
    currentStage,
    currentStageTitle: stageTitleMap[currentStage],
    nextGoal: nextSolution?.mission?.successCondition || goalMap[currentStage],
    nextAction: nextSolution?.text || "현재 단계의 미션을 모두 완료했습니다.",
  };
};

  if (!latest) {
    return (
      <>
        <Navbar
          logout={() => {
            localStorage.removeItem("token");
            window.location.href = "/";
          }}
        />

        <div className="relationship-page">
          <div className="relationship-container">
            <button className="relationship-back-btn" onClick={() => navigate("/records")}>
              ← 최근 기록으로
            </button>

            <p>해당 조합의 분석 기록이 없습니다.</p>
          </div>
        </div>
      </>
    );
  }

  const todayMission = getTodayMission(latest);
  const harmonyJourney = getHarmonyJourney(latest);

  return (
    <>
      <Navbar
        logout={() => {
          localStorage.removeItem("token");
          window.location.href = "/";
        }}
      />

      <div className="relationship-page">
        <div className="relationship-container">
          <button className="relationship-back-btn" onClick={() => navigate("/records")}>
            ← 최근 기록으로
          </button>

          <div className="relationship-header-card">
            <h2>{decodeURIComponent(pairKey)}</h2>

            <p>
              <strong>최근 결과:</strong> {latest.result}
            </p>

            <p>
              <strong>최근 선택 행동:</strong> {latest.behavior || "-"}
            </p>

            <div className="relationship-badges">
              <span className="badge harmony">화합 {harmonyCount}</span>
              <span className="badge conflict">갈등 {conflictCount}</span>
              <span className="badge stress">스트레스 {stressCount}</span>
              <span className="badge total">총 {pairRecords.length}회</span>
            </div>
          </div>

          <div className="relationship-section">
            <h3>🎯 오늘의 관계 미션</h3>

            <div className="today-mission-card">
              <h4>{todayMission.title}</h4>

              <p>
                <strong>목표:</strong> {todayMission.goal}
              </p>

              <p>
                <strong>미션:</strong> {todayMission.description}
              </p>

              <p>
                <strong>성공 조건:</strong> {todayMission.successCondition}
              </p>

              <p>
                <strong>보상 방법:</strong> {todayMission.reward}
              </p>

              <button
                className={
                  latest.todayMissionCompleted
                    ? "mission-complete-btn done"
                    : "mission-complete-btn"
                }
                onClick={() => toggleTodayMission(latest)}
              >
                {latest.todayMissionCompleted ? "미션 완료됨" : "미션 완료하기"}
              </button>
            </div>
          </div>


          <div className="harmony-journey-card">
            <div className="harmony-journey-header">
                <div>
                <h3>🌿 화합 여정</h3>
                <p>
                    미션 완료 여부를 기준으로 관계 개선 진행률을 확인할 수 있습니다.
                </p>
                </div>

                <strong>{harmonyJourney.progress}%</strong>
            </div>

            <div className="journey-progress-bar">
                <div
                className="journey-progress-fill"
                style={{
                    width: `${harmonyJourney.progress}%`,
                }}
                />
            </div>

            <div className="journey-step-grid">
                {[1, 2, 3, 4].map((stage) => (
                <div
                    key={stage}
                    className={
                    harmonyJourney.currentStage === stage
                        ? "journey-step active"
                        : harmonyJourney.currentStage > stage
                        ? "journey-step done"
                        : "journey-step"
                    }
                >
                    <span>{stage}</span>
                    <p>
                    {stage === 1
                        ? "안전 확보"
                        : stage === 2
                        ? "환경 준비"
                        : stage === 3
                        ? "적응 훈련"
                        : "화합 유지"}
                    </p>
                </div>
                ))}
            </div>

            <div className="journey-current-box">
                <h4>{harmonyJourney.currentStageTitle}</h4>

                <p>
                <strong>다음 행동:</strong> {harmonyJourney.nextAction}
                </p>

                <p>
                <strong>다음 목표:</strong> {harmonyJourney.nextGoal}
                </p>

                <span>
                완료한 미션 {harmonyJourney.completedCount} / 전체 미션{" "}
                {harmonyJourney.totalCount}
                </span>
            </div>
            </div>

          
          <div className="relationship-section">
            <h3>🍀 단계별 솔루션 & 미션</h3>

            {latest.solutions?.length > 0 ? (
              [1, 2, 3, 4].map((stage) => {
                const stageSolutions = latest.solutions.filter(
                  (solution) => solution.stage === stage
                );

                if (stageSolutions.length === 0) return null;

                return (
                  <div key={stage} className="solution-stage-box">
                    <h4>
                      {stage}단계.{" "}
                      {stageSolutions[0].stageTitle || "솔루션 단계"}
                    </h4>

                    {stageSolutions.map((solution) => {
                        const solutionIndex = latest.solutions.findIndex(
                            (s) => s._id === solution._id || s.text === solution.text
                        );

                        const memoKey = `${latest._id}-${solutionIndex}`;

                        return (
                      <div
                        key={solution._id || solution.text}
                        className="solution-mission-item"
                      >
                        <p>
                          {solution.mission?.completed ? "✅" : "⬜"}{" "}
                          {solution.text}
                        </p>

                        {solution.mission && (
                          <div className="mission-box">
                            <h5>🎯 {solution.mission.title}</h5>

                            <p>{solution.mission.description}</p>

                            <div className="mission-bottom-row">
                              <p className="mission-condition">
                                <strong>성공 조건:</strong>{" "}
                                {solution.mission.successCondition ||
                                  "성공 조건이 등록되지 않았습니다."}
                              </p>

                              <button
                                className={
                                  solution.mission.completed
                                    ? "mission-complete-btn done"
                                    : "mission-complete-btn"
                                }
                                onClick={() => {
                                  const updatedSolutions = latest.solutions.map((s) =>
                                    s.text === solution.text
                                      ? {
                                          ...s,
                                          checked: !s.mission?.completed,
                                          mission: {
                                            ...s.mission,
                                            completed: !s.mission?.completed,
                                          },
                                        }
                                      : s
                                  );

                                  updateAnalysisSolutions(
                                    latest._id,
                                    updatedSolutions
                                  );
                                }}
                              >
                                {solution.mission.completed
                                  ? "미션 완료됨"
                                  : "미션 완료하기"}
                              </button>
                            </div>
                          </div>
                        )}

                        <div className="solution-memo-box">
                            <label>관찰 메모</label>

                            <textarea
                                placeholder="예: 처음에는 경계했지만 5분 뒤 같은 공간에 머물렀어요."
                                value={
                                memoInputs[memoKey] !== undefined
                                    ? memoInputs[memoKey]
                                    : solution.memo || ""
                                }
                                onChange={(e) =>
                                setMemoInputs({
                                    ...memoInputs,
                                    [memoKey]: e.target.value,
                                })
                                }
                            />

                            <button
                                className="memo-save-btn"
                                onClick={() => {
                                const updatedSolutions = latest.solutions.map((s, index) =>
                                    index === solutionIndex
                                    ? {
                                        ...s,
                                        memo:
                                            memoInputs[memoKey] !== undefined
                                            ? memoInputs[memoKey]
                                            : solution.memo || "",
                                        }
                                    : s
                                );

                                updateAnalysisSolutions(latest._id, updatedSolutions);
                                alert("메모가 저장되었습니다.");
                                }}
                            >
                                메모 저장
                            </button>
                            </div>
                      </div>
                    );})}
                  </div>
                );
              })
            ) : (
              <p>단계별 솔루션이 없습니다.</p>
            )}
          </div>

          <div className="relationship-section">
            <h3>📋 상세 분석 이력</h3>

            {pairRecords.map((record) => (
              <div key={record._id} className="history-card">
                <div className="history-header">
                  <strong>{record.result}</strong>

                  <span>
                    {record.dateTime
                      ? new Date(record.dateTime).toLocaleString()
                      : "-"}
                  </span>
                </div>

                <p>
                  <strong>선택 행동:</strong> {record.behavior || "-"}
                </p>

                <p>
                  <strong>상세 설명:</strong>{" "}
                  {record.detail || "상세 설명이 없습니다."}
                </p>

                <p>
                  <strong>추천 행동:</strong>{" "}
                  {record.recommendation || "추천 행동이 없습니다."}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default RelationshipDetail;