// =====================
// Banco de preguntas (15 preguntas)
// =====================
const questionsBank = [
    {
        question: "¿Qué significa HTML?",
        answers: [
            "HyperText Markup Language",
            "HighText Machine Language",
            "HyperTabular Markup Language",
            "Ninguna de las anteriores"
        ],
        correct: 0
    },
    {
        question: "¿Cuál es el resultado de 2 + '2' en JavaScript?",
        answers: [
            "4",
            "22",
            "Error",
            "NaN"
        ],
        correct: 1
    },
    {
        question: "¿Qué estructura de control permite repetir un bloque de código?",
        answers: [
            "if",
            "for",
            "switch",
            "break"
        ],
        correct: 1
    },
    {
        question: "¿Cuál de estos NO es un lenguaje de programación?",
        answers: [
            "Python",
            "HTML",
            "Java",
            "C++"
        ],
        correct: 1
    },
    {
        question: "¿Cuál es la propiedad CSS para poner el texto en negrita?",
        answers: [
            "font-weight",
            "font-style",
            "bold",
            "text-bold"
        ],
        correct: 0
    },
    {
        question: "¿Qué método convierte un string a entero en JavaScript?",
        answers: [
            "parseInt()",
            "toString()",
            "parseFloat()",
            "int()"
        ],
        correct: 0
    },
    {
        question: "¿Qué método de JavaScript muestra un mensaje emergente?",
        answers: [
            "alert()",
            "show()",
            "display()",
            "popup()"
        ],
        correct: 0
    },
    {
        question: "¿Qué etiqueta HTML se usa para enlazar JavaScript?",
        answers: [
            "<js>",
            "<javascript>",
            "<script>",
            "<link>"
        ],
        correct: 2
    },
    {
        question: "¿Qué operador se usa para comparar igualdad estricta?",
        answers: [
            "==",
            "===",
            "=",
            "!=="
        ],
        correct: 1
    },
    {
        question: "¿Qué función muestra un mensaje en la consola?",
        answers: [
            "console.log()",
            "alert()",
            "prompt()",
            "print()"
        ],
        correct: 0
    },
    {
        question: "¿Cómo se llama la función para obtener un elemento por su ID en JavaScript?",
        answers: [
            "getElementByClass",
            "getElementById",
            "getId",
            "getById"
        ],
        correct: 0
    },
    {
        question: "¿Qué palabra clave declara una variable en JavaScript?",
        answers: [
            "var",
            "let",
            "const",
            "Todas las anteriores"
        ],
        correct: 3
    },
    {
        question: "¿Qué significa CSS?",
        answers: [
            "Cascading Style Sheets",
            "Computer Style Sheets",
            "Creative Style System",
            "Colorful Style Sheets"
        ],
        correct: 0
    },
    {
        question: "¿Cuál es el resultado de typeof NaN?",
        answers: [
            "'number'",
            "'NaN'",
            "'undefined'",
            "'object'"
        ],
        correct: 0
    },
    {
        question: "¿Qué método agrega un elemento al final de un array?",
        answers: [
            "push()",
            "pop()",
            "shift()",
            "unshift()"
        ],
        correct: 0
    }
];

// =====================
// Variables globales
// =====================
let userName = "";
let testQuestions = [];
let currentQuestion = 0;
let userAnswers = [];
let score = 0;
let timerInterval = null;
let timeLeft = 300; // Conversión de 5 minutos en segundos

// =====================
// Elementos
// =====================
const mainMenu = document.getElementById('main-menu');
const userForm = document.getElementById('user-form');
const usernameInput = document.getElementById('username');
const startBtn = document.getElementById('start-btn');
const rankingTable = document.getElementById('ranking-table').querySelector('tbody');

const testSection = document.getElementById('test-section');
const timerDisplay = document.getElementById('timer');
const questionDiv = document.getElementById('question');
const answersDiv = document.getElementById('answers');
const nextBtn = document.getElementById('next-btn');
const botones = document.querySelectorAll('.answer-btn');

const resultSection = document.getElementById('result-section');
const scoreDiv = document.getElementById('score');
const percentageDiv = document.getElementById('percentage');
const answerReviewDiv = document.getElementById('answer-review');
const newtestBtn = document.getElementById('new-test-btn');
const backMenuBtn = document.getElementById('back-menu-btn');

// =====================
// Utilidades
// =====================

// Formatea los segundos a mm:ss
function formatTime(seconds) {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${m}:${s}`;
}
//Función que selecciona 10 preguntas aleatorias sin repetición
function getRandomQuestions(bank, n = 10) {
    const copy = [...bank];
    const selected = [];
    while (selected.length < n && copy.length > 0) {
        const idx = Math.floor(Math.random() * copy.length);
        selected.push(copy.splice(idx, 1)[0]);
    }
    return selected;
}

// =====================
// Ranking (localStorage)
// =====================

// Obtiene el ranking del localStorage
function getRanking() {
    const data = localStorage.getItem('test_ranking_programacion');
    return data ? JSON.parse(data) : [];
}

// Guarda el ranking en localStorage
function saveRanking(ranking) {
    localStorage.setItem('test_ranking_programacion', JSON.stringify(ranking));
}

// Actualiza la tabla de ranking en el menú principal
function updateRankingTable() {
    const ranking = getRanking();
    // Ordena por puntaje descendente y fecha más reciente
    ranking.sort((a, b) => b.score - a.score || new Date(b.date) - new Date(a.date));
    // Toma los 5 mejores
    const top5 = ranking.slice(0, 5);
    rankingTable.innerHTML = "";
    top5.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.name}</td>
            <td>${item.score}</td>
            <td>${item.date}</td>
        `;
        rankingTable.appendChild(tr);
    });
}

// ==============================================
// Aquí se empieza a explicar la lógica del test
// ==============================================

// Inicia el Test
function starttest() {
    // Inicializa variables
    testQuestions = getRandomQuestions(questionsBank, 10);
    currentQuestion = 0;
    userAnswers = [];
    score = 0;
    timeLeft = 300; // 5 minutos

    // Oculta menú y muestra test
    mainMenu.classList.add('hidden');
    resultSection.classList.add('hidden');
    testSection.classList.remove('hidden');

    // Inicia temporizador
    timerDisplay.textContent = formatTime(timeLeft);
    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = formatTime(timeLeft);
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            finishtest();
        }
    }, 1000);

    // Muestra la primera pregunta
    showQuestion();
}

// Muestra la pregunta actual
function showQuestion() {
    // Limpia respuestas previas
    questionDiv.textContent = "";
    answersDiv.innerHTML = "";
    nextBtn.disabled = true;

    // Obtiene la pregunta actual
    const q = testQuestions[currentQuestion];
    questionDiv.textContent = `Pregunta ${currentQuestion + 1}: ${q.question}`;

    // Crea los botones de respuesta
    q.answers.forEach((ans, idx) => {
        const btn = document.createElement('button');
        btn.className = 'answer-btn';
        btn.textContent = ans;
        btn.disabled = false;
        btn.addEventListener('click', () => selectAnswer(idx, btn));
        answersDiv.appendChild(btn);
    });
}

// Maneja la selección de respuesta
function selectAnswer(idx, btn) {
    const buttons = answersDiv.querySelectorAll('button');
    // Quita la clase 'selected' de todos los botones
    buttons.forEach(b => {
        b.classList.remove('selected');
    });    
    btn.classList.add('selected');
    // Guarda la respuesta del usuario
    userAnswers[currentQuestion] = idx;
    nextBtn.disabled = false;
}

// Maneja el botón siguiente
nextBtn.addEventListener('click', () => {
    currentQuestion++;
    if (currentQuestion < testQuestions.length) {
        showQuestion();
    } else {
        finishtest();
    }
});

// Finaliza el test y muestra resultados
function finishtest() {
    // Detiene el temporizador
    clearInterval(timerInterval);

    // Oculta test y muestra resultados
    testSection.classList.add('hidden');
    resultSection.classList.remove('hidden');

    // Calcula el puntaje
    score = 0;
    answerReviewDiv.innerHTML = "";
    testQuestions.forEach((q, idx) => {
        const userAns = userAnswers[idx];
        const isCorrect = userAns === q.correct;
        if (isCorrect) score++;
        // Muestra revisión de cada pregunta
        const div = document.createElement('div');
        div.className = 'review-item ' + (isCorrect ? 'correct' : 'incorrect');
        div.innerHTML = `<strong>Pregunta ${idx + 1}:</strong> ${q.question}<br>
            <strong>Tu respuesta:</strong> ${q.answers[userAns] || "Sin responder"}<br>
            <strong>Respuesta correcta:</strong> ${q.answers[q.correct]}`;
        answerReviewDiv.appendChild(div);
    });

    // Muestra puntaje y porcentaje
    scoreDiv.textContent = `Puntaje: ${score}/10`;
    percentageDiv.textContent = `Acierto: ${Math.round((score / 10) * 100)}%`;

    // Guarda en el ranking
    const today = new Date();
    const dateStr = today.toLocaleDateString() + " " + today.toLocaleTimeString().slice(0,5);
    const ranking = getRanking();
    ranking.push({ name: userName, score: score, date: dateStr });
    saveRanking(ranking);
    updateRankingTable();
}

// =====================
// Control de eventos
// =====================

// Habilita el botón iniciar solo si hay nombre
usernameInput.addEventListener('input', () => {
    startBtn.disabled = usernameInput.value.trim().length === 0;
});

// Maneja el envío del formulario de usuario
userForm.addEventListener('submit', (e) => {
    e.preventDefault();
    userName = usernameInput.value.trim();
    starttest();
});

// Botón para nuevo test (misma persona)
newtestBtn.addEventListener('click', () => {
    resultSection.classList.add('hidden');
    starttest();
});

// Botón para volver al menú principal
backMenuBtn.addEventListener('click', () => {
    resultSection.classList.add('hidden');
    mainMenu.classList.remove('hidden');
    usernameInput.value = "";
    startBtn.disabled = true;
});

// Al cargar la página, actualiza el ranking
updateRankingTable();