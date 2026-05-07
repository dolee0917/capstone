require("dotenv").config({ path: __dirname + "/.env" });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const Analysis = require("./models/Analysis");
//const relationshipAnalysisRoutes = require('./routes/relationshipAnalysisRoutes_backup');

const Pet = require("./models/pet");
const User = require("./models/User");

const app = express();

// 미들웨어
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
//app.use('/api/relationship-analyses', relationshipAnalysisRoutes);

// multer 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// 인증 미들웨어
const auth = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "인증 필요" });
  }

  try {
    const decoded = jwt.verify(token, "secretKey");
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: "토큰 오류" });
  }
};

console.log(process.env.MONGO_URI);

// DB 연결
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("DB 연결 성공"))
  .catch((err) => console.log(err));

// 테스트
app.get("/", (req, res) => {
  res.send("서버 정상 작동!");
});

// 회원가입 API
app.post("/register", async (req, res) => {
  try {
    const {
      email,
      password,
      nickname,
      gender,
      purpose,
      otherPurpose,
      petCount,
      agree,
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "이미 존재하는 이메일" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const finalPurpose = purpose === "기타" ? otherPurpose : purpose;

    const user = new User({
      email,
      password: hashedPassword,
      nickname,
      gender,
      purpose: finalPurpose,
      otherPurpose,
      petCount,
      agree,
    });

    await user.save();
    res.json({ message: "회원가입 성공" });
  } catch (error) {
    res.status(500).json({ error: "회원가입 실패" });
  }
});

// 로그인 API
app.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(400).json({ error: "사용자 없음" });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "비밀번호 틀림" });
    }

    const token = jwt.sign({ userId: user._id }, "secretKey", {
      expiresIn: "5h",
    });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "로그인 실패" });
  }
});

// 반려동물 등록 API
app.post("/pets", auth, upload.single("image"), async (req, res) => {
  try {
    const newPet = new Pet({
      name: req.body.name,
      type: req.body.type,
      breed: req.body.breed,
      gender: req.body.gender,
      neutered: req.body.neutered,
      age: req.body.age,
      weight: req.body.weight,
      personality: req.body.personality,
      feature: req.body.feature,
      image: req.file ? `/uploads/${req.file.filename}` : "",
      userId: req.userId,
    });

    await newPet.save();
    res.json(newPet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 반려동물 전체 조회 API
app.get("/pets", auth, async (req, res) => {
  try {
    const pets = await Pet.find({ userId: req.userId });
    res.json(pets);
  } catch (error) {
    res.status(500).json({ error: "조회 실패" });
  }
});

app.get("/pets/:id", auth, async (req, res) => {
  try {
    const pet = await Pet.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!pet) {
      return res.status(404).json({ error: "해당 반려동물을 찾을 수 없습니다." });
    }

    res.json(pet);
  } catch (error) {
    res.status(500).json({ error: "반려동물 조회 실패" });
  }
});

// 반려동물 수정 API
app.put("/pets/:id", auth, upload.single("image"), async (req, res) => {
  try {
    const updateData = {
      name: req.body.name,
      type: req.body.type,
      breed: req.body.breed,
      gender: req.body.gender,
      neutered: req.body.neutered,
      age: req.body.age,
      weight: req.body.weight,
      personality: req.body.personality,
      feature: req.body.feature,
    };

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const updatedPet = await Pet.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.userId,
      },
      updateData,
      { new: true }
    );

    if (!updatedPet) {
      return res.status(404).json({ error: "해당 데이터 없음 또는 권한 없음" });
    }

    res.json(updatedPet);
  } catch (error) {
    res.status(500).json({ error: "수정 실패" });
  }
});

// 반려동물 삭제 API
app.delete("/pets/:id", auth, async (req, res) => {
  try {
    const deletedPet = await Pet.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!deletedPet) {
      return res.status(404).json({ error: "해당 데이터 없음 또는 권한 없음" });
    }

    res.json({ message: "삭제 완료" });
  } catch (error) {
    res.status(500).json({ error: "삭제 실패" });
  }
});

app.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({ error: "사용자를 찾을 수 없습니다" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "프로필 조회 실패" });
  }
});
// 마이페이지 수정
app.put("/profile", auth, async (req, res) => {
  try {
    const { nickname, gender, purpose, otherPurpose, petCount } = req.body;

    const finalPurpose = purpose === "기타" ? otherPurpose : purpose;

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      {
        nickname,
        gender,
        purpose: finalPurpose,
        otherPurpose,
        petCount,
      },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ error: "사용자를 찾을 수 없습니다" });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "프로필 수정 실패" });
  }
});

// 분석 결과 저장 API
app.post("/analysis", auth, async (req, res) => {
  try {
    const {
      petIds,
      petNames,
      result,
      score,
      summary,
      detail,
      recommendation,
      dateTime,
    } = req.body;

    const newAnalysis = new Analysis({
      userId: req.userId,
      petIds,
      petNames,
      result,
      score,
      summary,
      detail,
      recommendation,
      dateTime,
    });

    await newAnalysis.save();
    res.json(newAnalysis);
  } catch (error) {
    res.status(500).json({ error: "분석 결과 저장 실패" });
  }
});

// 분석 결과 조회 API
app.get("/analysis", auth, async (req, res) => {
  try {
    const analysisList = await Analysis.find({ userId: req.userId }).sort({
      _id: -1,
    });

    res.json(analysisList);
  } catch (error) {
    res.status(500).json({ error: "분석 결과 조회 실패" });
  }
});


// 서버 실행
app.listen(5000, () => {
  console.log("서버 실행 중");
});