import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import "./Analysis.css";

function Analysis() {

  const [pets, setPets] = useState([]);
  const [selectedPet1, setSelectedPet1] = useState("");
  const [selectedPet2, setSelectedPet2] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedBehavior, setSelectedBehavior] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {

    try {

      const res = await fetch("http://localhost:5000/pets", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      const data = await res.json();

      setPets(Array.isArray(data) ? data : []);

    } catch (err) {

      console.error(err);

    }
  };

  // 행동 선택지
  const behaviorOptions = [

    {
      category: "⚡ 갈등 및 경계",
      items: [
        "공격성 보임 (하악질, 으르렁)",
        "서로 노려보며 대치함",
        "밥그릇 근처 경계",
        "식사/화장실 근처 경계",
        "장난감 독점",
        "추격 행동",
        "위협 자세 보임",
      ],
    },

    {
      category: "🍀 화합 및 긍정",
      items: [
        "서로 냄새 맡기",
        "가까이 휴식",
        "함께 놀이",
        "함께 장난치며 놀이함",
        "그루밍",
        "보호자 주변 함께 있기",
        "차분히 공존",
      ],
    },

    {
      category: "😟 스트레스 및 회피",
      items: [
        "숨기",
        "떨기",
        "반복 울음",
        "과도한 경계",
        "식욕 감소",
        "특정 공간 회피",
        "움직임 감소",
      ],
    },

  ];

  // 행동 분류
  const getBehaviorInfo = (behavior) => {

    if (
      [
        "공격성 보임 (하악질, 으르렁)",
        "서로 노려보며 대치함",
        "밥그릇 근처 경계",
        "식사/화장실 근처 경계",
        "장난감 독점",
        "추격 행동",
        "위협 자세 보임",
      ].includes(behavior)
    ) {

      return {
        category: "갈등",
        trend: "conflict",
      };

    }

    if (
      [
        "서로 냄새 맡기",
        "가까이 휴식",
        "함께 놀이",
        "함께 장난치며 놀이함",
        "그루밍",
        "보호자 주변 함께 있기",
        "차분히 공존",
      ].includes(behavior)
    ) {

      return {
        category: "화합",
        trend: "harmony",
      };

    }

    return {
      category: "스트레스",
      trend: "stress",
    };
  };

  // 관계 분석
  const analyzePets = (p1, p2) => {

    if (!p1 || !p2) {

      return {
        result: "분석 불가",
        detail: "두 반려동물을 모두 선택해주세요.",
        recommendation: [],
      };

    }

    const type1 = p1.type;
    const type2 = p2.type;

    const types = [type1, type2].sort().join("-");

    const analysisMap = {

      "강아지-강아지": {

        result: "🟡 서열 및 영역 갈등 가능성",

        detail: `
강아지는 무리 생활 기반의 사회적 동물입니다.

같은 공간에서 생활하는 강아지들은 자연스럽게 우위 관계를 만들려고 하며,
식사 공간이나 장난감 등을 두고 경쟁이 발생할 수 있습니다.

직접 응시하기, 으르렁거리기, 털 세우기 행동은 대표적인 경계 행동입니다.

보호자 관심 경쟁 상황이나
먹이 경쟁이 반복되면 갈등 빈도가 높아질 수 있습니다.
        `,

        recommendation: [
          "식사 공간 분리하기",
          "장난감 경쟁 막기",
          "흥분 전에 개입하기",
          "손으로 싸움 말리지 않기",
        ],

      },

      "강아지-고양이": {

        result: "🟡 행동 언어 차이로 인한 스트레스 가능",

        detail: `
강아지와 고양이는 행동 언어가 매우 다릅니다.

강아지의 놀이 행동이 고양이에게 위협으로 느껴질 수 있으며,
고양이는 도망 행동으로 스트레스를 표현할 수 있습니다.

고양이는 높은 공간과 숨는 공간이 꼭 필요합니다.
        `,

        recommendation: [
          "고양이 숨숨 공간 만들기",
          "강아지 추격 행동 막기",
          "처음엔 거리 유지하기",
          "식사 공간 분리하기",
        ],

      },

      "고양이-고양이": {

        result: "🟡 영역 갈등 가능",

        detail: `
고양이는 영역 중심 생활을 하는 동물입니다.

특히 낯선 냄새나 공간 경쟁으로 인해 갈등이 발생할 수 있습니다.

하악질과 강한 응시는 대표적인 경계 행동입니다.
        `,

        recommendation: [
          "숨숨집 각각 제공하기",
          "식사 공간 분리하기",
          "천천히 재소개하기",
          "강한 응시 차단하기",
        ],

      },

      default: {

        result: "🟡 주의 깊은 관찰 필요",

        detail: `
서로 다른 종의 동물은 행동 언어와 생활 습성이 다르기 때문에
스트레스와 갈등 가능성이 존재합니다.

처음에는 짧은 시간만 만나게 하고
스트레스 행동이 나타나는지 관찰하는 것이 중요합니다.
        `,

        recommendation: [
          "처음엔 짧게 만나게 하기",
          "각자 공간 확보하기",
          "스트레스 행동 관찰하기",
        ],

      },

    };

    return analysisMap[types] || analysisMap.default;
  };

  // 분석 실행
  const runAnalysis = async () => {

    const p1 = pets.find((p) => p._id === selectedPet1);
    const p2 = pets.find((p) => p._id === selectedPet2);

    const result = analyzePets(p1, p2);

    const behaviorInfo = getBehaviorInfo(selectedBehavior);

    result.behavior = selectedBehavior;
    result.behaviorCategory = behaviorInfo.category;
    result.relationshipTrend = behaviorInfo.trend;

    setAnalysis(result);

    if (!p1 || !p2) return;

    const saveData = {

      petIds: [p1._id, p2._id],

      petNames: [p1.name, p2.name],

      result: result.result,

      summary: result.result,

      detail: result.detail,

      recommendation: result.recommendation.join(", "),

      behavior: selectedBehavior,

      behaviorCategory: behaviorInfo.category,

      relationshipTrend: behaviorInfo.trend,

      solutions: result.recommendation.map((item) => ({
        text: item,
        checked: false,
      })),

      dateTime: new Date(),
    };

    const res = await fetch(
      "http://localhost:5000/analysis",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },

        body: JSON.stringify(saveData),
      }
    );

    const data = await res.json();

    if (!res.ok) {

      alert(data.error || "분석 결과 저장 실패");

      return;

    }

    console.log("분석 저장 완료:", data);
  };

  return (

    <div className="container">

      <h2>🐾 반려동물 관계 분석</h2>

      {/* STEP 표시 */}
      <div className="analysis-progress">

        <div className={
          currentStep >= 1
            ? "progress-step active"
            : "progress-step"
        }>
          1
        </div>

        <div className={
          currentStep >= 2
            ? "progress-line active"
            : "progress-line"
        } />

        <div className={
          currentStep >= 2
            ? "progress-step active"
            : "progress-step"
        }>
          2
        </div>

        <div className={
          currentStep >= 3
            ? "progress-line active"
            : "progress-line"
        } />

        <div className={
          currentStep >= 3
            ? "progress-step active"
            : "progress-step"
        }>
          3
        </div>

      </div>

      {/* STEP1 */}
      {currentStep === 1 && (

        <div className="analysis-step-screen">

          <div className="step-header">

            <span className="step-badge">
              STEP 1
            </span>

            <h3>반려동물 선택</h3>

          </div>

          <div className="pet-select-area">

            <div className="pet-select-column">

              <h4>첫 번째 반려동물</h4>

              <div className="pet-choice-list">

                {pets.map((pet) => (

                  <button
                    key={pet._id}
                    type="button"
                    className={
                      selectedPet1 === pet._id
                        ? "pet-choice-card selected"
                        : "pet-choice-card"
                    }
                    onClick={() =>
                      setSelectedPet1(pet._id)
                    }
                  >

                    <strong>{pet.name}</strong>

                    <span>{pet.type}</span>

                  </button>

                ))}

              </div>

            </div>

            <div className="pet-vs-badge">
              ↔
            </div>

            <div className="pet-select-column">

              <h4>두 번째 반려동물</h4>

              <div className="pet-choice-list">

                {pets.map((pet) => (

                  <button
                    key={pet._id}
                    type="button"
                    className={
                      selectedPet2 === pet._id
                        ? "pet-choice-card selected"
                        : "pet-choice-card"
                    }
                    onClick={() =>
                      setSelectedPet2(pet._id)
                    }
                  >

                    <strong>{pet.name}</strong>

                    <span>{pet.type}</span>

                  </button>

                ))}

              </div>

            </div>

          </div>

          <div className="step-button-row">

            <button
              className="analysis-next-btn"
              onClick={() => {

                if (!selectedPet1 || !selectedPet2) {

                  alert("두 반려동물을 선택해주세요.");

                  return;

                }

                setCurrentStep(2);

              }}
            >
              다음 →
            </button>

          </div>

        </div>

      )}

      {/* STEP2 */}
      {currentStep === 2 && (

        <div className="analysis-step-screen">

          <div className="step-header">

            <span className="step-badge">
              STEP 2
            </span>

            <h3>행동 선택</h3>

          </div>

          <div className="behavior-group-list">

            {behaviorOptions.map((group) => (

              <div
                key={group.category}
                className="behavior-group"
              >

                <h4>{group.category}</h4>

                <div className="behavior-button-wrap">

                  {group.items.map((item) => (

                    <button
                      key={item}
                      type="button"
                      className={
                        selectedBehavior === item
                          ? "behavior-chip selected"
                          : "behavior-chip"
                      }
                      onClick={() =>
                        setSelectedBehavior(item)
                      }
                    >
                      {item}
                    </button>

                  ))}

                </div>

              </div>

            ))}

          </div>

          <div className="step-button-row">

            <button
              className="analysis-prev-btn"
              onClick={() => setCurrentStep(1)}
            >
              ← 이전
            </button>

            <button
              className="analysis-next-btn"
              onClick={async () => {

                if (!selectedBehavior) {

                  alert("행동을 선택해주세요.");

                  return;

                }

                setCurrentStep(3);

                await runAnalysis();

              }}
            >
              분석 시작 →
            </button>

          </div>

        </div>

      )}

      {/* STEP3 */}
      {currentStep === 3 && (

        <div className="analysis-step-screen">

          <div className="step-header">

            <span className="step-badge">
              STEP 3
            </span>

            <h3>분석 결과</h3>

          </div>

          {analysis && (

            <div className="card result-box">

              <h3>{analysis.result}</h3>

              <p className="selected-behavior">

                <strong>선택 행동:</strong>{" "}

                {analysis.behavior}

              </p>

              {/* 긴급 행동 */}
              <div className="urgent-action-box">

                <h4>
                  🚨 지금 바로 해야 할 행동
                </h4>

                {analysis.recommendation.map((item, index) => (

                  <div
                    key={index}
                    className="urgent-action-item"
                  >
                    ✅ {item}
                  </div>

                ))}

              </div>

              {/* 체크리스트 */}
              <div className="solution-box">

                <h4>
                  추천 솔루션 체크리스트
                </h4>

                {analysis.recommendation.map((item, index) => (

                  <label
                    key={index}
                    className="solution-item"
                  >

                    <input type="checkbox" />

                    <span>{item}</span>

                  </label>

                ))}

              </div>

              {/* 버튼 */}
              <div className="step-button-row">

                <button
                  className="analysis-prev-btn"
                  onClick={() =>
                    navigate("/records")
                  }
                >
                  기록 보기
                </button>

                {/* ✅ 상세 페이지 이동 */}
                <button
                  className="analysis-next-btn"
                  onClick={() =>
                    navigate(
                      "/analysis-detail",
                      {
                        state: {
                          result: analysis.result,
                          detail: analysis.detail,
                          behavior: analysis.behavior,
                          recommendation: analysis.recommendation,
                       },
                     }
                    )
                   }
                  >
                   상세 분석 보기
                 </button>

              </div>

            </div>

          )}

        </div>

      )}

    </div>

  );
}

export default Analysis;