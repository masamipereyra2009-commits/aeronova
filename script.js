const pages = [...document.querySelectorAll(".page")];
const navLinks = [...document.querySelectorAll(".nav-link")];
const nav = document.getElementById("nav");
const menuToggle = document.getElementById("menuToggle");
const toast = document.getElementById("toast");
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
}
function showPage(pageId) {
  const target = document.getElementById(pageId);
  if (!target) return;
  pages.forEach(page => page.classList.toggle("active", page.id === pageId));
  navLinks.forEach(link => link.classList.toggle("active", link.dataset.page === pageId));
  nav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  window.scrollTo({top: 0, behavior: "smooth"});
}
navLinks.forEach(link => link.addEventListener("click", () => showPage(link.dataset.page)));
document.querySelectorAll("[data-go]").forEach(button => button.addEventListener("click", event => {
  event.preventDefault();
  showPage(button.dataset.go);
}));
menuToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

document.getElementById("contactForm").addEventListener("submit", event => {
  event.preventDefault();
  const name = document.getElementById("userName").value.trim();
  const question = document.getElementById("userQuestion").value.trim();
  const message = document.getElementById("formMessage");
  if (name.length < 2 || question.length < 5) {
    message.textContent = "Escribe tu nombre y una pregunta de al menos 5 caracteres.";
    message.style.color = "#b44e49";
    return;
  }
  message.textContent = `¡Gracias, ${name}! Tu pregunta quedó registrada en esta demostración.`;
  message.style.color = "#23825d";
  event.target.reset();
});

const travelers = document.getElementById("travelers");
const travelerOutput = document.getElementById("travelerOutput");
function updateTravelerLabel() {
  travelerOutput.value = `${travelers.value} ${travelers.value === "1" ? "persona" : "personas"}`;
}
travelers.addEventListener("input", updateTravelerLabel);

document.getElementById("travelForm").addEventListener("submit", event => {
  event.preventDefault();
  const origin = document.getElementById("origin").value.trim();
  const destination = document.getElementById("destination").value.trim();
  const distance = Number(document.getElementById("distance").value);
  const price = Number(document.getElementById("price").value);
  const count = Number(travelers.value);
  if (!origin || !destination || distance <= 0 || price <= 0) {
    showToast("Revisa los datos para calcular el presupuesto.");
    return;
  }
  const perPerson = distance * price;
  const total = perPerson * count;
  document.getElementById("totalCost").textContent = money(total);
  document.getElementById("personCost").textContent = money(perPerson);
  document.getElementById("routeResult").textContent = `${origin} → ${destination}`;
  document.getElementById("peopleResult").textContent = count;
  showToast("Presupuesto estimado actualizado.");
});
function money(value) {
  return new Intl.NumberFormat("en-US", {style:"currency", currency:"USD"}).format(value);
}
document.getElementById("resetCalc").addEventListener("click", () => {
  document.getElementById("travelForm").reset();
  travelers.value = 1;
  updateTravelerLabel();
  document.getElementById("totalCost").textContent = "$420.00";
  document.getElementById("personCost").textContent = "$420.00";
  document.getElementById("routeResult").textContent = "Lima → São Paulo";
  document.getElementById("peopleResult").textContent = "1";
  showToast("Valores restablecidos.");
});

const questions = [
  {q:"¿Qué profesional está al mando de la aeronave durante el vuelo?", options:["El piloto","El agente de viajes","El pasajero"], answer:0, explanation:"El piloto al mando dirige la operación de vuelo y tiene responsabilidades de seguridad."},
  {q:"¿Qué organización ayuda a coordinar el tránsito de las aeronaves en el espacio aéreo?", options:["La recepción del hotel","El control de tránsito aéreo","La agencia de turismo"], answer:1, explanation:"El control de tránsito aéreo ayuda a mantener un flujo seguro y ordenado de aeronaves."},
  {q:"¿Qué instrumento ayuda a conocer la dirección hacia la que apunta una aeronave?", options:["El termómetro","El cronómetro","La brújula o indicador de rumbo"], answer:2, explanation:"La brújula y los indicadores de rumbo ayudan a conocer la orientación de la aeronave."},
  {q:"¿Por qué es importante revisar el clima antes de volar?", options:["Para elegir el uniforme","Porque puede afectar la seguridad y la ruta","Para decorar el aeropuerto"], answer:1, explanation:"El viento, las tormentas, la visibilidad y otros factores meteorológicos influyen en la planificación."},
  {q:"¿Qué habilidad es importante para los profesionales de la aviación?", options:["Comunicación y trabajo en equipo","Ignorar los procedimientos","Tomar decisiones sin información"], answer:0, explanation:"La comunicación clara y el respeto por los procedimientos son esenciales para la seguridad."}
];
let questionIndex = 0;
let score = 0;
let selectedAnswer = null;
let answered = false;
const questionText = document.getElementById("questionText");
const answerOptions = document.getElementById("answerOptions");
const nextQuestion = document.getElementById("nextQuestion");
const answerFeedback = document.getElementById("answerFeedback");
const quizContent = document.getElementById("quizContent");
const quizResult = document.getElementById("quizResult");

function renderQuestion() {
  const item = questions[questionIndex];
  selectedAnswer = null;
  answered = false;
  document.getElementById("questionCount").textContent = `PREGUNTA ${questionIndex + 1} DE ${questions.length}`;
  document.getElementById("progressBar").style.width = `${(questionIndex + 1) / questions.length * 100}%`;
  questionText.textContent = item.q;
  answerFeedback.textContent = "";
  nextQuestion.disabled = true;
  nextQuestion.innerHTML = 'Comprobar respuesta <span>→</span>';
  answerOptions.innerHTML = "";
  item.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer-option";
    button.innerHTML = `<span class="option-letter">${String.fromCharCode(65 + index)}</span><span></span>`;
    button.querySelector("span:last-child").textContent = option;
    button.addEventListener("click", () => {
      if (answered) return;
      selectedAnswer = index;
      [...answerOptions.children].forEach((node, i) => node.classList.toggle("selected", i === index));
      nextQuestion.disabled = false;
    });
    answerOptions.appendChild(button);
  });
}
nextQuestion.addEventListener("click", () => {
  const item = questions[questionIndex];
  if (selectedAnswer === null) return;
  if (!answered) {
    answered = true;
    const buttons = [...answerOptions.children];
    buttons.forEach((button, index) => {
      button.disabled = true;
      if (index === item.answer) button.classList.add("correct");
      if (index === selectedAnswer && selectedAnswer !== item.answer) button.classList.add("wrong");
    });
    if (selectedAnswer === item.answer) {
      score++;
      answerFeedback.textContent = `¡Correcto! ${item.explanation}`;
    } else {
      answerFeedback.textContent = `No exactamente. ${item.explanation}`;
    }
    nextQuestion.innerHTML = questionIndex === questions.length - 1 ? 'Ver resultado <span>→</span>' : 'Siguiente pregunta <span>→</span>';
    return;
  }
  if (questionIndex < questions.length - 1) {
    questionIndex++;
    renderQuestion();
  } else {
    showQuizResult();
  }
});
function showQuizResult() {
  quizContent.classList.add("hidden");
  quizResult.classList.remove("hidden");
  document.getElementById("finalScore").textContent = `${score} de ${questions.length}`;
  const resultText = document.getElementById("resultText");
  if (score === 5) resultText.textContent = "¡Excelente! Tienes una gran base de conocimientos sobre aviación.";
  else if (score >= 3) resultText.textContent = "¡Buen trabajo! Ya conoces varios conceptos. Sigue explorando y aprendiendo.";
  else resultText.textContent = "¡Este es el comienzo! Repasa las respuestas y vuelve a intentarlo.";
}
document.getElementById("restartQuiz").addEventListener("click", () => {
  questionIndex = 0;
  score = 0;
  quizContent.classList.remove("hidden");
  quizResult.classList.add("hidden");
  renderQuestion();
});
renderQuestion();
updateTravelerLabel();
