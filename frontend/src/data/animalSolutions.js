const getPairKey = (type1, type2) => {
  return [type1, type2].sort().join("-");
};

const createSolution = (text, stage, stageTitle, mission) => ({
  text,
  stage,
  stageTitle,
  checked: false,
  memo: "",
  mission: {
    title: mission.title,
    description: mission.description,
    successCondition: mission.successCondition,
    completed: false,
  },
});
export const getStageSolutions = (type1, type2, trend) => {
  const pairKey = getPairKey(type1, type2);

  const defaultMission = {
    title: "관찰 미션",
    description: "두 반려동물의 반응을 무리하지 않고 짧게 관찰해주세요.",
    successCondition: "강한 공격, 추격, 회피 행동 없이 관찰을 마치면 성공",
  };

  const defaultSolutions = [
    createSolution(
      "처음에는 짧은 시간만 만나게 하기",
      1,
      "안전 관찰",
      defaultMission
    ),
    createSolution(
      "각자의 독립 공간 확보하기",
      2,
      "환경 준비",
      defaultMission
    ),
    createSolution(
      "스트레스 행동이 나타나는지 관찰하기",
      3,
      "행동 관찰",
      defaultMission
    ),
  ];

  const solutionMap = {
    "강아지-강아지": {
      harmony: [
        createSolution(
          "같은 공간에서 차분히 쉬게 하기",
          1,
          "긍정 행동 관찰",
          {
            title: "공존 미션",
            description: "두 강아지가 같은 공간에서 보호자와 함께 편안히 머물게 해주세요.",
            successCondition: "으르렁거림이나 몸싸움 없이 10분 이상 머무르면 성공",
          }
        ),
        createSolution(
          "차분한 행동을 보이면 간식이나 칭찬으로 보상하기",
          2,
          "긍정 강화",
          {
            title: "칭찬 미션",
            description: "서로를 향해 공격 행동 없이 차분히 있을 때 바로 칭찬해주세요.",
            successCondition: "차분한 행동을 3회 이상 보상하면 성공",
          }
        ),
        createSolution(
          "장난감과 식사 공간은 따로 제공하기",
          3,
          "자원 경쟁 예방",
          {
            title: "자원 분리 미션",
            description: "장난감과 밥그릇을 각각 따로 제공해 경쟁 상황을 줄여주세요.",
            successCondition: "식사나 놀이 중 다툼 없이 마치면 성공",
          }
        ),
      ],

      conflict: [
        createSolution(
          "즉시 공간 분리하기",
          1,
          "안전 확보",
          {
            title: "즉시 분리 미션",
            description: "으르렁거림, 응시, 털 세우기 등 공격 신호가 보이면 바로 공간을 분리해주세요.",
            successCondition: "분리 후 10분 이상 진정 상태를 유지하면 성공",
          }
        ),
        createSolution(
          "식기, 간식, 장난감을 각각 따로 제공하기",
          2,
          "자원 분리",
          {
            title: "자원 분리 미션",
            description: "밥그릇과 장난감을 떨어진 위치에 두고 경쟁 상황을 만들지 마세요.",
            successCondition: "식사 또는 놀이 중 접근 다툼이 없으면 성공",
          }
        ),
        createSolution(
          "리드줄을 착용한 상태에서 짧게 재소개하기",
          3,
          "재소개 훈련",
          {
            title: "거리 유지 미션",
            description: "두 강아지를 2m 이상 떨어뜨린 상태에서 짧게 마주 보게 해주세요.",
            successCondition: "으르렁거림 없이 5분 이상 유지하면 성공",
          }
        ),
        createSolution(
          "차분한 반응을 보일 때만 간식으로 보상하기",
          4,
          "긍정 강화",
          {
            title: "차분함 보상 미션",
            description: "상대 강아지를 보고도 차분히 있을 때 간식이나 칭찬을 제공해주세요.",
            successCondition: "공격 없이 차분한 반응을 3회 이상 보이면 성공",
          }
        ),
      ],
    },

    "강아지-고양이": {
      harmony: [
        createSolution(
          "고양이가 숨거나 올라갈 수 있는 공간 마련하기",
          1,
          "안전 공간 확보",
          {
            title: "고양이 안전공간 미션",
            description: "고양이가 원할 때 피할 수 있는 높은 공간이나 숨숨집을 마련해주세요.",
            successCondition: "고양이가 도망치지 않고 스스로 공간을 선택하면 성공",
          }
        ),
        createSolution(
          "강아지가 고양이를 추격하지 않도록 보호자가 감독하기",
          2,
          "추격 예방",
          {
            title: "추격 금지 미션",
            description: "강아지가 고양이를 보고도 따라가지 않도록 차분히 제지해주세요.",
            successCondition: "추격 행동 없이 5분 이상 유지하면 성공",
          }
        ),
        createSolution(
          "서로 차분할 때 간식으로 긍정 강화하기",
          3,
          "긍정 강화",
          {
            title: "공존 보상 미션",
            description: "강아지와 고양이가 같은 공간에서 차분히 있을 때 각각 보상해주세요.",
            successCondition: "공격, 추격, 하악질 없이 5분 이상 있으면 성공",
          }
        ),
      ],

      conflict: [
        createSolution(
          "직접 접촉을 막고 즉시 분리하기",
          1,
          "안전 확보",
          {
            title: "접촉 차단 미션",
            description: "강아지와 고양이가 흥분했을 때 직접 만나지 않도록 공간을 분리해주세요.",
            successCondition: "분리 후 서로 진정된 상태를 보이면 성공",
          }
        ),
        createSolution(
          "고양이의 높은 공간과 숨숨집 확보하기",
          2,
          "도피 공간 마련",
          {
            title: "도피 공간 미션",
            description: "고양이가 강아지를 피할 수 있는 높은 공간이나 숨을 장소를 만들어주세요.",
            successCondition: "고양이가 안정적으로 숨거나 쉬면 성공",
          }
        ),
        createSolution(
          "강아지는 리드줄을 착용한 상태에서 짧게 만나기",
          3,
          "통제된 만남",
          {
            title: "짧은 만남 미션",
            description: "강아지를 리드줄로 통제한 상태에서 고양이와 거리를 두고 만나게 해주세요.",
            successCondition: "추격 행동 없이 3~5분 유지하면 성공",
          }
        ),
        createSolution(
          "공격이나 추격이 없을 때만 칭찬과 간식 제공하기",
          4,
          "긍정 강화",
          {
            title: "차분함 강화 미션",
            description: "서로를 보고도 차분할 때만 보상해주세요.",
            successCondition: "차분한 반응을 3회 이상 보이면 성공",
          }
        ),
      ],
    },

    "고양이-고양이": {
      harmony: [
        createSolution(
          "각자의 숨숨집과 휴식 공간 제공하기",
          1,
          "개별 공간 확보",
          {
            title: "휴식 공간 미션",
            description: "두 고양이가 각자의 공간에서 안정적으로 쉴 수 있게 해주세요.",
            successCondition: "서로 방해하지 않고 10분 이상 쉬면 성공",
          }
        ),
        createSolution(
          "같은 공간에서 간식이나 사료를 거리 두고 급여하기",
          2,
          "긍정 경험 만들기",
          {
            title: "거리 급식 미션",
            description: "서로를 마주보지 않게 거리를 두고 간식을 주세요.",
            successCondition: "하악질 없이 간식을 먹으면 성공",
          }
        ),
        createSolution(
          "함께 놀이하되 한 마리가 일방적으로 몰아붙이면 중단하기",
          3,
          "놀이 조절",
          {
            title: "놀이 관찰 미션",
            description: "두 고양이의 놀이 중 발톱, 일방적 추격, 하악질이 있는지 관찰해주세요.",
            successCondition: "과격한 행동 없이 놀이를 마치면 성공",
          }
        ),
      ],

      conflict: [
        createSolution(
          "흥분이 가라앉을 때까지 각각의 공간에 분리하기",
          1,
          "즉시 분리",
          {
            title: "분리 안정 미션",
            description: "다툼 후에는 두 고양이를 각각의 공간에 분리해 진정시켜주세요.",
            successCondition: "하악질, 울음, 공격 시도 없이 안정되면 성공",
          }
        ),
        createSolution(
          "수건이나 양말을 이용해 서로의 냄새를 교환하기",
          2,
          "페로몬 교환",
          {
            title: "냄새 교환 미션",
            description: "각 고양이의 얼굴 주변 냄새가 묻은 수건을 서로의 공간에 놓아주세요.",
            successCondition: "냄새를 맡고도 공격 반응이 없으면 성공",
          }
        ),
        createSolution(
          "문틈이나 안전문 사이로 멀리서 서로를 보게 하기",
          3,
          "시선 교환",
          {
            title: "시선 교환 미션",
            description: "문틈이나 안전문 사이로 서로를 짧게 보게 하고 간식을 주세요.",
            successCondition: "하악질이나 돌진 없이 3분 이상 있으면 성공",
          }
        ),
        createSolution(
          "공격하지 않았을 때 간식과 칭찬으로 보상하기",
          4,
          "긍정 강화",
          {
            title: "공격 없는 만남 미션",
            description: "두 고양이가 같은 공간에 있을 때 공격하지 않으면 바로 보상해주세요.",
            successCondition: "공격 없이 5분 이상 머무르면 성공",
          }
        ),
      ],
    },

    "앵무새-앵무새": {
      harmony: [
        createSolution(
          "충분히 넓은 케이지 제공하기",
          1,
          "공간 확보",
          {
            title: "케이지 점검 미션",
            description: "두 새가 날거나 움직일 수 있을 만큼 공간이 충분한지 확인해주세요.",
            successCondition: "서로 밀어내거나 괴롭히지 않으면 성공",
          }
        ),
        createSolution(
          "모이통과 물통을 여러 개 배치하기",
          2,
          "자원 분리",
          {
            title: "먹이 경쟁 예방 미션",
            description: "모이통과 물통을 여러 위치에 두어 경쟁을 줄여주세요.",
            successCondition: "먹이 주변에서 공격 행동이 없으면 성공",
          }
        ),
        createSolution(
          "괴롭힘을 당하는 개체가 없는지 관찰하기",
          3,
          "사회성 관찰",
          {
            title: "괴롭힘 관찰 미션",
            description: "한 마리가 계속 쫓기거나 밀려나는지 관찰해주세요.",
            successCondition: "특정 개체가 반복적으로 쫓기지 않으면 성공",
          }
        ),
      ],

      conflict: [
        createSolution(
          "공격받는 새를 다른 케이지로 분리하기",
          1,
          "즉시 분리",
          {
            title: "케이지 분리 미션",
            description: "공격받는 새가 있다면 즉시 별도 케이지로 옮겨주세요.",
            successCondition: "분리 후 깃털 뽑기, 떨림, 공격 반응이 줄면 성공",
          }
        ),
        createSolution(
          "케이지 넓이, 횃대, 모이통 수를 늘리기",
          2,
          "환경 개선",
          {
            title: "환경 확장 미션",
            description: "횃대와 먹이 공간을 늘려 영역 경쟁을 줄여주세요.",
            successCondition: "모이통 주변 다툼이 줄어들면 성공",
          }
        ),
        createSolution(
          "놀이 시간이나 방사 시간을 따로 운영하기",
          3,
          "접촉 조절",
          {
            title: "분리 놀이 미션",
            description: "공격성이 있는 새와 다른 새의 놀이 시간을 따로 운영해주세요.",
            successCondition: "놀이 시간 중 공격 행동이 없으면 성공",
          }
        ),
      ],
    },

    "햄스터-햄스터": {
      conflict: [
        createSolution(
          "즉시 개별 케이지로 분리하기",
          1,
          "합사 중단",
          {
            title: "개별 케이지 미션",
            description: "햄스터는 단독생활 성향이 강하므로 각각 따로 사육해주세요.",
            successCondition: "분리 후 싸움, 추격, 물림이 없으면 성공",
          }
        ),
        createSolution(
          "먹이와 물을 각각 따로 제공하기",
          2,
          "자원 분리",
          {
            title: "개별 급여 미션",
            description: "각 햄스터에게 별도의 먹이와 물을 제공해주세요.",
            successCondition: "먹이 경쟁이 발생하지 않으면 성공",
          }
        ),
        createSolution(
          "다른 동물의 시선이 닿지 않는 위치에 케이지 두기",
          3,
          "스트레스 감소",
          {
            title: "시야 차단 미션",
            description: "햄스터가 큰 동물에게 노출되지 않도록 케이지 위치를 조정해주세요.",
            successCondition: "숨기, 떨림, 과도한 경계가 줄면 성공",
          }
        ),
      ],
    },

    "도마뱀-도마뱀": {
      conflict: [
        createSolution(
          "교미 후 괴롭힘이 지속되면 즉시 격리하기",
          1,
          "상처 예방",
          {
            title: "격리 관찰 미션",
            description: "한 도마뱀이 다른 도마뱀을 계속 물거나 괴롭히는지 확인해주세요.",
            successCondition: "물기나 추격이 보이면 즉시 분리하면 성공",
          }
        ),
        createSolution(
          "온도와 습도를 안정적으로 유지하기",
          2,
          "환경 안정",
          {
            title: "온습도 점검 미션",
            description: "사육장 온도와 습도가 급격히 변하지 않도록 확인해주세요.",
            successCondition: "정해진 온습도 범위가 유지되면 성공",
          }
        ),
        createSolution(
          "은신처와 산란 장소를 충분히 제공하기",
          3,
          "공간 확보",
          {
            title: "은신처 제공 미션",
            description: "각 도마뱀이 숨을 수 있는 공간을 따로 마련해주세요.",
            successCondition: "한 개체가 계속 쫓기지 않으면 성공",
          }
        ),
      ],
    },

    "거북이-거북이": {
      harmony: [
        createSolution(
          "충분한 크기의 사육장을 사용하기",
          1,
          "공간 확보",
          {
            title: "사육장 점검 미션",
            description: "거북들이 서로 밀어내지 않을 만큼 공간이 충분한지 확인해주세요.",
            successCondition: "한 마리가 계속 밀려나지 않으면 성공",
          }
        ),
        createSolution(
          "열원을 한쪽에 설치해 온도 편차 만들기",
          2,
          "온도 구역 조성",
          {
            title: "온도 구역 미션",
            description: "따뜻한 구역과 시원한 은신처 구역을 나누어 주세요.",
            successCondition: "거북이 스스로 온도 구역을 이동하면 성공",
          }
        ),
        createSolution(
          "은신처와 휴식 공간을 제공하기",
          3,
          "안정 공간",
          {
            title: "은신처 미션",
            description: "거북이 쉴 수 있는 은신처를 마련해주세요.",
            successCondition: "은신처를 이용하며 안정적으로 머무르면 성공",
          }
        ),
      ],
    },

    "강아지-토끼": {
      conflict: [
        createSolution(
          "직접 접촉을 금지하고 생활 공간을 분리하기",
          1,
          "접촉 차단",
          {
            title: "접촉 금지 미션",
            description: "강아지가 토끼에게 직접 접근하지 못하도록 공간을 분리해주세요.",
            successCondition: "토끼가 도망치거나 숨지 않고 안정적으로 있으면 성공",
          }
        ),
        createSolution(
          "토끼 은신처와 안전 울타리 마련하기",
          2,
          "안전 공간",
          {
            title: "토끼 은신처 미션",
            description: "토끼가 안심하고 숨을 수 있는 나무 재질 은신처를 마련해주세요.",
            successCondition: "토끼가 은신처에서 편안히 쉬면 성공",
          }
        ),
        createSolution(
          "강아지의 추격 행동을 즉시 차단하기",
          3,
          "추격 예방",
          {
            title: "추격 차단 미션",
            description: "강아지가 토끼를 따라가려 하면 바로 주의를 돌려주세요.",
            successCondition: "추격 없이 5분 이상 같은 공간에 있으면 성공",
          }
        ),
      ],
    },

    "고양이-토끼": {
      conflict: [
        createSolution(
          "직접 접촉을 제한하기",
          1,
          "접촉 차단",
          {
            title: "안전 거리 미션",
            description: "고양이가 토끼에게 직접 다가가지 못하게 안전 거리를 유지해주세요.",
            successCondition: "토끼가 놀라서 도망가지 않으면 성공",
          }
        ),
        createSolution(
          "토끼에게 은신처 제공하기",
          2,
          "은신처 제공",
          {
            title: "은신처 안정 미션",
            description: "토끼가 안심하고 숨을 수 있는 공간을 마련해주세요.",
            successCondition: "토끼가 은신처에서 안정적으로 머무르면 성공",
          }
        ),
        createSolution(
          "고양이의 추격이나 사냥 행동 관찰하기",
          3,
          "포식 행동 관찰",
          {
            title: "추격 관찰 미션",
            description: "고양이가 토끼를 계속 응시하거나 추격하려는지 관찰해주세요.",
            successCondition: "추격 행동이 없으면 성공",
          }
        ),
      ],
    },
  };

  if (solutionMap[pairKey]?.[trend]) {
    return solutionMap[pairKey][trend];
  }

  if (solutionMap[pairKey]?.conflict && trend !== "harmony") {
    return solutionMap[pairKey].conflict;
  }

  return defaultSolutions;
};