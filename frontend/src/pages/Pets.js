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
    const res = await fetch("http://localhost:5000/pets", {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });

    const data = await res.json();
    setPets(Array.isArray(data) ? data : []);
  };

  const fetchAnalysis = async () => {
  const res = await fetch("http://localhost:5000/analysis", {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  });

  const data = await res.json();
  setAnalysisList(Array.isArray(data) ? data : []);
};

  useEffect(() => {
    fetchPets();
    fetchAnalysis();

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
                  src={`http://localhost:5000${pet.image}`}
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