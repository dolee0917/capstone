import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import "./Pets.css";
import { FaDog, FaCat, FaCrow, FaFish, FaPaw } from "react-icons/fa";
import { GiRabbit, GiTurtle, GiGecko } from "react-icons/gi";


function Pets() {
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);
  const getDefaultIcon = (type) => {
    const style = {
      fontSize: "72px",
      color: "#6c7cff",
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

  
  const fetchPets = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("로그인이 필요합니다.");
    navigate("/login");
    return;
  }

  try {
    const res = await fetch("https://capstone-swkb.onrender.com/pets", {
      headers: {
        Authorization: token,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      console.log("반려동물 조회 실패:", data);

      if (res.status === 401) {
        alert("로그인 정보가 만료되었습니다. 다시 로그인해주세요.");
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      alert(data.error || "반려동물 조회 실패");
      return;
    }

    setPets(Array.isArray(data) ? data : []);
  } catch (error) {
    console.error("반려동물 조회 오류:", error);
    alert("서버 연결에 실패했습니다.");
  }
};

const getImageUrl = (image) => {
  if (!image) return "";

  if (image.startsWith("http")) {
    return image;
  }

  return `https://capstone-swkb.onrender.com${image}`;
};


  useEffect(() => {
    fetchPets();  

  }, []);


  return (
    <div className="pets-page">
      <div className="pets-header">
        <h1>🐾 반려동물 관리</h1>

        <button
          className="add-pet-btn"
          onClick={() => navigate("/pets/new")}
        >
          + 반려동물 추가
        </button>
      </div>

      <div className="pet-grid">
        {pets.map((pet) => (
          <div
            key={pet._id}
            className="pet-card"
            onClick={() => navigate(`/pets/${pet._id}`)}
            style={{ cursor: "pointer" }}
          >
            <div className="pet-image-wrap"
            
            >
              {pet.image ? (
                <img
                  src={getImageUrl(pet.image)}
                  alt={pet.name}
                  className="pet-image"
                />
              ) : (
                <div className="pet-default-icon">
                  {getDefaultIcon(pet.type)}
                </div>
              )}
            </div>

            <h3 className="pet-title">{pet.name}</h3>

            <div className="pet-simple-info">
              <p>{pet.type || "-"} · {pet.age ? `${pet.age}살` : "-"}</p>
            </div>
      </div>
        ))}
    </div>
  </div>
  );
  }


export default Pets;