import { useEffect, useState } from "react";
import "./RecentRecords.css";

function RecentRecords() {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState(null);

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

  return (
    <div className="records-page">
      <div className="records-container">
        <h2>📋 최근 기록보기</h2>

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