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
  PieChart,
  Pie,
  Cell,
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

  // 검색 필터
  const filteredRecords = records.filter((record) =>
    record.petNames?.join(" ").toLowerCase().includes(search.toLowerCase())
  );

  // 조합 key 생성
  const getPairKey = (petNames = []) => {
    return [...petNames].sort().join(" ↔ ");
  };

  // 조합 옵션
  const pairOptions = [
    ...new Set(records.map((record) => getPairKey(record.petNames))),
  ].filter(Boolean);

  // 선택된 조합 기록만 필터
  const pairFilteredRecords = selectedPair
    ? records.filter(
        (record) =>
          getPairKey(record.petNames) === selectedPair
      )
    : records;

  // 점수 그래프 데이터
  const chartData = [...pairFilteredRecords]
    .reverse()
    .map((record, index) => ({
      name: `${index + 1}회`,
      score: record.score || 0,
      behavior: record.behavior || "미선택",
      category: record.behaviorCategory || "기타",
    }));

  // 원그래프도 선택 조합 기준으로 계산
  const targetRecords = selectedPair
    ? records.filter(
        (record) =>
          getPairKey(record.petNames) === selectedPair
      )
    : records;

  const harmonyCount = targetRecords.filter(
    (record) => record.relationshipTrend === "harmony"
  ).length;

  const conflictCount = targetRecords.filter(
    (record) => record.relationshipTrend === "conflict"
  ).length;

  const stressCount = targetRecords.filter(
    (record) => record.relationshipTrend === "stress"
  ).length;

  // 도넛 그래프 데이터
  const pieData = [
    { name: "화합", value: harmonyCount },
    { name: "갈등", value: conflictCount },
    { name: "스트레스", value: stressCount },
  ];

  // 색상
  const COLORS = ["#7ED957", "#FF6B6B", "#FFD93D"];

  return (
    <div className="records-page">

      <div className="records-container">

        <h2>📋 최근 기록보기</h2>

        {/* 조합 선택 */}
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

        {/* 그래프 영역 */}
        <div className="record-chart-section">

          <h3>📈 관계 변화 그래프</h3>

          {/* 관계 점수 변화 */}
          <div className="chart-card">

            <h4>
              {selectedPair
                ? `${selectedPair} 관계 점수 변화`
                : "전체 관계 점수 변화"}
            </h4>

            <ResponsiveContainer width="100%" height={260}>

              <LineChart data={chartData}>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="name" />

                <YAxis domain={[0, 100]} />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#7ED957"
                  strokeWidth={3}
                />

              </LineChart>

            </ResponsiveContainer>

          </div>

          {/* 행동 유형 통계 */}
          <div className="chart-card">

            <h4>
              {selectedPair
                ? `${selectedPair} 행동 유형 통계`
                : "전체 행동 유형 통계"}
            </h4>

            <ResponsiveContainer width="100%" height={260}>

              <PieChart>

                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={45}
                  dataKey="value"
                  label
                >

                  {pieData.map((entry, index) => (

                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />

                  ))}

                </Pie>

                <Tooltip />

              </PieChart>

            </ResponsiveContainer>

          </div>

        </div>

        {/* 검색 */}
        <input
          className="records-search"
          placeholder="반려동물 이름으로 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* 기록 없음 */}
        {filteredRecords.length === 0 ? (

          <p className="records-empty">
            아직 기록이 없습니다.
          </p>

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

                {/* 카드 헤더 */}
                <div className="record-main">

                  <div>

                    <h3>
                      {record.petNames?.join(" ↔ ")}
                    </h3>

                    <p>{record.result}</p>

                  </div>

                  <span className="record-date">

                    {record.dateTime
                      ? new Date(record.dateTime).toLocaleString()
                      : "-"}

                  </span>

                </div>

                {/* 상세 열림 */}
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

                    {/* 솔루션 */}
                    {record.solutions?.length > 0 && (

                      <div
                        className="record-solution-list"
                        onClick={(e) => e.stopPropagation()}
                      >

                        <strong>단계별 솔루션</strong>

                        {[1, 2, 3, 4].map((stage) => {

                          const stageSolutions =
                            record.solutions.filter(
                              (solution) =>
                                solution.stage === stage
                            );

                          if (stageSolutions.length === 0) return null;

                          const stageTitle =
                            stageSolutions[0].stageTitle ||
                            "솔루션 단계";

                          return (

                            <div
                              key={stage}
                              className="solution-stage-box"
                            >

                              <h4>
                                {stage}단계. {stageTitle}
                              </h4>

                              {/* 경고 */}
                              {stage === 2 &&
                                record.solutions.some(
                                  (solution) =>
                                    solution.stage === 1 &&
                                    !solution.checked
                                ) && (

                                  <p className="stage-warning">
                                    ⚠️ 먼저 1단계 안전 확보를 완료하는 것을 권장합니다.
                                  </p>

                                )}

                              {/* 체크리스트 */}
                              {stageSolutions.map((solution) => (

                                <label
                                  key={solution._id || solution.text}
                                  className="solution-item"
                                  onClick={(e) => e.stopPropagation()}
                                >

                                  <input
                                    type="checkbox"
                                    checked={solution.checked}
                                    onClick={(e) =>
                                      e.stopPropagation()
                                    }
                                    onChange={async () => {

                                      const updatedSolutions =
                                        record.solutions.map((s) =>
                                          s.text === solution.text
                                            ? {
                                                ...s,
                                                checked:
                                                  !s.checked,
                                              }
                                            : s
                                        );

                                      await fetch(
                                        `http://localhost:5000/analysis/${record._id}/solutions`,
                                        {
                                          method: "PUT",
                                          headers: {
                                            "Content-Type":
                                              "application/json",
                                            Authorization:
                                              localStorage.getItem("token"),
                                          },
                                          body: JSON.stringify({
                                            solutions:
                                              updatedSolutions,
                                          }),
                                        }
                                      );

                                      fetchRecords();
                                    }}
                                  />

                                  <span>{solution.text}</span>

                                </label>

                              ))}

                            </div>

                          );
                        })}

                      </div>

                    )}

                    <p>
                      <strong>추천 행동</strong>{" "}
                      {record.recommendation ||
                        "추천 행동이 없습니다."}
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