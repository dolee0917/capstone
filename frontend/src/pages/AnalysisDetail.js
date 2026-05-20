import { useLocation, useNavigate } from "react-router-dom";
import "./AnalysisDetail.css";

function AnalysisDetail() {

  const location = useLocation();
  const navigate = useNavigate();

  const {
    result,
    detail,
    behavior,
  } = location.state || {};

  return (

    <div className="detail-page">

      <div className="detail-container">

        <button
          className="back-btn"
          onClick={() => navigate(-1)}
        >
          ← 뒤로가기
        </button>

        <h2>📖 상세 분석 결과</h2>

        <div className="detail-card">

          <h3>{result}</h3>

          <p className="detail-behavior">
            <strong>선택 행동:</strong> {behavior}
          </p>

          {/* 상세 설명 */}
          <div className="detail-description">

            <h4>상세 분석</h4>

            <p style={{ whiteSpace: "pre-line" }}>
              {detail}
            </p>

          </div>

        </div>

      </div>

    </div>

  );
}

export default AnalysisDetail;