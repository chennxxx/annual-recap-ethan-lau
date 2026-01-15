const dataStore = {
  "虎子哥": {
    name: "虎子哥",
    totalClasses: 28,
    attendance: 24,
    missed: 4,
    firstMeet: "2025年3月16日 星期日",
    firstStore: "江北九街店",
    firstClass: "BODYCOMBAT® 燃脂搏击",
    months: [1, 0, 2, 1, 2, 3, 1, 4, 2, 3, 5, 4],
    favoriteClass: "BODYCOMBAT® 燃脂搏击",
    courses: [
      { name: "BODYCOMBAT® 燃脂搏击", count: 12 },
      { name: "BODYPUMP® 杠铃雕塑", count: 9 },
      { name: "CORE® 核心力量", count: 4 },
      { name: "BODYBALANCE® 身心平衡", count: 3 }
    ],
    venues: [
      { name: "江北九街店", count: 10 },
      { name: "观音桥大融城店", count: 8 },
      { name: "南坪协信城店", count: 6 },
      { name: "N37月光之城店", count: 4 }
    ],
    buddies: [
      { name: "米拉", count: 12 },
      { name: "小蜜蜂乐乐", count: 9 },
      { name: "豆豆", count: 8 }
    ],
    camp: {
      joined: false,
      list: [
        "BC 动作技术营（基础入门班）",
        "BP 负重进阶营（力量提升班）",
        "90 分钟 BC 体能挑战（节假日限定）"
      ]
    },
    note: "你的节奏很稳，冲刺月是在 11 月！2026 我们继续热燃。"
  }
};

const pages = Array.from(document.querySelectorAll(".page"));
const pagerDots = document.getElementById("pagerDots");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const startBtn = document.getElementById("startBtn");
const nameInput = document.getElementById("nameInput");
const app = document.getElementById("app");
const confetti = document.getElementById("confetti");

let currentPage = 0;
let currentUser = null;
let touchStartY = 0;
let touchStartX = 0;

const confettiColors = ["#ff5c2b", "#ff7a3d", "#ffd0b6", "#f7a67e", "#fff0e6"];

const launchConfetti = () => {
  if (!confetti || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  confetti.innerHTML = "";
  const count = 70;
  for (let i = 0; i < count; i += 1) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    const size = 6 + Math.random() * 6;
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.width = `${size}px`;
    piece.style.height = `${size * 1.6}px`;
    piece.style.background = confettiColors[i % confettiColors.length];
    piece.style.animationDuration = `${2.2 + Math.random() * 1.8}s`;
    piece.style.animationDelay = `${Math.random() * 0.6}s`;
    confetti.appendChild(piece);
  }
  window.setTimeout(() => {
    confetti.innerHTML = "";
  }, 4200);
};

const showPage = (index) => {
  pages.forEach((page, i) => {
    page.classList.toggle("is-active", i === index);
  });
  currentPage = index;
  updatePager();
  if (currentPage === pages.length - 1) {
    launchConfetti();
  }
};

const updatePager = () => {
  pagerDots.innerHTML = "";
  pages.forEach((_, index) => {
    const dot = document.createElement("span");
    if (index === currentPage) dot.classList.add("is-active");
    pagerDots.appendChild(dot);
  });
  prevBtn.disabled = currentPage === 0;
  nextBtn.disabled = currentPage === pages.length - 1;
  prevBtn.style.opacity = prevBtn.disabled ? 0.4 : 1;
  nextBtn.style.opacity = nextBtn.disabled ? 0.4 : 1;
};

const renderUser = (user) => {
  document.getElementById("userName").textContent = user.name;
  document.getElementById("totalClasses").textContent = user.totalClasses;
  document.getElementById("attendanceCount").textContent = user.attendance;
  document.getElementById("missedCount").textContent = user.missed;
  document.getElementById("attendanceRate").textContent = `${Math.round(
    (user.attendance / user.totalClasses) * 100
  )}%`;

  document.getElementById("summaryNote").textContent = `今年你和 Ethan Lau 一起完成了 ${user.totalClasses} 节课，出勤率达到 ${Math.round(
    (user.attendance / user.totalClasses) * 100
  )}% 。${user.note}`;

  document.getElementById("firstMeetDate").textContent = user.firstMeet;
  document.getElementById("firstMeetStore").textContent = user.firstStore;
  document.getElementById("firstClass").textContent = user.firstClass;
  document.getElementById("totalClassesHighlight").textContent = user.totalClasses;

  const monthGrid = document.getElementById("monthGrid");
  monthGrid.innerHTML = "";
  const peakValue = Math.max(...user.months);
  user.months.forEach((count, index) => {
    const card = document.createElement("div");
    card.className = "month-card";
    if (count === peakValue && count !== 0) {
      card.classList.add("is-peak");
    }
    card.innerHTML = `<span>${index + 1}月</span><strong>${count}</strong>`;
    monthGrid.appendChild(card);
  });

  const peakMonth = user.months.findIndex((count) => count === peakValue) + 1;
  document.getElementById("monthNote").textContent = `你的最高能月是 ${peakMonth} 月，共 ${peakValue} 次课程。`;

  document.getElementById("favoriteClass").textContent = user.favoriteClass;

  const courseList = document.getElementById("courseList");
  courseList.innerHTML = "";
  user.courses.forEach((course) => {
    const item = document.createElement("div");
    item.className = "list-item";
    item.innerHTML = `<span>${course.name}</span><strong>${course.count}次</strong>`;
    courseList.appendChild(item);
  });

  const topVenue = user.venues[0];
  document.getElementById("topVenue").textContent = `最常遇见的门店：${topVenue.name}`;

  const venueList = document.getElementById("venueList");
  venueList.innerHTML = "";
  user.venues.forEach((venue) => {
    const item = document.createElement("div");
    item.className = "list-item";
    item.innerHTML = `<span>${venue.name}</span><strong>${venue.count}次</strong>`;
    venueList.appendChild(item);
  });

  const buddyGrid = document.getElementById("buddyGrid");
  buddyGrid.innerHTML = "";
  user.buddies.forEach((buddy, index) => {
    const card = document.createElement("div");
    card.className = "buddy-card";
    card.innerHTML = `
      <div class="rank">${index + 1}</div>
      <div class="buddy-name">${buddy.name}</div>
      <div class="buddy-count">共同上课 ${buddy.count} 次</div>
    `;
    buddyGrid.appendChild(card);
  });

  document.getElementById("buddyNote").textContent = `你与 ${user.buddies[0].name} 并肩训练最多次，一起打卡 ${user.buddies[0].count} 次。`;

  const campStatus = document.getElementById("campStatus");
  const campNote = document.getElementById("campNote");

  if (user.camp.joined) {
    campStatus.textContent = "谢谢你今年的每一次到场，训练营让我们更紧密地并肩。";
    campNote.textContent = `${user.name}，愿你把热爱练成习惯，2026 我们继续并肩冲刺，一起把汗水写进回忆。`;
  } else {
    campStatus.textContent = "谢谢你这一年的坚持，每一次出勤都是对自己的礼物。";
    campNote.textContent = `${user.name}，愿你把热爱练成习惯，2026 想和你在课堂里多一些相遇，我们在课上见。`;
  }
};

const handleStart = () => {
  const inputName = nameInput.value.trim();
  const user = dataStore[inputName];
  if (!user) {
    nameInput.value = "";
    nameInput.placeholder = "没找到这个昵称，再试试";
    return;
  }
  currentUser = user;
  renderUser(user);
  showPage(1);
};

startBtn.addEventListener("click", handleStart);

nameInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    handleStart();
  }
});

nextBtn.addEventListener("click", () => {
  if (currentPage < pages.length - 1) {
    showPage(currentPage + 1);
  }
});

prevBtn.addEventListener("click", () => {
  if (currentPage > 0) {
    showPage(currentPage - 1);
  }
});


app.addEventListener("touchstart", (event) => {
  if (event.target.closest("input, button")) return;
  const touch = event.touches[0];
  touchStartY = touch.clientY;
  touchStartX = touch.clientX;
});

app.addEventListener("touchend", (event) => {
  if (event.target.closest("input, button")) return;
  const touch = event.changedTouches[0];
  const deltaY = touchStartY - touch.clientY;
  const deltaX = touchStartX - touch.clientX;
  if (Math.abs(deltaY) < 50 || Math.abs(deltaY) < Math.abs(deltaX)) return;
  if (deltaY > 0 && currentPage < pages.length - 1) {
    showPage(currentPage + 1);
  } else if (deltaY < 0 && currentPage > 0) {
    showPage(currentPage - 1);
  }
});

showPage(0);
