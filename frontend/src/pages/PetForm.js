import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../App.css";
import "./PetForm.css";
import { FaDog, FaCat, FaCrow, FaFish, FaPaw } from "react-icons/fa";
import { GiGecko, GiRabbit, GiTurtle } from "react-icons/gi";

function PetForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [form, setForm] = useState({
    name: "",
    type: "",
    breed: "",
    gender: "",
    neutered: "",
    age: "",
    weight: "",
    personality: "",
    feature: "",
    image: "",
  });
  
  const breedOptions = {
      강아지: [
        "말티즈", "푸들", "토이푸들", "미니어처푸들", "포메라니안", "치와와", "요크셔테리어",
        "시츄", "페키니즈", "비숑프리제", "닥스훈트", "퍼그", "프렌치불독",
        "보스턴테리어", "웰시코기", "미니핀", "파피용", "재패니즈 스피츠", "꼬똥 드 툴레아",
        "말티푸", "폼스키", "몰키", "슈나우저", "미니어처 슈나우저", "카발리에 킹 찰스 스파니엘",
        "비글", "잭러셀테리어", "웨스트하이랜드화이트테리어", "이탈리안그레이하운드",
        "보더콜리", "진돗개", "시바견", "코커스패니얼", "불독", "아메리칸 불리",
        "차우차우", "달마시안", "호주 셰퍼드","사모예드", "바셋하운드", "휘핏",
        "골든리트리버", "래브라도리트리버", "허스키", "알래스칸 말라뮤트", "셰퍼드", "도베르만",
        "로트와일러", "그레이트데인", "세인트버나드", "뉴펀들랜드", "버니즈마운틴독", "아키타견", "콜리",
        "보르조이", "그레이하운드", "케인코르소", "마스티프", "풍산개", "삽살개", "동경이", "제주개",
      ],

      고양이: ["코리안숏헤어", "페르시안", "러시안블루", "스코티시폴드", "브리티시숏헤어", "먼치킨", "샴",
        "렉돌", "노르웨이숲", "메인쿤", "아메리칸숏헤어", "벵갈", "터키시앙고라", "아비시니안", "버만", "데본렉스", "스핑크스",
        "오시캣", "히말라얀", "이집션마우", "소말리", "라가머핀", "라팜", "셀커크렉스", "싱가푸라",
        "사바나캣", "맹크스", "하바나브라운", "톤키니즈", "발리니즈", "브리티시롱헤어", "페르시안 친칠라", "엑조틱숏헤어", "버미즈",
      ],

      햄스터: ["골든햄스터", "드워프햄스터", "푸딩햄스터", "팬더햄스터", "로보로브스키", "캠벨햄스터",],

      토끼: ["네덜란드 드워프", "라이언헤드", "렉스 토끼", "홀랜드롭", "앙고라토끼",],

      기니피그: ["아비시니안", "페루비안", "테디", "실키",],

      앵무새: [ "코뉴어", "왕관앵무", "모란앵무", "회색앵무", "사랑앵무",],

      도마뱀: ["레오파드게코", "크레스티드게코", "비어디드래곤",],

      거북이: ["리버쿠터", "붉은귀거북", "머스크터틀",],
    };

    const getDefaultIcon = (type) => {
      const style = {
        fontSize: "72px",
        color: "#82ccf1",
      };

       if (type === "강아지") {
        return <FaDog style={style} />;
      }

      if (type === "고양이") {
        return <FaCat style={style} />;
      }

      if (type === "햄스터") {
        return <FaPaw style={style} />;
      }

      if (type === "토끼") {
        return <GiRabbit style={style} />;
      }

      if (type === "앵무새") {
        return <FaCrow style={style} />;
      }

      if (type === "거북이") {
        return <GiTurtle style={style} />;
      }

      if (type === "도마뱀") {
        return <GiGecko style={style} />;
      }

      return <FaFish style={style} />;
    };
    

  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (isEditMode) {
      fetchPet();
    }
  }, [id]);

  const fetchPet = async () => {
  const res = await fetch(`http://localhost:5000/pets/${id}`, {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  });

  const pet = await res.json();

  if (!res.ok) {
    alert(pet.error || "반려동물 정보를 불러오지 못했습니다.");
    navigate("/pets");
    return;
  }

  setForm({
    name: pet.name || "",
    type: pet.type || "",
    breed: pet.breed || "",
    gender: pet.gender || "",
    neutered: pet.neutered || "",
    age: pet.age || "",
    weight: pet.weight || "",
    personality: pet.personality || "",
    feature: pet.feature || "",
    image: "",
  });

  if (pet.image) {
    setPreview(`http://localhost:5000${pet.image}`);
  }
};

 

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setForm({
        ...form,
        image: file,
      });
      setPreview(URL.createObjectURL(file));
    }
  };

  const submitPet = async () => {
    const formData = new FormData();

    formData.append("name", form.name);
    formData.append("type", form.type);
    formData.append("breed", form.breed);
    formData.append("gender", form.gender);
    formData.append("neutered", form.neutered);
    formData.append("age", form.age);
    formData.append("weight", form.weight);
    formData.append("personality", form.personality);
    formData.append("feature", form.feature);

    if (form.image) {
      formData.append("image", form.image);
    }

    const url = isEditMode
      ? `http://localhost:5000/pets/${id}`
      : "http://localhost:5000/pets";

    const method = isEditMode ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: {
        Authorization: localStorage.getItem("token"),
      },
      body: formData,
    });

    alert(isEditMode ? "수정 완료!" : "등록 완료!");
    navigate("/pets");
  };

  return (
    <div className="petform-page">
      <div className="petform-card">
        <div className="petform-header">
          <h2>{isEditMode ? "🐾 반려동물 수정" : "🐾 반려동물 등록"}</h2>
          <p>
            {isEditMode
              ? "기존 정보를 수정해 주세요."
              : "우리 아이의 정보를 입력해 주세요."}
          </p>
        </div>

        <div className="image-preview-area">
          {preview ? (
            <img src={preview} alt="미리보기" className="image-preview" />
          ) : (
            <div className="image-placeholder">
              {getDefaultIcon(form.type)}
            </div>
          )}
        </div>

        <div className="petform-grid">
          <div className="form-group">
            <label>이름</label>
            <input
              className="petform-input"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label>종류</label>
            <select
              className="petform-input"
              name="type"
              value={form.type}
              onChange={handleChange}
            >
              <option value="">종류 선택</option>

              <option value="강아지">강아지</option>
              <option value="고양이">고양이</option>
              <option value="햄스터">햄스터</option>
              <option value="토끼">토끼</option>
              <option value="앵무새">앵무새</option>
              <option value="도마뱀">도마뱀</option>
              <option value="거북이">거북이</option>

              <option value="기타">기타</option>
            </select>
          </div>

          <div className="form-group">
            <label>품종</label>
            {form.type && form.type !== "기타" ? (
            <select
              className="petform-input"
              name="breed"
              value={form.breed}
              onChange={handleChange}
            >
              <option value="">품종 선택</option>
                {[...(breedOptions[form.type] || [])]
                    .sort((a, b) => a.localeCompare(b, "ko"))
                    .map((breed) => (
                      <option key={breed} value={breed}>
                        {breed}
                      </option>
                    ))}

            </select>
          ) : (
            <input
              className="petform-input"
              name="breed"
              placeholder="품종 직접 입력"
              value={form.breed}
              onChange={handleChange}
            />
          )}
          </div>

          <div classname="form-group">
            <label>성별</label>
            <select
              className="petform-input"
              name="gender"
              value={form.gender}
              onChange={handleChange}
            >
              <option value="">성별 선택</option>
              <option value="수컷">수컷</option>
              <option value="암컷">암컷</option>
              <option value="모름">모름</option>
            </select>
          </div>
          
          <div classname="from-group">
            <label>중성화</label>
            <select
              className="petform-input"
              name="neutered"
              value={form.neutered}
              onChange={handleChange}
            >
              <option value="">중성화 여부</option>
              <option value="완료">완료</option>
              <option value="안함">안함</option>
              <option value="모름">모름</option>
            </select>
          </div>

          <div className="form-group">
            <label>나이</label>
            <input
              className="petform-input"
              name="age"
              value={form.age}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>몸무게</label>
            <input
              className="petform-input"
              name="weight"
              value={form.weight}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>성격</label>
            <input
              className="petform-input"
              name="personality"
              value={form.personality}
              onChange={handleChange}
            />
          </div>

          <div className="form-group full-width">
            <label>특징</label>
            <input
              className="petform-input"
              name="feature"
              value={form.feature}
              onChange={handleChange}
            />
          </div>

          <div className="form-group full-width">
            <label>이미지 파일</label>
            <input
              className="petform-input"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
        </div>

        <div className="petform-buttons">
          <button className="petform-btn primary" onClick={submitPet}>
            {isEditMode ? "수정 완료" : "등록하기"}
          </button>

          <button
            className="petform-btn secondary"
            onClick={() => navigate("/pets")}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}

export default PetForm;