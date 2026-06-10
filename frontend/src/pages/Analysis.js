import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStageSolutions } from "../data/animalSolutions";
import "../App.css";
import "./Analysis.css";

function Analysis() {

  const [pets, setPets] = useState([]);
  const [selectedPet1, setSelectedPet1] = useState("");
  const [selectedPet2, setSelectedPet2] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [customBehavior, setCustomBehavior] = useState("");
  const [selectedBehavior, setSelectedBehavior] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchPets();
  }, []);

  

  const fetchPets = async () => {

    try {

      const res = await fetch("https://capstone-swkb.onrender.com/pets", {
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

  const keywordSolutionMap = [
  {
    keywords: ["밥", "식사", "먹이", "간식", "밥그릇"],
    result: "🟡 먹이 자원 경쟁으로 인한 갈등 가능성",
    detail: `
반려동물들이 밥, 간식, 밥그릇 근처에서 예민하게 반응한다면
먹이 자원에 대한 경쟁심이 원인일 수 있습니다.

식사 공간이 가깝거나 보호자의 관심이 한쪽에 집중되면
갈등이 반복될 가능성이 있습니다.
    `,
    recommendation: [
      "식사 공간 분리하기",
      "간식은 따로 주기",
      "밥그릇 주변에서 접촉 막기",
      "식사 후 그릇 바로 치우기",
    ],
  },
  {
    keywords: ["화장실", "배변", "모래", "패드"],
    result: "🟡 화장실 공간 스트레스 가능성",
    detail: `
화장실이나 배변 공간 근처에서 경계가 생긴다면
공간 점유 스트레스가 원인일 수 있습니다.

특히 고양이는 화장실 위치와 냄새에 민감하게 반응합니다.
    `,
    recommendation: [
      "화장실을 각각 따로 마련하기",
      "화장실 위치를 떨어뜨리기",
      "배변 공간 주변 접근 막기",
      "냄새가 남지 않도록 자주 청소하기",
    ],
  },
  {
    keywords: ["장난감", "공", "인형", "놀이"],
    result: "🟡 장난감 독점으로 인한 갈등 가능성",
    detail: `
장난감이나 놀이 도구를 두고 갈등이 생긴다면
자원 독점 행동일 수 있습니다.

한 마리가 장난감을 차지하려 하거나
다른 반려동물이 접근할 때 위협 행동을 보일 수 있습니다.
    `,
    recommendation: [
      "장난감을 여러 개 준비하기",
      "각자 따로 놀아주는 시간 만들기",
      "흥분이 커지기 전에 놀이 중단하기",
      "장난감 보관 위치 분리하기",
    ],
  },
  {
    keywords: ["숨", "피해", "도망", "회피", "구석"],
    result: "🟠 회피 행동으로 인한 스트레스 가능성",
    detail: `
한 반려동물이 계속 숨거나 도망간다면
상대 반려동물에게 부담을 느끼고 있을 수 있습니다.

억지로 만나게 하기보다 안전한 공간을 먼저 보장해야 합니다.
    `,
    recommendation: [
      "숨을 수 있는 공간 마련하기",
      "억지로 가까이 두지 않기",
      "짧은 시간만 함께 있게 하기",
      "도망갈 수 있는 동선 확보하기",
    ],
  },
  {
    keywords: ["으르렁", "하악질", "공격", "물", "싸움", "위협"],
    result: "🔴 직접적인 갈등 행동 발생",
    detail: `
으르렁거림, 하악질, 물기, 공격 시도는
명확한 갈등 신호입니다.

이 경우 보호자가 손으로 직접 말리기보다
즉시 공간을 분리하는 것이 안전합니다.
    `,
    recommendation: [
      "즉시 공간 분리하기",
      "손으로 직접 싸움 말리지 않기",
      "시야 차단 후 진정 시간 주기",
      "반복될 경우 전문가 상담 고려하기",
    ],
  },
];

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

      "앵무새-앵무새": {
  result: "🟡 영역 및 사회성 문제 가능",
  detail: `
새는 종류에 따라 영역 의식과 사회성이 다릅니다.

일부 핀치류는 여러 마리가 함께 지낼 수 있지만,
문조처럼 공격성을 보이는 종도 있습니다.

좁은 케이지나 부족한 먹이통은 스트레스를 유발할 수 있습니다.

괴롭힘을 당하는 개체가 있는지 관찰이 필요합니다.
  `,
  recommendation: [
    "넓은 케이지 제공",
    "먹이통과 물통 충분히 배치",
    "공격 개체 분리",
    "스트레스 행동 관찰"
  ]
},

"햄스터-햄스터": {
  result: "🔴 합사 스트레스 위험",
  detail: `
햄스터는 대부분 단독생활을 선호합니다.

같은 케이지에서 생활할 경우
영역 다툼이 발생할 수 있으며
심한 경우 부상 또는 폐사로 이어질 수 있습니다.

특별한 경우가 아니라면 단독 사육이 권장됩니다.
  `,
  recommendation: [
    "개별 케이지 사용",
    "합사 지양",
    "먹이 경쟁 제거",
    "스트레스 행동 관찰"
  ]
},

"도마뱀-도마뱀": {
  result: "🟡 번식 및 영역 관리 필요",
  detail: `
도마뱀은 종에 따라 영역 의식이 있으며
번식 시 공격 행동이 나타날 수 있습니다.

수컷은 교미 과정에서 암컷에게 상처를 입힐 수 있으며,
교미 후에도 괴롭힘이 지속될 수 있습니다.

온도와 습도 관리가 매우 중요합니다.
  `,
  recommendation: [
    "온도와 습도 유지",
    "교미 후 격리",
    "은신처 제공",
    "건강 상태 확인"
  ]
},

"거북이-거북이": {
  result: "🟢 사육 환경 점검 필요",
  detail: `
거북이는 적절한 온도 구역과 은신처가 필요합니다.

온도 차이를 제공하지 못하면
스트레스와 건강 문제가 발생할 수 있습니다.

사육장 크기와 열원 설치 상태를 점검해야 합니다.
  `,
  recommendation: [
    "열원 설치",
    "은신처 제공",
    "충분한 사육 공간 확보",
    "온도 편차 유지"
  ]
},

"토끼-토끼": {
  result: "🟡 영역 및 스트레스 관리 필요",
  detail: `
토끼는 갉기와 땅 파기를 좋아하는 동물입니다.

위험한 물건 접근을 차단해야 하며,
은신 공간이 충분하지 않으면 스트레스를 받을 수 있습니다.

개나 고양이와의 합사는 권장되지 않습니다.
  `,
  recommendation: [
    "은신처 제공",
    "위험 물건 제거",
    "넓은 케이지 사용",
    "다른 종과 분리"
  ]
},

"기니피그-기니피그": {
  result: "🟡 환경 스트레스 주의",
  detail: `
기니피그는 고온다습 환경에 약합니다.

큰 소리나 잦은 자극에 스트레스를 받을 수 있으며,
예민한 개체는 은신처가 필요합니다.
  `,
  recommendation: [
    "통풍 좋은 케이지 사용",
    "은신처 제공",
    "큰 소리 차단",
    "온습도 관리"
  ]
},

"고슴도치-고슴도치": {
  result: "🟡 스트레스 관리 필요",
  detail: `
고슴도치는 야행성이며
과도한 접촉과 큰 소리에 스트레스를 받습니다.

적절한 온도와 습도 유지가 중요하며,
은신처를 충분히 제공해야 합니다.
  `,
  recommendation: [
    "은신처 제공",
    "적정 온도 유지",
    "소음 최소화",
    "불필요한 접촉 줄이기"
  ]
},


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

강아지의 놀이 행동이
고양이에게는 위협 행동으로 받아들여질 수 있습니다.

강아지는 무리 생활을 하는 사회적 동물이지만
고양이는 독립성과 영역 의식이 강합니다.

추격 행동, 과도한 접근,
먹이 공간 공유는 갈등 원인이 될 수 있습니다.

고양이가 숨을 공간과
높은 공간을 확보하는 것이 중요합니다.
  `,

  recommendation: [
    "고양이 숨숨 공간 만들기",
    "강아지 추격 행동 막기",
    "처음엔 거리 유지하기",
    "식사 공간 분리하기",
  ],

},

"강아지-앵무새": {

  result: "🟡 추격 및 스트레스 가능성",

  detail: `
강아지는 본능적으로 움직이는 작은 동물을 추적하려는 행동을 보일 수 있습니다.

새는 갑작스러운 움직임과 큰 소리에 민감하기 때문에
강아지의 접근만으로도 스트레스를 받을 수 있습니다.

특히 케이지 밖에서 직접 접촉하는 것은 위험할 수 있습니다.
  `,

  recommendation: [
    "새 케이지를 안전한 위치에 두기",
    "직접 접촉 제한하기",
    "강아지 추격 행동 차단하기",
    "새의 스트레스 행동 관찰하기"
  ],

},

"강아지-거북이": {

  result: "🟡 호기심으로 인한 스트레스 가능",

  detail: `
강아지는 거북을 장난감처럼 인식하거나 과도한 관심을 보일 수 있습니다.

거북은 갑작스러운 접촉과 소음에 스트레스를 받을 수 있으며
사육 환경이 방해받으면 건강에 영향을 줄 수 있습니다.
  `,

  recommendation: [
    "거북 사육장 보호하기",
    "직접 접촉 제한하기",
    "거북 휴식 공간 확보하기",
    "강아지 행동 관찰하기"
  ],

},

"강아지-토끼": {

  result: "🔴 포식 행동 및 스트레스 위험",

  detail: `
토끼는 먹이동물이며 강아지의 추격 행동에 매우 민감합니다.

강아지가 장난으로 접근하더라도
토끼는 강한 공포와 스트레스를 받을 수 있습니다.

특히 소형 토끼는 부상 위험이 존재합니다.
  `,

  recommendation: [
    "직접 접촉 최소화하기",
    "토끼 은신처 제공하기",
    "강아지 추격 행동 차단하기",
    "각자 생활 공간 분리하기"
  ],

},

"고양이-앵무새": {

  result: "🔴 포식 본능 주의",

  detail: `
고양이는 본능적으로 작은 새를 사냥 대상으로 인식할 수 있습니다.

새는 지속적인 시선과 접근만으로도 스트레스를 받을 수 있으며
케이지 밖 접촉은 매우 위험합니다.
  `,

  recommendation: [
    "새 케이지 안전하게 보호하기",
    "직접 접촉 금지하기",
    "새의 스트레스 행동 관찰하기",
    "고양이 접근 제한하기"
  ],

},

"고양이-거북이": {

  result: "🟢 비교적 안정적이나 관찰 필요",

  detail: `
고양이는 거북에게 큰 관심을 보이지 않는 경우가 많습니다.

하지만 반복적으로 만지거나 사육장을 건드리는 행동은
거북에게 스트레스를 줄 수 있습니다.

거북의 생활 환경을 안정적으로 유지하는 것이 중요합니다.
  `,

  recommendation: [
    "거북 사육장 보호하기",
    "고양이 접근 제한하기",
    "거북 스트레스 행동 관찰하기",
    "사육 환경 유지하기"
  ],

},

"고양이-토끼": {

  result: "🟡 스트레스 및 추격 가능성",

  detail: `
고양이는 토끼를 사냥 대상으로 인식할 가능성이 있습니다.

직접 공격하지 않더라도
토끼는 지속적인 시선과 접근에 스트레스를 받을 수 있습니다.

토끼가 숨을 수 있는 공간을 충분히 제공해야 합니다.
  `,

  recommendation: [
    "토끼 은신처 제공하기",
    "직접 접촉 제한하기",
    "고양이 추격 행동 차단하기",
    "생활 공간 분리하기"
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

    const keywordResult = findKeywordSolution(customBehavior || selectedBehavior);

    const result = keywordResult || analyzePets(p1, p2);
    const finalBehavior = customBehavior || selectedBehavior;
    const behaviorInfo = getBehaviorInfo(finalBehavior);

    result.behavior = finalBehavior;
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

      behavior: finalBehavior,

      behaviorCategory: behaviorInfo.category,

      relationshipTrend: behaviorInfo.trend,
      // 기존 솔루션 저장 방식
      //solutions: result.recommendation.map((item) => ({
        //text: item,
        //checked: false,
      //})),
      solutions: getStageSolutions(
        p1.type,
        p2.type,
        behaviorInfo.trend
      ),

      dateTime: new Date(),
    };

    const res = await fetch(
      "https://capstone-swkb.onrender.com/analysis",
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

  const findKeywordSolution = (text) => {
  if (!text.trim()) return null;

  return keywordSolutionMap.find((item) =>
    item.keywords.some((keyword) => text.includes(keyword))
  );
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

          <div className="custom-behavior-box">
            <h4>✍️ 기타 / 직접 작성</h4>

            <textarea
              className="custom-behavior-input"
              placeholder="예: 밥 먹을 때 으르렁거려요, 화장실 근처에서 싸워요"
              value={customBehavior}
              onChange={(e) => {
                setCustomBehavior(e.target.value);
                setSelectedBehavior(e.target.value);
              }}
            />
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