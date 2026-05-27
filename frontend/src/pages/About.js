import "./About.css";

function About() {

  return (

    <div className="about-page">

      <div className="about-container">

        <h1>
          🐾 서비스 소개
        </h1>

        <p className="about-subtitle">
          반려동물 간의 관계를 분석하고
          갈등 상황에서 빠르게 대처할 수 있도록
          돕는 다중 반려동물 관리 서비스입니다.
        </p>

        <div className="about-card">

          <h3>
            📌 주요 기능
          </h3>

          <ul>

            <li>
              반려동물 관계 분석
            </li>

            <li>
              행동 기반 갈등/화합 판단
            </li>

            <li>
              긴급 상황 즉시 행동 가이드 제공
            </li>

            <li>
              관계 변화 기록 및 통계 제공
            </li>

          </ul>

        </div>

        <div className="about-card">

          <h3>
            📚 데이터 출처
          </h3>

          <p>

            본 서비스는 다음 자료를 참고하여
            반려동물 행동 데이터를 구성했습니다.

          </p>

          <ul>

            <li>
              연성찬(2004), &lt;반려동물 행동학&gt;, 서울: 도서출판 애니컴
            </li>

            <li>
              나응식, 양이삭(2020), &lt;대집사 고양이 상담소&gt;, 경기도 파주: 김영사
            </li>

            <li>
              시마모리 히사코(2013), &lt;작은새 기르기 43&gt;, 서울: 그린홈
            </li>

            <li>
              코노 토모키(2012), &lt;작은 동물 기르기 263&gt;, 서울: 그린홈
            </li>

            <li>
              패트리샤 바틀릿(2025), &lt;귀여운 털복숭이 친구 햄스터&gt;, 서울: 씨밀레북스
            </li>

            <li>
              이태원⋅문대승⋅박성준⋅차문석⋅안종만⋅안상준(2023), &lt;양서파충류사육학&gt;, 서울: 박영사 
            </li>

          </ul>

        </div>

      </div>

    </div>
  );
}

export default About;