import { useEffect, useState } from "react";
import "../App.css";
import "./Analysis.css";

function Analysis({ logout }) {
  const [pets, setPets] = useState([]);
  const [selectedPet1, setSelectedPet1] = useState("");
  const [selectedPet2, setSelectedPet2] = useState("");
  const [result, setResult] = useState("");

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    const res = await fetch("http://localhost:5000/pets", {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });

    const data = await res.json();
    setPets(Array.isArray(data) ? data : []);
  };

  const analyzePets = (p1, p2) => {
    if (!p1 || !p2) return "두 마리를 선택해주세요";

    if (p1.type === p2.type) return "🟢 잘 어울립니다";

    if (
      (p1.type === "고양이" && p2.type === "햄스터") ||
      (p1.type === "햄스터" && p2.type === "고양이")
    )
      return "🔴 위험합니다";

    return "🟡 주의가 필요합니다";
  };

  const runAnalysis = async () => {
  const p1 = pets.find((p) => p._id === selectedPet1);
  const p2 = pets.find((p) => p._id === selectedPet2);

  const analysisResult = analyzePets(p1, p2);
  setResult(analysisResult);

  if (p1 && p2) {
    const now = new Date();

    const formattedDateTime =
      now.getFullYear() +
      "-" +
      String(now.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(now.getDate()).padStart(2, "0") +
      " " +
      String(now.getHours()).padStart(2, "0") +
      ":" +
      String(now.getMinutes()).padStart(2, "0");
    
    await fetch("http://localhost:5000/analysis", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
      body: JSON.stringify({
        petIds: [p1._id, p2._id],
        petNames: [p1.name, p2.name],
        result: analysisResult,
        score:
          analysisResult.includes("🟢") ? 90 :
          analysisResult.includes("🟡") ? 60 : 30,
        summary: `${p1.name}와 ${p2.name}의 관계 분석 결과입니다.`,
        detail: analysisResult.includes("🟢")
          ? "두 반려동물은 비교적 안정적인 관계로 볼 수 있습니다."
          : analysisResult.includes("🟡")
          ? "두 반려동물은 함께 지낼 수 있지만 상황에 따라 주의가 필요합니다."
          : "두 반려동물은 갈등 가능성이 있어 분리된 공간 관리가 필요합니다.",
        recommendation: analysisResult.includes("🟢")
          ? "함께 놀이 시간을 늘려도 좋습니다."
          : analysisResult.includes("🟡")
          ? "식사 공간과 휴식 공간을 분리해 주세요."
          : "초기에는 반드시 보호자의 관찰 아래에서만 만나게 해주세요.",
        dateTime: formattedDateTime,
      }),
    });
  }
};

  // 결과 색상 클래스
  const getColorClass = () => {
    if (result.includes("🟢")) return "green";
    if (result.includes("🟡")) return "orange";
    if (result.includes("🔴")) return "red";
    return "";
  };

  return (
    <>
      

      <div className="container">
        <h2>⚠️ 화합/갈등 분석</h2>

        <div className="card">
          <select
            className="input"
            onChange={(e) => setSelectedPet1(e.target.value)}
          >
            <option value="">첫 번째 선택</option>
            {pets.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name} ({p.type})
              </option>
            ))}
          </select>

          <br /><br />

          <select
            className="input"
            onChange={(e) => setSelectedPet2(e.target.value)}
          >
            <option value="">두 번째 선택</option>
            {pets.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name} ({p.type})
              </option>
            ))}
          </select>

          <br /><br />

          <button className="button" onClick={runAnalysis}>
            🔍 분석하기
          </button>
        </div>

        {/* 결과 */}
        {result && (
          <div className={`card result-box ${getColorClass()}`}>
            <h3>분석 결과</h3>
            <p>{result}</p>
          </div>
        )}
      </div>
    </>
  );
}

export default Analysis;