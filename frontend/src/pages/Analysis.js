import { useEffect, useState } from "react";
import "../App.css";
import "./Analysis.css";

function Analysis({ logout }) {
  const [pets, setPets] = useState([]);
  const [selectedPet1, setSelectedPet1] = useState("");
  const [selectedPet2, setSelectedPet2] = useState("");
  const [result, setResult] = useState("");
  const [selectedBehavior, setSelectedBehavior] = useState("");
  const [solutions, setSolutions] = useState([]);
  
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

  const behaviorOptions = [
    {
      group: "⚡ 갈등 및 경계",
      options: [
        "공격성 보임 (하악질, 으르렁)",
        "서로 노려보며 대치함",
        "일방적으로 쫓아다님",
        "식사/화장실 근처 경계",
      ],
    },
    {
      group: "🍀 화합 및 긍정",
      options: [
        "평화롭게 함께 휴식",
        "서로 편안한 거리를 유지",
        "함께 장난치며 놀이함",
        "코 인사 및 부드러운 접촉",
      ],
    },
    {
      group: "😌 기타",
      options: [
        "활동적임",
        "관계서 관찰 중",
        "평소보다 예민함",
      ],
    },
  ];

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

  const getSolutionsByBehavior = (behavior) => {
  if (behavior.includes("공격성")) {
    return [
      "즉시 분리하고 보호자 관찰 하에 다시 만나게 하기",
      "첫 대면 시간은 5분 이내로 제한하기",
      "각자의 안전한 숨을 공간 마련하기",
      "간식이나 장난감을 두고 경쟁하지 않도록 분리하기",
    ];
  }

  if (behavior.includes("노려보며")) {
    return [
      "서로의 시야를 잠시 차단하기",
      "거리를 두고 짧게 관찰시키기",
      "긴장 신호가 줄어들 때까지 직접 접촉 피하기",
    ];
  }

  if (behavior.includes("쫓아")) {
    return [
      "쫓기는 반려동물이 피할 수 있는 공간 만들기",
      "놀이 시간을 짧게 나누어 진행하기",
      "흥분도가 높아지면 즉시 중단하기",
    ];
  }

  if (behavior.includes("식사") || behavior.includes("화장실")) {
    return [
      "밥그릇과 물그릇을 서로 다른 공간에 두기",
      "화장실 또는 배변 공간 근처 접근 제한하기",
      "식사 시간에는 반드시 분리하기",
    ];
  }

  if (behavior.includes("휴식")) {
    return [
      "함께 쉬는 시간을 유지하되 억지로 붙여두지 않기",
      "각자의 휴식 공간도 따로 마련하기",
      "좋은 행동을 보이면 간식으로 긍정 강화하기",
    ];
  }

  if (behavior.includes("거리")) {
    return [
      "현재 거리감을 유지하면서 천천히 적응시키기",
      "갑작스러운 접촉은 피하기",
      "서로 안정적인 반응을 보일 때만 시간을 늘리기",
    ];
  }

  if (behavior.includes("놀이")) {
    return [
      "공동 놀이 시간을 짧고 즐겁게 유지하기",
      "장난감은 여러 개 준비해 경쟁을 줄이기",
      "흥분도가 높아지면 잠시 쉬게 하기",
    ];
  }

  if (behavior.includes("코 인사") || behavior.includes("접촉")) {
    return [
      "부드러운 접촉은 칭찬으로 강화하기",
      "접촉 시간이 길어지기 전에 자연스럽게 마무리하기",
      "반복적으로 좋은 경험을 쌓게 하기",
    ];
  }

  return [
    "하루 10분 정도 관계를 관찰하고 기록하기",
    "무리하게 함께 있게 하지 않기",
    "식사, 휴식, 놀이 공간을 구분해주기",
  ];
};

  const runAnalysis = async () => {
  const p1 = pets.find((p) => p._id === selectedPet1);
  const p2 = pets.find((p) => p._id === selectedPet2);

  const analysisResult = analyzePets(p1, p2);
  setResult(analysisResult);

  const solutionList = getSolutionsByBehavior(selectedBehavior).map((text) => ({
    text,
    checked: false,
  }));

  setSolutions(solutionList);


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
        behavior: selectedBehavior,
        solutions: solutionList,
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

  

          <select
            className="input behavior-select"
            value={selectedBehavior}
            onChange={(e) => setSelectedBehavior(e.target.value)}
          >
            <option value="">행동 선택</option>

            {behaviorOptions.map((group) => (
              <optgroup key={group.group} label={group.group}>
                {group.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </optgroup>
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

          {selectedBehavior && (
            <p className="selected-behavior">
              선택한 행동: {selectedBehavior}
            </p>
          )}

          <div className="solution-box">
            <h4>추천 솔루션 체크리스트</h4>

            {solutions.map((solution, index) => (
              <label key={index} className="solution-item">
                <input type="checkbox" checked={solution.checked} readOnly />
                <span>{solution.text}</span>
              </label>
            ))}
          </div>
        </div>
      )}
      </div>
    </>
  );
}

export default Analysis;