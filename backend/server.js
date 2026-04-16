require("dotenv").config({ path: __dirname + "/.env" });

const Pet = require("./models/pet");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const User = require("./models/User");
const app = express();
const jwt = require("jsonwebtoken");
const auth = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "인증 필요" });
  }

  try {
    const decoded = jwt.verify(token, "secretKey");
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ error: "토큰 오류" });
  }
};


app.use(cors());
app.use(express.json());

console.log(process.env.MONGO_URI);

// DB 연결
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DB 연결 성공"))
  .catch(err => console.log(err));

// 테스트
app.get("/", (req, res) => {
  res.send("서버 정상 작동!");
});

app.listen(5000, () => {
  console.log("서버 실행 중");
});

// 반려동물 등록 API
app.post("/pets", auth, async (req, res) => {
  try {
    const pet = new Pet({
      ...req.body,
      userId: req.userId,
    });
    await pet.save();
    res.json(pet);
  } catch (error) {
    res.status(500).json({ error: "저장 실패" });
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

// 반려동물 삭제 API
app.delete("/pets/:id", async (req, res) => {
  try {
    await Pet.findByIdAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });
    res.json({ message: "삭제 완료" });
  } catch (error) {
    res.status(500).json({ error: "삭제 실패" });
  }
});

// 반려동물 수정 API
app.put("/pets/:id", auth, async (req, res) => {
  try {
    const updatedPet = await Pet.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.userId, 
      },
      req.body,
      { returnDocument: "after" }
    );

    if (!updatedPet) {
      return res.status(404).json({ error: "해당 데이터 없음 또는 권한 없음" });
    }

    res.json(updatedPet);
  } catch (error) {
    res.status(500).json({ error: "수정 실패" });
  }
});

// 회원가입 API
app.post("/register", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = new User({
      email: req.body.email,
      password: hashedPassword,
    });

    await user.save();
    res.json({ message: "회원가입 성공" });
  } catch (error) {
    res.status(500).json({ error: "회원가입 실패" });
  }
});

//로그인 API
app.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(400).json({ error: "사용자 없음" });
  }

  const isMatch = await bcrypt.compare(req.body.password, user.password);

  if (!isMatch) {
    return res.status(400).json({ error: "비밀번호 틀림" });
  }

  const token = jwt.sign(
    { userId: user._id },
    "secretKey",
    { expiresIn: "1h" }
  );

  res.json({ token });
});