import { useEffect, useState } from "react";
import "../App.css";
import "./Analysis.css";

function Analysis({ logout }) {

  const [pets, setPets] = useState([]);
  const [selectedPet1, setSelectedPet1] = useState("");
  const [selectedPet2, setSelectedPet2] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [selectedBehavior, setSelectedBehavior] = useState("");
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
  {
    category: "❓ 기타",
    items: [
      "처음 만남",
      "행동 판단 어려움",
      "일시적 긴장 상태",
      "관찰 필요",
    ],
  },
];

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
      scoreImpact: -15,
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
      scoreImpact: 15,
      trend: "harmony",
    };
  }

  if (
    [
      "숨기",
      "떨기",
      "반복 울음",
      "과도한 경계",
      "식욕 감소",
      "특정 공간 회피",
      "움직임 감소",
    ].includes(behavior)
  ) {
    return {
      category: "스트레스",
      scoreImpact: -8,
      trend: "stress",
    };
  }

  return {
    category: "관찰",
    scoreImpact: 0,
    trend: "observe",
  };
};

  const analyzePets = (p1, p2) => {

    if (!p1 || !p2) {
      return {
        result: "분석 불가",
        detail: "두 반려동물을 모두 선택해주세요.",
        score: 0,
        recommendation: [],
      };
    }

    const type1 = p1.type;
    const type2 = p2.type;

    const types = [type1, type2].sort().join("-");

    console.log(types);

    const analysisMap = {

      "강아지-강아지": {
        result: "🟡 서열 및 영역 갈등 가능성",
        score: 65,
        detail: `
강아지는 무리 생활 기반의 사회적 동물로 안정적인 계급 구조를 형성하려는 특성이 있습니다.

같은 공간에서 생활하는 강아지들은 자연스럽게 우위 관계를 만들려고 하며,
특히 성견 사이에서는 식사 공간, 장난감, 보호자의 관심 등을 두고 경쟁이 발생할 수 있습니다.

직접 응시하기, 으르렁거리기, 털 세우기, 꼬리를 빳빳하게 세우는 행동은 대표적인 우위성 공격 행동입니다.

우위성 공격성이 자주 나타나는 품종으로는
잉글리시 스프링거 스패니얼, 코커 스패니얼, 라사 압소, 푸들, 골든 리트리버 등이 있습니다.

또한 사회화 부족, 두려운 경험, 낯선 환경은 공격성을 더욱 증가시킬 수 있습니다.

특히 보호자 관심 경쟁 상황이나
먹이 경쟁이 반복되면 갈등 빈도가 높아질 가능성이 큽니다.
        `,
        recommendation: [
          "식사 공간과 휴식 공간 분리하기",
          "장난감 경쟁 상황 만들지 않기",
          "산책을 함께 진행해 긍정 경험 만들기",
          "흥분 상태가 높아지기 전에 개입하기",
          "싸움 시 손으로 직접 말리지 않기",
          "물 뿌리기 또는 큰 소리로 주의 분산하기",
        ],
      },

      "강아지-고양이": {
        result: "🟡 행동 언어 차이로 인한 스트레스 가능",
        score: 60,
        detail: `
강아지는 사회적 접근 행동을 선호하지만,
고양이는 독립적이며 영역 중심 생활을 하는 동물입니다.

강아지의 놀이 행동이 고양이에게 위협으로 느껴질 수 있으며,
반대로 고양이의 도망 행동은 강아지의 추적 본능을 자극할 수 있습니다.

강아지가 흥분 상태에서 반복적으로 고양이를 쫓는 경우
고양이는 만성 스트레스 상태에 빠질 수 있습니다.

특히 고양이는 자신만의 영역을 중요하게 생각하기 때문에
숨을 수 있는 공간이 부족하면 공격 행동이 증가할 가능성이 있습니다.
        `,
        recommendation: [
          "고양이 전용 수직 공간 확보하기",
          "캣타워 및 숨숨집 제공하기",
          "강아지가 고양이를 쫓지 못하게 통제하기",
          "처음에는 울타리로 거리 두기",
          "각자의 식사 공간 분리하기",
          "고양이가 스스로 접근하도록 기다리기",
        ],
      },

      "강아지-앵무새": {
        result: "🔴 포식 본능 위험",
        score: 30,
        detail: `
강아지는 새의 움직임을 사냥 자극으로 인식할 수 있습니다.

앵무새는 스트레스에 매우 민감하며,
위협 환경이 지속되면 깃털을 뽑는 문제 행동까지 나타날 수 있습니다.

앵무새는 사회성이 높지만,
지속적인 위협 환경에서는 극심한 스트레스 상태에 빠질 수 있습니다.
        `,
        recommendation: [
          "앵무새 비행 시간에는 강아지 분리하기",
          "새장 주변 접근 금지",
          "앵무새 전용 조용한 공간 확보하기",
          "새장 높이를 충분히 높게 배치하기",
        ],
      },

      "고양이-고양이": {
        result: "🟡 영역 갈등 가능",
        score: 70,
        detail: `
고양이는 독립적이며 영역 중심 생활을 하는 동물입니다.

성묘와 어린 고양이가 함께 생활할 경우
활동량 차이와 영역 문제로 갈등이 자주 발생합니다.

특히 동물병원 방문 후 냄새가 달라진 경우
서로의 페로몬을 인식하지 못해 싸움이 발생하기도 합니다.

하악질, 앞발 공격, 응시는 공격 신호일 가능성이 높습니다.
        `,
        recommendation: [
          "숨숨집 각각 제공하기",
          "페로몬 교환 진행하기",
          "식사 공간 분리하기",
          "24~48시간 분리 후 재소개하기",
          "문틈 시선 교환 단계 진행하기",
        ],
      },

      "고양이-앵무새": {
        result: "🔴 매우 위험",
        score: 10,
        detail: `
고양이는 새를 본능적인 사냥 대상으로 인식합니다.

고양이 침 속 세균은 새에게 치명적일 수 있습니다.

단순한 장난 수준의 접촉만으로도
앵무새 건강에 심각한 위험이 발생할 수 있습니다.
        `,
        recommendation: [
          "완전 분리 사육",
          "앵무새 방 따로 운영하기",
          "직접 접촉 절대 금지",
          "고양이 접근 차단하기",
        ],
      },

      // analysisMap 안에 추가하세요

"강아지-기니피그": {
  result: "🔴 소음 및 스트레스 위험",
  score: 25,
  detail: `
기니피그는 매우 예민하고 겁이 많은 초식동물입니다.

강아지의 짖음, 빠른 움직임, 반복적인 접근 행동은
기니피그에게 극심한 스트레스를 유발할 수 있습니다.

기니피그는 고온다습 환경에도 약하기 때문에
활동량이 많은 강아지 주변 환경은 지속적인 긴장 상태를 만들 수 있습니다.
  `,
  recommendation: [
    "기니피그 케이지를 조용한 공간에 배치하기",
    "강아지 접근 차단하기",
    "은신처 충분히 제공하기",
    "스트레스 행동 지속 관찰하기",
  ],
},

"강아지-고슴도치": {
  result: "🔴 스트레스 및 공격 위험",
  score: 20,
  detail: `
고슴도치는 야행성이며
큰 소리와 지속적인 접촉에 매우 민감한 동물입니다.

강아지가 호기심으로 접근하거나 짖는 행동만으로도
고슴도치는 큰 스트레스를 받을 수 있습니다.

낮 시간 방해가 반복되면 수면 패턴이 깨져
건강 악화로 이어질 가능성이 있습니다.
  `,
  recommendation: [
    "직접 접촉 금지",
    "조용한 공간에서 사육하기",
    "은신처 충분히 제공하기",
    "야간 활동 방해하지 않기",
  ],
},

"강아지-도마뱀": {
  result: "🟡 환경 관리 필요",
  score: 45,
  detail: `
도마뱀은 온도와 습도 유지가 매우 중요한 동물입니다.

강아지가 사육장을 건드리거나 반복적으로 접근할 경우
도마뱀은 큰 스트레스를 받을 수 있습니다.

특히 쿨링(동면) 시기에는
환경 변화가 건강에 치명적일 수 있습니다.
  `,
  recommendation: [
    "사육장 접근 차단하기",
    "자동 온도 조절기 사용하기",
    "온습도 일정하게 유지하기",
    "전선 및 열원 보호하기",
  ],
},

"강아지-거북이": {
  result: "🟡 열원 및 환경 관리 필요",
  score: 50,
  detail: `
거북은 스스로 체온 조절이 어렵기 때문에
안정적인 열원 유지가 매우 중요합니다.

강아지가 사육장을 건드리면
온도 균형이 무너질 가능성이 있습니다.

특히 basking zone과 cool zone의 균형이 깨지면
거북 건강에 악영향을 줄 수 있습니다.
  `,
  recommendation: [
    "거북 사육장 안정적으로 고정하기",
    "열원 접근 차단하기",
    "상부열원 보호망 설치하기",
    "거북 은신처 제공하기",
  ],
},

"고양이-토끼": {
  result: "🔴 스트레스 위험",
  score: 25,
  detail: `
토끼는 매우 예민한 초식동물이며
고양이의 존재만으로도 긴장 상태가 될 수 있습니다.

특히 갑작스러운 접근이나 응시는
토끼에게 강한 공포 반응을 유발할 수 있습니다.

토끼는 놀람 반응이 강해
도망치다가 다칠 위험도 존재합니다.
  `,
  recommendation: [
    "생활 공간 완전히 분리하기",
    "토끼 은신처 충분히 제공하기",
    "직접 접촉 피하기",
    "스트레스 행동 지속 관찰하기",
  ],
},

"고양이-기니피그": {
  result: "🔴 포식 관계 위험",
  score: 20,
  detail: `
기니피그는 작은 초식동물이며
고양이에게 먹이동물로 인식될 가능성이 있습니다.

고양이의 응시와 접근만으로도
기니피그는 지속적인 스트레스를 받을 수 있습니다.
  `,
  recommendation: [
    "기니피그 공간 완전 분리하기",
    "고양이 접근 제한하기",
    "은신처 충분히 제공하기",
  ],
},

"고양이-고슴도치": {
  result: "🟡 지속적 스트레스 가능",
  score: 40,
  detail: `
고슴도치는 방어 행동으로 몸을 말고 가시를 세우지만,
지속적인 스트레스는 건강 악화로 이어질 수 있습니다.

고양이가 반복적으로 접근하거나 건드릴 경우
고슴도치는 만성 스트레스를 받을 수 있습니다.
  `,
  recommendation: [
    "직접 접촉 피하기",
    "조용한 환경 유지하기",
    "은신처 충분히 제공하기",
  ],
},

"고양이-도마뱀": {
  result: "🔴 사냥 본능 위험",
  score: 20,
  detail: `
고양이는 작은 움직임에 매우 민감하여
도마뱀을 사냥 대상으로 인식할 가능성이 높습니다.

반복적인 응시와 접근만으로도
도마뱀은 스트레스를 받을 수 있습니다.
  `,
  recommendation: [
    "사육장 보호망 설치하기",
    "고양이 접근 제한하기",
    "사육장 높은 곳 배치하기",
  ],
},

"고양이-거북이": {
  result: "🟡 열원 방해 가능",
  score: 45,
  detail: `
고양이는 따뜻한 장소를 좋아하기 때문에
거북 열원 위에 올라가려 할 수 있습니다.

이는 환기 방해와 화상 위험으로 이어질 수 있습니다.
  `,
  recommendation: [
    "열원 보호망 설치하기",
    "고양이 접근 차단하기",
    "거북 은신처 제공하기",
  ],
},

"앵무새-앵무새": {
  result: "🟢 사회성 형성 가능",
  score: 85,
  detail: `
앵무새는 사회성이 높은 조류입니다.

하지만 좁은 공간에서는 영역 경쟁,
스트레스 행동, 과도한 울음 행동이 나타날 수 있습니다.

무계획적인 번식 문제도 발생할 수 있습니다.
  `,
  recommendation: [
    "넓은 케이지 사용하기",
    "장난감과 횃대 여러 개 제공하기",
    "암수 분리 관리하기",
    "괴롭힘 행동 관찰하기",
  ],
},

"앵무새-햄스터": {
  result: "🟡 소음 스트레스 가능",
  score: 50,
  detail: `
앵무새의 큰 울음소리는
햄스터에게 스트레스를 유발할 수 있습니다.

햄스터는 야행성이기 때문에
주행성인 앵무새와 생활 패턴 차이도 존재합니다.
  `,
  recommendation: [
    "생활 공간 분리하기",
    "햄스터 은신처 충분히 제공하기",
    "소음 최소화하기",
  ],
},

"앵무새-토끼": {
  result: "🟡 환경 적응 필요",
  score: 55,
  detail: `
앵무새의 날갯짓과 울음소리는
토끼를 긴장시키는 원인이 될 수 있습니다.

토끼는 반복적인 소음에 스트레스를 받을 수 있습니다.
  `,
  recommendation: [
    "조용한 환경 유지하기",
    "직접 접촉 피하기",
    "토끼 은신처 제공하기",
  ],
},

"앵무새-기니피그": {
  result: "🟡 소음 스트레스 가능",
  score: 45,
  detail: `
기니피그는 큰 소리에 매우 민감합니다.

앵무새의 울음소리가 반복되면
지속적인 스트레스 상태가 발생할 수 있습니다.
  `,
  recommendation: [
    "케이지 거리 충분히 두기",
    "조용한 환경 유지하기",
    "은신처 제공하기",
  ],
},

"앵무새-고슴도치": {
  result: "🟡 생활 패턴 차이",
  score: 45,
  detail: `
앵무새는 주행성,
고슴도치는 야행성 동물입니다.

생활 패턴 차이로 인해
수면 방해와 스트레스가 발생할 수 있습니다.
  `,
  recommendation: [
    "수면 시간 방해하지 않기",
    "소음 최소화하기",
    "생활 공간 분리하기",
  ],
},

"앵무새-도마뱀": {
  result: "🟡 환경 관리 필요",
  score: 55,
  detail: `
앵무새의 깃털과 배설물이
도마뱀 사육 환경에 영향을 줄 수 있습니다.

도마뱀은 환경 변화에 민감하기 때문에
위생 관리가 중요합니다.
  `,
  recommendation: [
    "사육장 거리 두기",
    "위생 관리 철저히 하기",
    "스트레스 행동 관찰하기",
  ],
},

"앵무새-거북": {
  result: "🟡 환경 안정 필요",
  score: 55,
  detail: `
앵무새의 움직임과 소음이
거북 스트레스로 이어질 수 있습니다.

거북은 안정적인 basking 환경이 중요합니다.
  `,
  recommendation: [
    "거북 은신처 제공하기",
    "사육장 거리 두기",
    "소음 최소화하기",
  ],
},

"햄스터-햄스터": {
  result: "🔴 합사 위험",
  score: 20,
  detail: `
햄스터는 강한 영역성을 가진 단독생활 동물입니다.

합사 시 심한 싸움과 스트레스가 발생할 수 있으며,
심한 경우 생명에 위협이 될 수 있습니다.
  `,
  recommendation: [
    "단독 케이지 사용하기",
    "먹이 경쟁 제거하기",
    "합사 시도 최소화하기",
  ],
},

"토끼-토끼": {
  result: "🟢 안정적 관계 가능",
  score: 80,
  detail: `
토끼는 사회성이 있는 동물이지만
영역성과 성격 차이에 따라 갈등이 발생할 수 있습니다.

충분한 공간과 은신처가 제공되면
안정적인 관계 형성이 가능합니다.
  `,
  recommendation: [
    "넓은 생활 공간 제공하기",
    "은신처 여러 개 설치하기",
    "먹이 공간 분리하기",
  ],
},

"기니피그-기니피그": {
  result: "🟢 비교적 안정적",
  score: 80,
  detail: `
기니피그는 사회성이 있는 동물로
같은 종끼리 안정적인 관계를 형성할 수 있습니다.

다만 공간 부족 시 스트레스가 증가할 수 있습니다.
  `,
  recommendation: [
    "넓은 케이지 제공하기",
    "은신처 여러 개 준비하기",
    "소음 최소화하기",
  ],
},

"고슴도치-고슴도치": {
  result: "🟡 단독 사육 권장",
  score: 45,
  detail: `
고슴도치는 단독생활 성향이 강하며
불필요한 접촉이 스트레스를 유발할 수 있습니다.

합사 시 공격 행동이 나타날 가능성도 존재합니다.
  `,
  recommendation: [
    "단독 사육 권장",
    "은신처 각각 제공하기",
    "스트레스 행동 관찰하기",
  ],
},

"도마뱀-도마뱀": {
  result: "🟡 환경 관리 중요",
  score: 70,
  detail: `
도마뱀은 온도와 습도 유지가 매우 중요합니다.

교미 시 수컷이 암컷을 공격하는 경우도 있어
지속적인 관찰이 필요합니다.
  `,
  recommendation: [
    "온습도 일정하게 유지하기",
    "교미 후 분리하기",
    "산란장 제공하기",
  ],
},

"거북-거북": {
  result: "🟡 열원 경쟁 가능",
  score: 65,
  detail: `
거북은 적절한 열원 확보가 매우 중요합니다.

열원 자리 경쟁이 발생할 수 있으며,
공간 부족 시 스트레스가 증가할 수 있습니다.
  `,
  recommendation: [
    "Hot Zone / Cool Zone 분리하기",
    "열원 여러 개 제공하기",
    "넓은 사육장 사용하기",
  ],
},

"도마뱀-거북": {
  result: "🟡 사육 환경 차이",
  score: 50,
  detail: `
도마뱀과 거북은 요구하는 온도와 습도가 다릅니다.

합사 시 환경 유지가 어려울 수 있으며
스트레스 위험이 존재합니다.
  `,
  recommendation: [
    "별도 사육장 사용하기",
    "온습도 따로 관리하기",
  ],
},

      "고양이-햄스터": {
        result: "🔴 매우 위험",
        score: 10,
        detail: `
햄스터는 고양이에게 대표적인 먹이동물입니다.

고양이의 응시만으로도 햄스터가 스트레스를 받을 수 있습니다.

특히 야간 활동 시간에
고양이가 케이지 주변을 맴돌면
햄스터는 극심한 긴장 상태가 될 수 있습니다.
        `,
        recommendation: [
          "햄스터 케이지를 시야 밖에 두기",
          "고양이 접근 차단하기",
          "햄스터 은신처 제공하기",
        ],
      },

      default: {
        result: "🟡 주의 깊은 관찰 필요",
        score: 50,
        detail: `
서로 다른 종의 동물은 행동 언어와 생활 습성이 다르기 때문에
스트레스와 갈등 가능성이 존재합니다.

처음에는 짧은 시간 동안만 서로를 관찰하게 하고,
강한 스트레스 반응이 나타나는 경우 즉시 분리하는 것이 좋습니다.
        `,
        recommendation: [
          "처음에는 짧은 시간만 함께 있게 하기",
          "각자의 공간 확보하기",
          "스트레스 행동 관찰하기",
        ],
      },
    };

    return analysisMap[types] || analysisMap.default;
  };

  const getSolutionStage = (text) => {
    const safetyKeywords = [
      "분리", "차단", "금지", "직접 접촉", "접근 금지",
      "말리지 않기", "주의 분산", "비행 시간"
    ];

    const environmentKeywords = [
      "공간", "은신처", "숨숨집", "케이지", "사육장",
      "캣타워", "높이", "열원", "온도", "습도",
      "보호망", "식사 공간", "장난감", "횃대"
    ];

    const observationKeywords = [
      "관찰", "기다리기", "재소개", "시선 교환",
      "페로몬", "짧은 시간", "괴롭힘"
    ];

    const maintenanceKeywords = [
      "산책", "소음 최소화", "유지", "관리", "방해하지 않기",
      "먹이 경쟁", "암수 분리"
    ];

    if (safetyKeywords.some((keyword) => text.includes(keyword))) {
      return {
        stage: 1,
        stageTitle: "즉시 안전 확보",
      };
    }

    if (environmentKeywords.some((keyword) => text.includes(keyword))) {
      return {
        stage: 2,
        stageTitle: "환경 준비",
      };
    }

    if (observationKeywords.some((keyword) => text.includes(keyword))) {
      return {
        stage: 3,
        stageTitle: "적응 및 관찰",
      };
    }

    if (maintenanceKeywords.some((keyword) => text.includes(keyword))) {
      return {
        stage: 4,
        stageTitle: "유지 관리",
      };
    }

    return {
      stage: 2,
      stageTitle: "환경 준비",
    };
  };

  const getMissionBySolution = (text, stage) => {
      if (stage === 1) {
        return {
          title: "안전 거리 확보 미션",
          description: "오늘 하루 동안 두 반려동물이 불필요하게 가까워지지 않도록 보호자가 공간을 분리해 주세요.",
          successCondition: "싸움, 추격, 강한 스트레스 반응 없이 하루를 보내면 성공",
          completed: false,
        };
      }

      if (stage === 2) {
        return {
          title: "환경 세팅 미션",
          description: "각 반려동물이 편하게 쉴 수 있는 공간, 은신처, 식사 공간을 준비해 주세요.",
          successCondition: "각자의 공간에서 안정적으로 머무르면 성공",
          completed: false,
        };
      }

      if (stage === 3) {
        return {
          title: "짧은 적응 훈련 미션",
          description: "보호자가 지켜보는 상태에서 짧은 시간 동안 서로를 관찰하게 해주세요.",
          successCondition: "하악질, 짖음, 추격, 공격 행동 없이 5분 이상 유지하면 성공",
          completed: false,
        };
      }

      return {
        title: "긍정 경험 만들기 미션",
        description: "두 반려동물이 같은 공간에서 편안한 경험을 할 수 있도록 간식, 칭찬, 산책 등을 활용해 주세요.",
        successCondition: "보호자의 칭찬 또는 보상과 함께 차분한 상태를 유지하면 성공",
        completed: false,
      };
    };

  const runAnalysis = async () => {
    const p1 = pets.find((p) => p._id === selectedPet1);
    const p2 = pets.find((p) => p._id === selectedPet2);

    const result = analyzePets(p1, p2);
    const behaviorInfo = getBehaviorInfo(selectedBehavior);

      result.score = Math.max(
        0,
        Math.min(100, result.score + behaviorInfo.scoreImpact)
      );

      result.behavior = selectedBehavior;
      result.behaviorCategory = behaviorInfo.category;
      result.relationshipTrend = behaviorInfo.trend;

    setAnalysis(result);

    if (!p1 || !p2) {
      return;
    }

    const saveData = {
      petIds: [p1._id, p2._id],
      petNames: [p1.name, p2.name],
      result: result.result,
      score: result.score,
      summary: result.result,
      detail: result.detail,
      recommendation: result.recommendation.join(", "),
      behavior: selectedBehavior,
      behaviorCategory: behaviorInfo.category,
      scoreImpact: behaviorInfo.scoreImpact,
      relationshipTrend: behaviorInfo.trend,
      solutions: result.recommendation.map((item) => {
        const stageInfo = getSolutionStage(item);
        const mission = getMissionBySolution(item, stageInfo.stage);
        return {
          text: item,
          checked: false,
          stage: stageInfo.stage,
          stageTitle: stageInfo.stageTitle,
          mission,
        };
      }),
      dateTime: new Date(),
    };

    const res = await fetch("http://localhost:5000/analysis", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
      body: JSON.stringify(saveData),
    });

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

      <div className="card">

        <div className="analysis-step-box">
          <div className="step-header">
            <span className="step-badge">STEP 1</span>
            <h3>반려동물 선택</h3>
          </div>

          <p className="step-desc">
            관계를 분석할 두 반려동물을 선택해주세요.
          </p>
          
           <div className="pet-select-area">
          <div className="pet-select-column">
            <h4>첫 번째 반려동물</h4>

            <div className="pet-choice-list">
              {pets.map((pet) => (
                <button
                  key={pet._id}
                  type="button"
                  disabled={selectedPet2 === pet._id}
                  className={
                    selectedPet2 === pet._id
                      ? "pet-choice-card disabled"
                      : selectedPet1 === pet._id
                      ? "pet-choice-card selected"
                      : "pet-choice-card"
                  }
                  onClick={() => {
                    setSelectedPet1(pet._id);

                    if (selectedPet2 === pet._id) {
                      setSelectedPet2("");
                    }
                  }}
                >
                  <div className="pet-choice-icon">
                    {pet.image ? (
                      <img
                        src={`http://localhost:5000${pet.image}`}
                        alt={pet.name}
                        className="pet-choice-img"
                      />
                    ) : (
                      <span>🐾</span>
                    )}
                  </div>
                  <div>
                    <strong>{pet.name}</strong>
                    <span>{pet.type}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="pet-vs-badge">↔</div>

          <div className="pet-select-column">
            <h4>두 번째 반려동물</h4>

            <div className="pet-choice-list">
              {pets.map((pet) => (
                <button
                  key={pet._id}
                  type="button"
                  disabled={selectedPet1 === pet._id}
                  className={
                    selectedPet1 === pet._id
                      ? "pet-choice-card disabled"
                      : selectedPet2 === pet._id
                      ? "pet-choice-card selected"
                      : "pet-choice-card"
                  }
                  onClick={() => setSelectedPet2(pet._id)}
                >
                  <div className="pet-choice-icon">
                    {pet.image ? (
                      <img
                        src={`http://localhost:5000${pet.image}`}
                        alt={pet.name}
                        className="pet-choice-img"
                      />
                    ) : (
                      <span>🐾</span>
                    )}
                  </div>
                  <div>
                    <strong>{pet.name}</strong>
                    <span>{pet.type}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        </div>

        <div className="analysis-step-box">
          <div className="step-header">
            <span className="step-badge">STEP 2</span>
            <h3>현재 행동 선택</h3>
          </div>

          <p className="step-desc">
            최근 두 반려동물 사이에서 관찰된 행동을 선택해주세요.
          </p>

          <div className="behavior-group-list">
            {behaviorOptions.map((group) => (
              <div key={group.category} className="behavior-group">
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
                      onClick={() => setSelectedBehavior(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="selected-preview-card">
          <h4>📌 현재 선택 상태</h4>

          <p>
            <strong>반려동물:</strong>{" "}
            {pets.find((p) => p._id === selectedPet1)?.name || "첫 번째 반려동물"} ↔{" "}
            {pets.find((p) => p._id === selectedPet2)?.name || "두 번째 반려동물"}
          </p>

          <p>
            <strong>관찰 행동:</strong>{" "}
            {selectedBehavior || "아직 행동을 선택하지 않았습니다."}
          </p>
        </div>

        <div className="analysis-step-box">
          <div className="step-header">
            <span className="step-badge">STEP 3</span>
            <h3>관계 분석 시작</h3>
          </div>

          <button className="analysis-main-btn" onClick={runAnalysis}>
            🔍 관계 분석 시작하기
          </button>
        </div>

        <br /><br />

      </div>

      {analysis && (

        <div className="card result-box">

          <h3>{analysis.result}</h3>
          {analysis.behavior && (
            <p className="selected-behavior">
              <strong>선택 행동:</strong> {analysis.behavior}
            </p>
          )}

          <p style={{ whiteSpace: "pre-line" }}>
            {analysis.detail}
          </p>

          <div className="solution-box">

            <h4>추천 솔루션 체크리스트</h4>

            {analysis.recommendation.map((item, index) => (
              <label key={index} className="solution-item">
                <input type="checkbox" />
                <span>{item}</span>
              </label>
            ))}

          </div>

          <p>
            <strong>관계 점수:</strong> {analysis.score}점
          </p>

        </div>

      )}

    </div>
  );
}

export default Analysis;