import { useEffect, useState } from "react";
import "./RecentRecords.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

function RecentRecords() {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState(null);
  const [selectedPair, setSelectedPair] = useState("");

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    const res = await fetch("http://localhost:5000/analysis", {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });

    const data = await res.json();
    setRecords(Array.isArray(data) ? data : []);
  };

  const filteredRecords = records.filter((record) =>
    record.petNames?.join(" ").toLowerCase().includes(search.toLowerCase())
  );

  const getPairKey = (petNames = []) => {
    return [...petNames].sort().join(" ↔ ");
  };

  const pairOptions = [
    ...new Set(records.map((record) => getPairKey(record.petNames))),
  ].filter(Boolean);

  const pairFilteredRecords = selectedPair
    ? records.filter(
        (record) =>
          getPairKey(record.petNames) === selectedPair
      )
    : records;

  const chartData = [...pairFilteredRecords]
    .reverse()
    .map((record, index) => ({
      name: `${index + 1}회`,
      score: record.score || 0,
      behavior: record.behavior || "미선택",
      category: record.behaviorCategory || "기타",
    }));

  const harmonyCount = records.filter(
    (record) => record.relationshipTrend === "harmony"
  ).length;


  const conflictCount = records.filter(
    (record) => record.relationshipTrend === "conflict"
  ).length;

  const stressCount = records.filter(
    (record) => record.relationshipTrend === "stress"
  ).length;

  const barData = [
    { name: "화합", count: harmonyCount },
    { name: "갈등", count: conflictCount },
    { name: "스트레스", count: stressCount },
  ];

  return (
    <div className="records-page">
      <div className="records-container">
        <h2>📋 최근 기록보기</h2>

        <div className="pair-select-box">
          <label>조합 선택</label>

          <select
            className="records-search"
            value={selectedPair}
            onChange={(e) => setSelectedPair(e.target.value)}
          >
            <option value="">전체 조합 보기</option>

            {pairOptions.map((pair) => (
              <option key={pair} value={pair}>
                {pair}
              </option>
            ))}
          </select>
        </div>

        <div className="record-chart-section">
        <h3>📈 관계 변화 그래프</h3>

        <div className="chart-card">
          <h4>관계 점수 변화</h4>

          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="score" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h4>행동 유형 통계</h4>

          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

        <input
          className="records-search"
          placeholder="반려동물 이름으로 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {filteredRecords.length === 0 ? (
          <p className="records-empty">아직 기록이 없습니다.</p>
        ) : (
          <div className="records-list">
            {filteredRecords.map((record) => (
              <div
                key={record._id}
                className="record-card"
                onClick={() =>
                  setOpenId(openId === record._id ? null : record._id)
                }
              >
                <div className="record-main">
                  <div>
                    <h3>{record.petNames?.join(" ↔ ")}</h3>
                    <p>{record.result}</p>
                  </div>

                  <span className="record-date">
                    {record.dateTime
                      ? new Date(record.dateTime).toLocaleString()
                      : "-"}
                  </span>
                </div>

                {openId === record._id && (
                  <div className="record-detail">
                    <p>
                      <strong>점수</strong> {record.score || 0}점
                    </p>
                    <p>
                      <strong>요약</strong>{" "}
                      {record.summary || "요약 내용이 없습니다."}
                    </p>
                    <p>
                      <strong>상세 설명</strong>{" "}
                      {record.detail || "상세 설명이 없습니다."}
                    </p>
                    {record.behavior && (
                      <p>
                        <strong>선택 행동</strong> {record.behavior}
                      </p>
                    )}

                    {record.solutions?.length > 0 && (
                        <div className="record-solution-list" onClick={(e) => e.stopPropagation()}>
                          <strong>단계별 솔루션</strong>

                          {[1, 2, 3, 4].map((stage) => {
                            const stageSolutions = record.solutions.filter(
                              (solution) => solution.stage === stage
                            );

                            if (stageSolutions.length === 0) return null;

                            const stageTitle = stageSolutions[0].stageTitle || "솔루션 단계";

                            return (
                              <div key={stage} className="solution-stage-box">
                                <h4>
                                  {stage}단계. {stageTitle}
                                </h4>

                                {stage === 2 &&
                                  record.solutions.some(
                                    (solution) => solution.stage === 1 && !solution.checked
                                  ) && (
                                    <p className="stage-warning">
                                      ⚠️ 먼저 1단계 안전 확보를 완료하는 것을 권장합니다.
                                    </p>
                                  )}

                                {stageSolutions.map((solution) => (
                                  <label
                                    key={solution._id || solution.text}
                                    className="solution-item"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={solution.checked}
                                      onClick={(e) => e.stopPropagation()}
                                      onChange={async () => {
                                        const updatedSolutions = record.solutions.map((s) =>
                                          s.text === solution.text
                                            ? { ...s, checked: !s.checked }
                                            : s
                                        );

                                        await fetch(
                                          `http://localhost:5000/analysis/${record._id}/solutions`,
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
                                      }}
                                    />

                                    <span>{solution.text}</span>
                                    {solution.mission && (
                                    <div className="mission-box" onClick={(e) => e.stopPropagation()}>
                                      <h5>🎯 {solution.mission.title}</h5>
                                      <p>{solution.mission.description}</p>
                                      <div className="mission-bottom-row">
                                      <p className="mission-condition">
                                        <strong>성공 조건:</strong> {solution.mission.successCondition}
                                      </p>

                                      <button
                                        className={
                                          solution.mission.completed
                                            ? "mission-complete-btn done"
                                            : "mission-complete-btn"
                                        }
                                        onClick={async (e) => {
                                          e.stopPropagation();

                                          const updatedSolutions = record.solutions.map((s) =>
                                            s.text === solution.text
                                              ? {
                                                  ...s,
                                                  mission: {
                                                    ...s.mission,
                                                    completed: !s.mission?.completed,
                                                  },
                                                }
                                              : s
                                          );

                                          await fetch(
                                            `http://localhost:5000/analysis/${record._id}/solutions`,
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
                                        }}
                                      >
                                        {solution.mission.completed ? "미션 완료됨" : "미션 완료하기"}
                                      </button>
                                      </div>
                                    </div>
                                  )}
                                  </label>
                                ))}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    <p>
                      <strong>추천 행동</strong>{" "}
                      {record.recommendation || "추천 행동이 없습니다."}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default RecentRecords;