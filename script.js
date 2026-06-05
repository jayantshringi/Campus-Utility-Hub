// --- COLLEGE UTILITY SYSTEM DATA ---
const modulesList = [
  { id: "home", name: "Home Dashboard", icon: "🏠", desc: "Overview of campus stats." },
  { id: "attendance", name: "Smart Attendance", icon: "📋", desc: "Track attendance and warn if below 75%." },
  { id: "cgpa", name: "CGPA Calculator", icon: "🎓", desc: "Estimate SGPA based on credits and grades." },
  { id: "converter", name: "Number Converter", icon: "🔢", desc: "Manual Binary, Decimal, Octal, and Hex conversions." },
  { id: "password", name: "Password Analyzer", icon: "🔑", desc: "Evaluate password strength checklist and meter." },
  { id: "quiz", name: "Dynamic Quiz", icon: "❓", desc: "Campus trivia questions loaded dynamically." },
  { id: "splitter", name: "Expense Splitter", icon: "💸", desc: "Settle shared dorm costs and ledger debts." },
  { id: "theme", name: "Theme Generator", icon: "🎨", desc: "Real-time updates of custom CSS variables." },
  { id: "typing", name: "Typing Speed Test", icon: "⌨️", desc: "Measure keyboard words-per-minute and accuracy." }
];

const quizQuestions = [
  { question: "Which cafeteria near the library is famous for serving coffee at 2 AM?", options: ["Nescafé Booth", "Main Canteen", "Night Bytes", "Food Truck"], answer: 2 },
  { question: "What is the minimum required attendance percentage to sit for final semester exams?", options: ["60%", "75%", "85%", "100%"], answer: 1 },
  { question: "Who is the primary instructor for the CS-201 Web Technologies Lab?", options: ["Dr. Aris", "Prof. Sen", "Dr. Davis", "Prof. Verma"], answer: 1 },
  { question: "Which floor of the IT block houses the main Computer Science lab facilities?", options: ["Ground Floor", "1st Floor", "3rd Floor", "Penthouse"], answer: 2 },
  { question: "What is the total credit count of our current semester's core Web Tech course?", options: ["2 Credits", "3 Credits", "4 Credits", "5 Credits"], answer: 2 }
];

const typingParagraphs = [
  "Algorithms are the heart of computer science, transforming raw computational power into smart automation.",
  "Coffee is the silent fuel of late night engineering sprints. It keeps compile errors away.",
  "Cascading Style Sheets define the presentation of web pages. Writing CSS is easy at first.",
  "JavaScript runs the modern web ecosystem. A single script can manage states and render tables.",
  "Persistent practice makes programming second nature. Debugging your code is like detective work."
];

let studentsList = [
  { id: 1, name: "Aarav Sharma", present: 14, absent: 2, late: 1 },
  { id: 2, name: "Priya Patel", present: 16, absent: 1, late: 0 },
  { id: 3, name: "Kabir Singh", present: 9, absent: 7, late: 2 },
  { id: 4, name: "Riya Verma", present: 15, absent: 0, late: 2 }
];
let cgpaSubjects = [
  { id: 1, name: "CS-201 Web Programming", credits: 4, grade: "A+" },
  { id: 2, name: "CS-202 Database Lab", credits: 3, grade: "O" },
  { id: 3, name: "CS-203 Discrete Math", credits: 3, grade: "B" }
];
let expenseParticipants = ["Aarav", "Priya", "Kabir", "Riya"];
let expensesList = [
  { id: 1, desc: "Hostel Pizza Night", amount: 54.0, paidBy: "Aarav" },
  { id: 2, desc: "Xerox Printouts CS-201 Lab", amount: 8.5, paidBy: "Priya" }
];

let currentParagraphIndex = -1, selectedQuizAnswers = [];
let quizState = { currentQuestionIndex: 0, score: 0, isFinished: false };
let typingState = { text: "", timerStarted: false, timerInterval: null, timeLeft: 60, mistakes: 0, charIndex: 0, correctChars: 0, totalTyped: 0 };

// Dynamic element generator helper
function el(tag, cls, parent, text, click) {
  let e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e[text.toString().startsWith("<") ? "innerHTML" : "textContent"] = text;
  if (click) e.addEventListener("click", click);
  return parent ? parent.appendChild(e) : e;
}

// Initialise app components
function initApp() {
  renderNavigation(); initThemeGen(); renderAttendance(); renderCGPA();
  initPassAnalyzer(); initQuiz(); renderExpenses(); loadTypingText();
}

function renderNavigation() {
  const nav = document.getElementById("sidebarNavList"), grid = document.getElementById("homeGridContainer"), sb = document.getElementById("sidebar");
  nav.innerHTML = grid.innerHTML = "";
  modulesList.forEach(m => {
    let btn = el("button", `nav-btn${m.id === "home" ? " active" : ""}`, el("li", null, nav), `<span class="nav-icon">${m.icon}</span><span>${m.name}</span>`, () => { switchTab(m.id); sb.classList.remove("open"); });
    btn.dataset.tab = m.id;
    if (m.id === "home") el("li", "nav-divider", nav, "Modules");
    else el("div", "feature-card", grid, `<div class="card-icon icon-${m.id}">${m.icon}</div><h3>${m.name}</h3><p>${m.desc}</p><div class="card-link">Launch &rarr;</div>`, () => switchTab(m.id));
  });
  document.getElementById("mobileMenuBtn").addEventListener("click", () => sb.classList.add("open"));
  document.getElementById("mobileCloseBtn").addEventListener("click", () => sb.classList.remove("open"));
}

function switchTab(id) {
  document.querySelectorAll(".tab-panel, .nav-btn").forEach(e => e.classList.remove("active"));
  document.getElementById("panel-" + id)?.classList.add("active");
  document.querySelector(`.nav-btn[data-tab="${id}"]`)?.classList.add("active");
}



// Live CSS Theme Generator variables mapping
function initThemeGen() {
  const inputs = ["themeBgColor", "themeFontSize", "themeRadius", "themeSpacing"];
  const vars = ["--theme-bg", "--theme-font-size", "--theme-radius", "--theme-spacing"], units = ["", "px", "px", "px"];
  const update = (id, i, val) => {
    document.documentElement.style.setProperty(vars[i], val + units[i]);
    document.getElementById(id + "Text").textContent = val + units[i];
    document.getElementById(id).value = val;
  };
  inputs.forEach((id, i) => document.getElementById(id).addEventListener("input", (e) => update(id, i, e.target.value)));
  document.getElementById("btnResetCustomTheme").addEventListener("click", () => ["#3b82f6", "16", "8", "16"].forEach((v, i) => update(inputs[i], i, v)));
}

// Manual algorithms (base conversion requirements)
const decToBase = (n, b, rems = [], c = "0123456789ABCDEF") => { while (n > 0) { rems.push(c[n % b]); n = Math.floor(n / b); } return rems.reverse().join("") || "0"; };
const binToDec = bin => [...bin].reverse().reduce((dec, char, p) => char === '1' ? dec + Math.pow(2, p) : (char === '0' ? dec : NaN), 0);

function runConvert() {
  let val = document.getElementById("convertInputVal").value.trim(), from = parseInt(document.getElementById("fromBaseSelect").value), to = parseInt(document.getElementById("toBaseSelect").value);
  let out = document.getElementById("conversionResultOutput"), err = document.getElementById("convertValidationMsg");
  err.textContent = ""; if (!val) return out.textContent = "0";
  let dec = from === 2 ? binToDec(val) : parseInt(val, 10);
  if (isNaN(dec) || dec < 0 || (from === 10 && !/^\d+$/.test(val))) return err.textContent = "Invalid Input!", out.textContent = "Error";
  out.textContent = to === 10 ? dec : decToBase(dec, to);
}
document.getElementById("btnRunConversion").addEventListener("click", runConvert);

// Password Strength Meter
function initPassAnalyzer() {
  const pass = document.getElementById("passwordInput"), bar = document.getElementById("strengthMeterBar"), lbl = document.getElementById("strengthLabel"), scText = document.getElementById("entropyScore");
  document.getElementById("btnTogglePasswordVisibility").addEventListener("click", () => {
    let isPass = pass.type === "password"; pass.type = isPass ? "text" : "password";
    document.getElementById("eyeText").textContent = isPass ? "Hide" : "Show";
  });
  pass.addEventListener("input", () => {
    let val = pass.value, score = 0;
    let rules = [val.length >= 8, /[A-Z]/.test(val), /[a-z]/.test(val), /[0-9]/.test(val), /[@$!%*?&]/.test(val)];
    ["rule-length", "rule-upper", "rule-lower", "rule-number", "rule-special"].forEach((id, i) => {
      let item = document.getElementById(id), p = rules[i]; item.className = p ? "checked" : "";
      item.querySelector(".rule-icon").textContent = p ? "✅" : "❌";
      if (p && val.length > 0) score++;
    });
    scText.textContent = `Score: ${score}/5`;
    let clr = val.length ? (score >= 5 ? "var(--success)" : (score >= 3 ? "var(--warning)" : "var(--danger)")) : "var(--text-muted)";
    let text = val.length ? (score >= 5 ? "Strong" : (score >= 3 ? "Medium" : "Weak")) : "Empty";
    bar.style.width = val.length > 0 ? `${(score / 5) * 100}%` : "0%"; bar.style.backgroundColor = clr;
    lbl.textContent = text; lbl.style.color = clr;
  });
}

// Smart Attendance Tracker
function renderAttendance() {
  const cont = document.getElementById("attendanceTableContainer"); cont.innerHTML = "";
  if (!studentsList.length) return el("div", "no-data-msg", cont, "Roster is empty.");
  const table = el("table", null, cont), tbody = el("tbody", null, table);
  ["Student Name", "Present", "Absent", "Late", "Total", "Attendance %", "Warning", "Remove"].forEach(h => el("th", null, el("tr", null, el("thead", null, table)), h));
  studentsList.forEach(s => {
    let tr = el("tr", null, tbody); el("td", null, tr, s.name).style.fontWeight = "600";
    [["present", "btn-success"], ["absent", "btn-danger"], ["late", "btn-warning"]].forEach(([f, cl]) => {
      let td = el("td", "attendance-actions", tr);
      el("button", "btn btn-secondary btn-sm btn-icon", td, "-", () => updateAttendance(s.id, f, -1));
      el("span", "count-disp", td, s[f]);
      el("button", `btn ${cl} btn-sm btn-icon`, td, "+", () => updateAttendance(s.id, f, 1));
    });
    const tot = s.present + s.absent + s.late; el("td", null, tr, tot);
    let pct = tot > 0 ? ((s.present + s.late * 0.5) / tot) * 100 : 0;
    el("td", pct < 75 ? "text-danger" : "text-success", tr, `${pct.toFixed(1)}%`).style.fontWeight = "700";
    let tdWarn = el("td", null, tr);
    if (pct < 75 && tot > 0) el("span", "badge badge-danger", tdWarn, '⚠️ Low (<75%)');
    else if (tot === 0) el("span", "badge badge-info", tdWarn, "No lectures");
    else el("span", "badge badge-success", tdWarn, "Safe");
    el("button", "btn btn-danger btn-sm btn-icon", el("td", null, tr), "✕", () => removeStudent(s.id));
  });
}
const updateAttendance = (id, f, val) => { let s = studentsList.find(x => x.id === id); if (s) { s[f] = Math.max(0, s[f] + val); renderAttendance(); } };
const removeStudent = id => { studentsList = studentsList.filter(s => s.id !== id); renderAttendance(); };

document.getElementById("attendanceForm").addEventListener("submit", (e) => {
  e.preventDefault(); let inp = document.getElementById("studentNameInput"), n = inp.value.trim();
  if (n) { studentsList.push({ id: Date.now(), name: n, present: 0, absent: 0, late: 0 }); inp.value = ""; renderAttendance(); }
});

// CGPA Calculator
const gradePointsMap = { "O": 10, "A+": 9, "A": 8, "B+": 7, "B": 6, "C": 5, "P": 4, "F": 0 };
function renderCGPA() {
  const cont = document.getElementById("cgpaTableContainer"); cont.innerHTML = "";
  if (!cgpaSubjects.length) return el("div", "no-data-msg", cont, "No courses tallied."), document.getElementById("sgpaDisplayVal").textContent = "0.00";
  const table = el("table", null, cont), tbody = el("tbody", null, table);
  ["Subject Title", "Credits", "Grade", "Grade Points", "Actions"].forEach(h => el("th", null, el("tr", null, el("thead", null, table)), h));
  let totCr = 0, totPts = 0;
  cgpaSubjects.forEach(s => {
    let tr = el("tr", null, tbody), pts = gradePointsMap[s.grade];
    el("td", null, tr, s.name).style.fontWeight = "600"; el("td", null, tr, s.credits);
    el("span", `badge badge-${pts >= 9 ? 'success' : (pts === 0 ? 'danger' : 'info')}`, el("td", null, tr), s.grade);
    el("td", null, tr, pts); el("button", "btn btn-danger btn-sm btn-icon", el("td", null, tr), "✕", () => removeSubject(s.id));
    totCr += s.credits; totPts += (s.credits * pts);
  });
  document.getElementById("sgpaDisplayVal").textContent = totCr > 0 ? (totPts / totCr).toFixed(2) : "0.00";
}
const removeSubject = id => { cgpaSubjects = cgpaSubjects.filter(s => s.id !== id); renderCGPA(); };

document.getElementById("cgpaForm").addEventListener("submit", (e) => {
  e.preventDefault(); let t = document.getElementById("subjectNameInput"), cr = document.getElementById("creditsInput"), g = document.getElementById("gradeInput");
  if (t.value.trim()) { cgpaSubjects.push({ id: Date.now(), name: t.value.trim(), credits: parseInt(cr.value), grade: g.value }); t.value = ""; cr.value = "3"; renderCGPA(); }
});

// Trivia Quiz System
function initQuiz() { selectedQuizAnswers = Array(quizQuestions.length).fill(null); quizState = { currentQuestionIndex: 0, score: 0, isFinished: false }; renderQuiz(); }
function renderQuiz() {
  const cont = document.getElementById("quizCardWrapper"); cont.innerHTML = "";
  if (quizState.isFinished) return renderQuizEnd(cont);
  const q = quizQuestions[quizState.currentQuestionIndex];
  el("div", "quiz-progress-fill", el("div", "quiz-progress-bar", cont)).style.width = `${((quizState.currentQuestionIndex + 1) / quizQuestions.length) * 100}%`;
  el("div", "quiz-q-num", cont, `Question ${quizState.currentQuestionIndex + 1} of ${quizQuestions.length}`);
  el("div", "quiz-question-text", cont, q.question);
  const ul = el("ul", "quiz-options-list", cont);
  q.options.forEach((opt, i) => {
    let sel = selectedQuizAnswers[quizState.currentQuestionIndex] === i;
    el("button", `quiz-opt-btn${sel ? " selected" : ""}`, el("li", null, ul), `<span class="badge badge-${sel ? 'danger' : 'info'}">${String.fromCharCode(65 + i)}</span><span>${opt}</span>`, () => { selectedQuizAnswers[quizState.currentQuestionIndex] = i; renderQuiz(); });
  });
  const nav = el("div", "quiz-nav-row", cont);
  let prev = el("button", "btn btn-secondary", nav, "← Previous", () => { quizState.currentQuestionIndex--; renderQuiz(); });
  prev.disabled = quizState.currentQuestionIndex === 0;
  let last = quizState.currentQuestionIndex === quizQuestions.length - 1;
  let next = el("button", "btn btn-danger", nav, last ? 'Submit' : 'Next →', () => {
    if (last) { quizState.score = quizQuestions.reduce((acc, q, i) => acc + (selectedQuizAnswers[i] === q.answer ? 1 : 0), 0); quizState.isFinished = true; }
    else quizState.currentQuestionIndex++;
    renderQuiz();
  });
  next.disabled = selectedQuizAnswers[quizState.currentQuestionIndex] === null;
}
function renderQuizEnd(cont) {
  el("div", "quiz-result-header", cont, `<h3>Test Completed!</h3><div class="score-circle">${quizState.score}/${quizQuestions.length}</div><p>Percentage: <strong>${((quizState.score / quizQuestions.length) * 100).toFixed(0)}%</strong></p>`);
  const bd = el("div", "quiz-breakdown", cont);
  quizQuestions.forEach((q, i) => {
    let ans = selectedQuizAnswers[i], corr = ans === q.answer;
    let item = el("div", "breakdown-item", bd); item.style.borderLeft = `4px solid var(--${corr ? 'success' : 'danger'})`;
    el("strong", null, item, `Q${i + 1}: ${q.question}`);
    el("span", "text-sm", item, `Your answer: <span class="${corr ? 'text-success' : 'text-danger'}">${q.options[ans] || 'Skipped'}</span>${!corr ? ` | Correct: <span class="text-success">${q.options[q.answer]}</span>` : ''}`);
  });
  el("button", "btn btn-danger w-full", cont, 'Restart Quiz', initQuiz);
}

// Expense Splitter
function renderExpenses() {
  const pCont = document.getElementById("peopleListContainer"), lCont = document.getElementById("expenseLogList"), select = document.getElementById("expensePayerSelect"), sCont = document.getElementById("splitterSettlementContainer");
  pCont.innerHTML = ""; select.innerHTML = '<option value="" disabled selected>Who Paid?</option>';
  expenseParticipants.forEach(p => {
    el("button", null, el("li", "person-item", pCont, `<span>${p}</span>`), '✕', () => { expenseParticipants = expenseParticipants.filter(x => x !== p); expensesList = expensesList.filter(e => e.paidBy !== p); renderExpenses(); });
    el("option", null, select, p).value = p;
  });
  lCont.innerHTML = ""; let total = 0;
  expensesList.forEach(e => {
    let li = el("li", "expense-item", lCont);
    el("span", "expense-item-meta", el("div", "expense-item-info", li, `<span class="expense-item-desc">${e.desc}</span>`), `Paid by: <strong>${e.paidBy}</strong>`);
    el("button", null, el("div", "expense-item-amt", li, `<span>₹${e.amount.toFixed(2)}</span>`), '✕', () => { expensesList = expensesList.filter(x => x.id !== e.id); renderExpenses(); });
    total += e.amount;
  });
  document.getElementById("splitterTotalExpenseVal").textContent = `₹${total.toFixed(2)}`;
  let share = expenseParticipants.length ? total / expenseParticipants.length : 0;
  document.getElementById("splitterPerShareVal").textContent = `₹${share.toFixed(2)}`;
  sCont.innerHTML = ""; if (expenseParticipants.length <= 1 || !expensesList.length) return sCont.innerHTML = '<div class="no-data-msg">Add splits.</div>';

  let bal = {}; expenseParticipants.forEach(p => bal[p] = 0);
  expensesList.forEach(e => { bal[e.paidBy] += e.amount; expenseParticipants.forEach(p => bal[p] -= e.amount / expenseParticipants.length); });

  let debt = [], cred = [];
  expenseParticipants.forEach(p => bal[p] < -0.01 ? debt.push({ name: p, balance: bal[p] }) : (bal[p] > 0.01 ? cred.push({ name: p, balance: bal[p] }) : null));

  let txs = [], i = 0, j = 0;
  while (i < debt.length && j < cred.length) {
    let d = debt[i], c = cred[j], amt = Math.min(-d.balance, c.balance);
    txs.push({ from: d.name, to: c.name, amount: amt }); d.balance += amt; c.balance -= amt;
    if (Math.abs(d.balance) < 0.01) i++;
    if (Math.abs(c.balance) < 0.01) j++;
  }
  if (!txs.length) return sCont.innerHTML = '<div class="no-data-msg text-success">Settled!</div>';
  txs.forEach(t => el("div", "settle-item", sCont, `<span><strong>${t.from}</strong> &rarr; <strong>${t.to}</strong>: <strong class="text-danger">₹${t.amount.toFixed(2)}</strong></span>`));
}

document.getElementById("splitterAddPersonForm").addEventListener("submit", (e) => {
  e.preventDefault(); let inp = document.getElementById("personNameInput"), n = inp.value.trim();
  if (n && !expenseParticipants.includes(n)) { expenseParticipants.push(n); inp.value = ""; renderExpenses(); }
});
document.getElementById("splitterAddExpenseForm").addEventListener("submit", (e) => {
  e.preventDefault(); let d = document.getElementById("expenseDescInput"), a = document.getElementById("expenseAmountInput"), p = document.getElementById("expensePayerSelect");
  if (d.value.trim() && !isNaN(parseFloat(a.value)) && p.value) {
    expensesList.push({ id: Date.now(), desc: d.value.trim(), amount: parseFloat(a.value), paidBy: p.value });
    d.value = ""; a.value = ""; p.selectedIndex = 0; renderExpenses();
  }
});

// Typing Speed Tester
function loadTypingText() {
  let next; do { next = Math.floor(Math.random() * typingParagraphs.length); } while (next === currentParagraphIndex);
  currentParagraphIndex = next; typingState.text = typingParagraphs[next]; resetTyping();
  const disp = document.getElementById("typingTextDisplay"); disp.innerHTML = "";
  for (let i = 0; i < typingState.text.length; i++) {
    let span = el("span", "typing-char", disp, typingState.text[i]);
    if (i === 0) span.classList.add("active");
  }
}
function resetTyping() {
  clearInterval(typingState.timerInterval);
  Object.assign(typingState, { timerStarted: false, timeLeft: 60, charIndex: 0, mistakes: 0, correctChars: 0, totalTyped: 0 });
  document.getElementById("typingInputField").value = ""; document.getElementById("metricWpmVal").textContent = "0";
  document.getElementById("metricAccuracyVal").textContent = "100%"; document.getElementById("metricTimeVal").textContent = "60s";
  document.getElementById("metricMistakesVal").textContent = "0";
}
function startTypingTimer() {
  typingState.timerInterval = setInterval(() => {
    if (typingState.timeLeft > 0) {
      typingState.timeLeft--; document.getElementById("metricTimeVal").textContent = `${typingState.timeLeft}s`; calcTyping();
    } else {
      clearInterval(typingState.timerInterval); document.getElementById("typingInputField").disabled = true;
    }
  }, 1000);
}
function handleTyping(e) {
  const chars = document.querySelectorAll(".typing-char"), val = e.target.value;
  if (!typingState.timerStarted && val.length > 0) { typingState.timerStarted = true; startTypingTimer(); }
  chars.forEach(span => span.classList.remove("active"));
  let m = 0, c = 0;
  for (let i = 0; i < chars.length; i++) {
    let u = val[i];
    if (u == null) chars[i].className = "typing-char";
    else if (chars[i].textContent === u) { chars[i].className = "typing-char correct"; c++; }
    else { chars[i].className = "typing-char incorrect"; m++; }
  }
  if (val.length < chars.length) chars[val.length].classList.add("active");
  Object.assign(typingState, { charIndex: val.length, mistakes: m, correctChars: c, totalTyped: val.length });
  calcTyping(); if (val.length >= chars.length) clearInterval(typingState.timerInterval);
}
function calcTyping() {
  const min = (60 - typingState.timeLeft) > 0 ? (60 - typingState.timeLeft) / 60 : 0.01;
  document.getElementById("metricWpmVal").textContent = typingState.totalTyped > 0 ? Math.round((typingState.totalTyped / 5) / min) : 0;
  document.getElementById("metricAccuracyVal").textContent = typingState.totalTyped > 0 ? `${Math.round((typingState.correctChars / typingState.totalTyped) * 100)}%` : "100%";
  document.getElementById("metricMistakesVal").textContent = typingState.mistakes;
}
document.getElementById("typingInputField").addEventListener("input", handleTyping);
document.getElementById("btnTypingRestart").addEventListener("click", () => {
  document.getElementById("typingInputField").disabled = false; loadTypingText();
});

// Setup App Boot
window.addEventListener("DOMContentLoaded", initApp);
