// 로그인 / 회원가입 버튼 클릭 예시
document.getElementById("loginBtn").addEventListener("click", function () {
  alert("로그인 페이지로 이동합니다.");
});

document.getElementById("signupBtn").addEventListener("click", function () {
  alert("회원가입 페이지로 이동합니다.");
});

// 통계 숫자 카운트 애니메이션
const counters = document.querySelectorAll(".stat-number");

counters.forEach((counter) => {
  const target = +counter.getAttribute("data-target");
  let current = 0;
  const increment = Math.ceil(target / 50);

  const updateCounter = () => {
    current += increment;

    if (current > target) {
      counter.textContent = target;
    } else {
      counter.textContent = current;
      requestAnimationFrame(updateCounter);
    }
  };

  updateCounter();
});