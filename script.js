// ==============================
// IBUDDY — SETUP
// ==============================

let selectedGrade = "";

function selectGrade(grade, button) {
  selectedGrade = grade;

  document.querySelectorAll(".grade-card").forEach(card => {
    card.classList.remove("selected");
  });

  button.classList.add("selected");

  const continueButton = document.getElementById("continueButton");

  if (continueButton) {
    continueButton.disabled = false;
  }
}

function finishSetup() {
  const subjects = [];

  document
    .querySelectorAll(".subject-options input[type='checkbox']:checked")
    .forEach(checkbox => {
      subjects.push(checkbox.value);
    });

  if (!selectedGrade) {
    alert("Please choose your IB year first.");
    return;
  }

  localStorage.setItem("ibuddyGrade", selectedGrade);
  localStorage.setItem("ibuddySubjects", JSON.stringify(subjects));
  localStorage.setItem("ibuddyJourneyStep", "1");

  window.location.href = "journey.html";
}


// ==============================
// IBUDDY — JOURNEY
// ==============================

function loadJourney() {
  const grade = localStorage.getItem("ibuddyGrade");
  const savedStep = parseInt(
    localStorage.getItem("ibuddyJourneyStep") || "1"
  );

  const title = document.getElementById("journeyTitle");

  if (title && grade) {
    title.textContent = `${grade} — My IB Journey`;
  }

  showJourneyStep(savedStep);
}

function showJourneyStep(step) {
  const steps = document.querySelectorAll(".journey-step");

  steps.forEach((journeyStep, index) => {
    journeyStep.classList.toggle("hidden", index + 1 !== step);
  });

  const progressText = document.getElementById("progressText");
  const progressPercent = document.getElementById("progressPercent");
  const progressFill = document.getElementById("progressFill");

  const percent = step * 20;

  if (progressText) {
    progressText.textContent = `Step ${step} of 5`;
  }

  if (progressPercent) {
    progressPercent.textContent = `${percent}%`;
  }

  if (progressFill) {
    progressFill.style.width = `${percent}%`;
  }
}

function completeStep(step) {
  const nextStep = step + 1;

  localStorage.setItem("ibuddyJourneyStep", nextStep);

  showJourneyStep(nextStep);

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

function finishJourney() {
  localStorage.setItem("ibuddyJourneyStep", "5");

  document.querySelectorAll(".journey-step").forEach(step => {
    step.classList.add("hidden");
  });

  const completion = document.getElementById("journeyComplete");

  if (completion) {
    completion.classList.remove("hidden");
  }

  const progressText = document.getElementById("progressText");
  const progressPercent = document.getElementById("progressPercent");
  const progressFill = document.getElementById("progressFill");

  if (progressText) {
    progressText.textContent = "Journey complete!";
  }

  if (progressPercent) {
    progressPercent.textContent = "100%";
  }

  if (progressFill) {
    progressFill.style.width = "100%";
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


// ==============================
// IBUDDY — SUBJECTS
// ==============================

function loadSubjects() {
  const subjectList = document.getElementById("subjectList");
  const noSubjects = document.getElementById("noSubjects");

  if (!subjectList) return;

  const savedSubjects = JSON.parse(
    localStorage.getItem("ibuddySubjects") || "[]"
  );

  if (savedSubjects.length === 0) {
    subjectList.classList.add("hidden");

    if (noSubjects) {
      noSubjects.classList.remove("hidden");
    }

    return;
  }

  subjectList.innerHTML = "";

  const icons = {
    "Mathematics": "📐",
    "English": "📖",
    "Science": "🔬",
    "Individuals & Societies": "🌍",
    "Languages": "🗣️",
    "Business": "💼",
    "Global Politics": "🏛️",
    "Other": "📚"
  };

  savedSubjects.forEach(subject => {
    const card = document.createElement("div");

    card.className = "subject-card";

    card.innerHTML = `
      <div class="subject-icon">
        ${icons[subject] || "📚"}
      </div>

      <h2>${subject}</h2>

      <p>
        Your IBuddy resources for ${subject} will appear here.
      </p>
    `;

    subjectList.appendChild(card);
  });

  if (noSubjects) {
    noSubjects.classList.add("hidden");
  }
}


// ==============================
// IBUDDY — TO-DO LIST
// ==============================

let tasks = JSON.parse(
  localStorage.getItem("ibuddyTasks") || "[]"
);

function saveTasks() {
  localStorage.setItem(
    "ibuddyTasks",
    JSON.stringify(tasks)
  );
}

function renderTasks() {
  const taskList = document.getElementById("taskList");

  if (!taskList) return;

  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");

    li.innerHTML = `
      <span>${task}</span>

      <button onclick="deleteTask(${index})">
        ✕
      </button>
    `;

    taskList.appendChild(li);
  });
}

function addTask() {
  const input = document.getElementById("taskInput");

  if (!input) return;

  const task = input.value.trim();

  if (task === "") {
    return;
  }

  tasks.push(task);

  saveTasks();
  renderTasks();

  input.value = "";
}

function deleteTask(index) {
  tasks.splice(index, 1);

  saveTasks();
  renderTasks();
}


// ==============================
// IBUDDY — STUDY TIMER
// ==============================

let timeLeft = 25 * 60;
let timerInterval = null;

function updateTimer() {
  const display = document.getElementById("timerDisplay");

  if (!display) return;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  display.textContent =
    `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function startTimer() {
  if (timerInterval !== null) return;

  timerInterval = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      updateTimer();
    } else {
      clearInterval(timerInterval);
      timerInterval = null;

      alert("Great job! Your study session is finished. 🌱");
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function resetTimer() {
  pauseTimer();

  timeLeft = 25 * 60;

  updateTimer();
}


// ==============================
// IBUDDY — I'M STUCK
// ==============================

function showStuck(type) {
  const adviceBox = document.getElementById("stuckAdvice");

  if (!adviceBox) return;

  const advice = {

    start: {
      title: "Let's figure out your first step 🌱",
      text: "You don't need to solve everything at once.",
      steps: [
        "Write down everything you need to do.",
        "Choose the most urgent or important task.",
        "Break that task into one tiny first step.",
        "Start with that step for just a few minutes."
      ]
    },

    overwhelmed: {
      title: "Let's make things feel smaller 🌿",
      text: "When everything feels important, it's hard to know where to begin.",
      steps: [
        "Take a short break and breathe.",
        "Write down your deadlines.",
        "Choose what needs attention first.",
        "Work on one task at a time."
      ]
    },

    understand: {
      title: "Let's work out what you don't understand 💡",
      text: "Not understanding something doesn't mean you can't learn it.",
      steps: [
        "Identify the exact part that confuses you.",
        "Look at an example of the concept.",
        "Try explaining it in your own words.",
        "Ask a teacher or someone you trust if you're still stuck."
      ]
    }

  };

  const selectedAdvice = advice[type];

  if (!selectedAdvice) return;

  adviceBox.innerHTML = `
    <h2>${selectedAdvice.title}</h2>

    <p>${selectedAdvice.text}</p>

    <ol>
      ${selectedAdvice.steps
        .map(step => `<li>${step}</li>`)
        .join("")}
    </ol>
  `;

  adviceBox.classList.remove("hidden");

  adviceBox.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
}


// ==============================
// IBUDDY — PAGE INITIALIZATION
// ==============================

document.addEventListener("DOMContentLoaded", () => {

  loadJourney();
  loadSubjects();
  renderTasks();
  updateTimer();

});
