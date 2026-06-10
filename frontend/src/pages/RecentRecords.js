import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RecentRecords.css";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function RecentRecords() {
  const navigate = useNavigate();

  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState(null);
  const [selectedPair, setSelectedPair] = useState("");

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {

    const res = await fetch(
      "https://capstone-swkb.onrender.com/analysis",
      {
        headers: {
          Authorization:
            localStorage.getItem("token"),
        },
      }
    );

    const data = await res.json();

    setRecords(
      Array.isArray(data) ? data : []
    );
  };
   // 조합 key 생성
  const getPairKey = (petNames = []) => {

    return [...petNames]
      .sort()
      .join(" ↔ ");
  };

  // 검색 필터
  const filteredRecords = records.filter(
    (record) =>
      record.petNames
        ?.join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  const groupedRecords = Object.values(
  filteredRecords.reduce((acc, record) => {
    const pairKey = getPairKey(record.petNames);

    if (!acc[pairKey]) {
      acc[pairKey] = {
        pairKey,
        records: [],
      };
    }

    acc[pairKey].records.push(record);

    return acc;
  }, {})
).map((group) => {
  const sortedRecords = group.records.sort(
    (a, b) =>
      new Date(b.dateTime || b.createdAt) -
      new Date(a.dateTime || a.createdAt)
  );

  return {
    ...group,
    records: sortedRecords,
    latest: sortedRecords[0],
    harmonyCount: sortedRecords.filter(
      (record) => record.relationshipTrend === "harmony"
    ).length,
    conflictCount: sortedRecords.filter(
      (record) => record.relationshipTrend === "conflict"
    ).length,
    stressCount: sortedRecords.filter(
      (record) => record.relationshipTrend === "stress"
    ).length,
  };
});

 

  // 조합 옵션
  const pairOptions = [

    ...new Set(
      records.map((record) =>
        getPairKey(record.petNames)
      )
    ),

  ].filter(Boolean);

  // 선택된 조합 기준
  const targetRecords = selectedPair

    ? records.filter(
        (record) =>
          getPairKey(record.petNames)
          === selectedPair
      )

    : records;

  const harmonyCount = targetRecords.filter(
    (record) =>
      record.relationshipTrend === "harmony"
  ).length;

  const conflictCount = targetRecords.filter(
    (record) =>
      record.relationshipTrend === "conflict"
  ).length;

  const stressCount = targetRecords.filter(
    (record) =>
      record.relationshipTrend === "stress"
  ).length;

  // 도넛 그래프 데이터
  const pieData = [

    {
      name: "화합",
      value: harmonyCount,
    },

    {
      name: "갈등",
      value: conflictCount,
    },

    {
      name: "스트레스",
      value: stressCount,
    },

  ];

  // 색상
  const COLORS = [
    "#7ED957",
    "#FF6B6B",
    "#FFD93D",
  ];

  const chartLegend = [
  {
    name: "화합",
    color: "#7ED957",
    description: "긍정적인 관계 행동",
  },
  {
    name: "갈등",
    color: "#FF6B6B",
    description: "공격·경계 행동",
  },
  {
    name: "스트레스",
    color: "#FFD93D",
    description: "회피·불안 행동",
  },
];

  return (

    <div className="records-page">

      <div className="records-container">

        <h2>
          📋 최근 기록보기
        </h2>

        {/* 조합 선택 */}
        <div className="pair-select-box">

          <label>
            조합 선택
          </label>

          <select
            className="records-search"
            value={selectedPair}
            onChange={(e) =>
              setSelectedPair(e.target.value)
            }
          >

            <option value="">
              전체 조합 보기
            </option>

            {pairOptions.map((pair) => (

              <option
                key={pair}
                value={pair}
              >
                {pair}
              </option>

            ))}

          </select>

        </div>

        {/* 행동 유형 통계 */}
        <div className="record-chart-section">

          <div className="chart-card">

            <h4>

              {selectedPair
                ? `${selectedPair} 행동 유형 통계`
                : "전체 행동 유형 통계"}

            </h4>

            <ResponsiveContainer
              width="100%"
              height={260}
            >

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

                  {pieData.map(
                    (entry, index) => (

                      <Cell
                        key={`cell-${index}`}
                        fill={
                          COLORS[
                            index % COLORS.length
                          ]
                        }
                      />

                    )
                  )}

                </Pie>

                <Tooltip />

              </PieChart>

            </ResponsiveContainer>

            <div className="chart-legend">

              {chartLegend.map((item) => (

                <div
                  key={item.name}
                  className="legend-item"
                >

                  <span
                    className="legend-color"
                    style={{
                      backgroundColor: item.color,
                    }}
                  />

                  <div>
                    <strong>{item.name}</strong>
                    <p>{item.description}</p>
                  </div>

                </div>

              ))}

            </div>

          </div>

        </div>

        {/* 검색 */}
        <input
          className="records-search"
          placeholder="반려동물 이름으로 검색"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        {/* 기록 없음 */}
        {groupedRecords.length === 0 ? (

          <p className="records-empty">
            아직 기록이 없습니다.
          </p>

        ) : (

          <div className="records-list">

            {groupedRecords.map((group) => (
              <div key={group.pairKey} className="record-card">
                <div
                  className="record-main"
                  onClick={() =>
                    navigate(`/relationship/${encodeURIComponent(group.pairKey)}`)
                  }
                >
                  <div>
                    <h3>{group.pairKey}</h3>

                    <p>
                      최근 결과: {group.latest.result}
                    </p>

                    {group.latest.behavior && (
                      <p className="record-behavior">
                        최근 선택 행동: {group.latest.behavior}
                      </p>
                    )}

                    <div className="record-summary-badges">
                      <span className="badge harmony">화합 {group.harmonyCount}</span>
                      <span className="badge conflict">갈등 {group.conflictCount}</span>
                      <span className="badge stress">스트레스 {group.stressCount}</span>
                      <span className="badge total">총 {group.records.length}회</span>
                    </div>
                  </div>

                  <span className="record-date">
                    {group.latest.dateTime
                      ? new Date(group.latest.dateTime).toLocaleString()
                      : "-"}
                  </span>
                </div>

                {openId === group.pairKey && (
                  <div className="record-detail">
                    <h4>📌 이 조합의 분석 기록</h4>

                    {group.records.map((record) => (
                      <div key={record._id} className="record-history-item">
                        <div className="record-history-header">
                          <strong>{record.result}</strong>
                          <span>
                            {record.dateTime
                              ? new Date(record.dateTime).toLocaleString()
                              : "-"}
                          </span>
                        </div>

                        {record.behavior && (
                          <p>
                            <strong>선택 행동:</strong> {record.behavior}
                          </p>
                        )}

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