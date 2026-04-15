// 1. ДАННЫЕ ИГРЫ (Вопросы и категории)
const gameData = [
    {
        category: "Python",
        questions: [
            { p: 100, q: "Как вывести текст в консоль?", a: "print()" },
            { p: 200, q: "Как называется список, который нельзя изменять?", a: "Tuple (кортеж)" },
            { p: 300, q: "Функция для получения случайного числа?", a: "random.randint()" },
            { p: 400, q: "Что делает метод .append()?", a: "Добавляет элемент в конец списка" },
            { p: 500, q: "Как называется магический метод инициализации объекта?", a: "__init__" }
        ]
    },
    {
        category: "Math",
        questions: [
            { p: 100, q: "Чему равно 5 в квадрате?", a: "25" },
            { p: 200, q: "Результат умножения называется...", a: "Произведение" },
            { p: 300, q: "Сумма углов в треугольнике?", a: "180 градусов" },
            { p: 400, q: "Чему равно число Пи (до 2 знаков)?", a: "3.14" },
            { p: 500, q: "Как называется график функции y = x²?", a: "Парабола" }
        ]
    },
    {
        category: "HTML/CSS",
        questions: [
            { p: 100, q: "Тег для создания ссылки?", a: "<a>" },
            { p: 200, q: "Как сделать текст жирным в CSS?", a: "font-weight: bold" },
            { p: 300, q: "Что такое Box Model в CSS?", a: "Margin, Border, Padding, Content" },
            { p: 400, q: "Свойство для создания сетки элементов?", a: "display: grid" },
            { p: 500, q: "Для чего нужен атрибут 'alt' у картинки?", a: "Альтернативный текст для доступности" }
        ]
    },
    {
        category: "JS",
        questions: [
            { p: 100, q: "Как объявить переменную, которая не меняется?", a: "const" },
            { p: 200, q: "Какое событие отвечает за клик мышкой?", a: "onclick или addEventListener('click')" },
            { p: 300, q: "Что такое DOM?", a: "Document Object Model" },
            { p: 400, q: "Как превратить строку в целое число?", a: "parseInt()" },
            { p: 500, q: "Что вернет typeof []?", a: "'object'" }
        ]
    },
    {
        category: "Stanford & CS",
        questions: [
            { p: 100, q: "В каком штате находится Стэнфорд?", a: "Калифорния" },
            { p: 200, q: "Минимальная единица информации?", a: "Бит" },
            { p: 300, q: "Основатель компании Apple, учившийся в Стэнфорде (бросил)?", a: "Стив Джобс (но Стэнфорд закончили другие гиганты, например Брин и Пейдж)" },
            { p: 400, q: "Как называется алгоритм сортировки O(n log n)?", a: "Merge Sort / Quick Sort" },
            { p: 500, q: "Как расшифровывается CPU?", a: "Central Processing Unit" }
        ]
    }
];

// 2. ПЕРЕМЕННЫЕ СОСТОЯНИЯ
let teams = [];
let currentTeamIdx = 0;
let currentQuestionValue = 0;
let currentCardElement = null;

// Слушатель для динамического создания полей ввода имен команд
document.getElementById('team-count').addEventListener('input', function() {
    const count = Math.min(Math.max(this.value, 2), 5);
    const container = document.getElementById('team-names-inputs');
    container.innerHTML = '';
    for (let i = 1; i <= count; i++) {
        container.innerHTML += `<input type="text" id="team-name-${i}" placeholder="Имя команды ${i}" value="Команда ${i}">`;
    }
});

// Запуск игры
function startGame() {
    const count = document.getElementById('team-count').value;
    teams = [];
    
    for (let i = 1; i <= count; i++) {
        const name = document.getElementById(`team-name-${i}`).value || `Команда ${i}`;
        teams.push({ name: name, score: 0 });
    }

    document.getElementById('setup-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');

    renderBoard();
    updateUI();
}

// Отрисовка игрового поля
function renderBoard() {
    const board = document.getElementById('game-board');
    board.innerHTML = ''; // Очистка

    // Рисуем заголовки категорий
    gameData.forEach(cat => {
        const h = document.createElement('div');
        h.className = 'category-title';
        h.innerText = cat.category;
        board.appendChild(h);
    });

    // Рисуем сетку вопросов (по строкам для правильного порядка)
    for (let i = 0; i < 5; i++) {
        gameData.forEach((cat, catIdx) => {
            const questionData = cat.questions[i];
            const card = document.createElement('div');
            card.className = 'card';
            card.innerText = questionData.p;
            card.onclick = () => openQuestion(questionData, card);
            board.appendChild(card);
        });
    }
}

// Открытие вопроса
function openQuestion(data, card) {
    if (card.classList.contains('used')) return;

    currentQuestionValue = data.p;
    currentCardElement = card;

    document.getElementById('modal-question').innerText = data.q;
    document.getElementById('modal-answer').innerText = data.a;
    
    // Сброс модалки
    document.getElementById('modal').classList.remove('hidden');
    document.getElementById('answer-section').classList.add('hidden');
    document.getElementById('show-answer-btn').classList.remove('hidden');
}

// Показать ответ
function showAnswer() {
    document.getElementById('answer-section').classList.remove('hidden');
    document.getElementById('show-answer-btn').classList.add('hidden');
}

// Обработка результата (Верно/Неверно)
function processResult(isCorrect) {
    if (isCorrect) {
        teams[currentTeamIdx].score += currentQuestionValue;
    } else {
        teams[currentTeamIdx].score -= currentQuestionValue;
    }

    // Помечаем карточку как использованную
    currentCardElement.classList.add('used');
    currentCardElement.innerText = ''; // Убираем цифры, оставляем крестик из CSS
    
    // Закрываем модалку
    document.getElementById('modal').classList.add('hidden');

    // Переход хода к следующей команде
    currentTeamIdx = (currentTeamIdx + 1) % teams.length;
    
    updateUI();
}

// Обновление интерфейса (очки и чей ход)
function updateUI() {
    const scoreboard = document.getElementById('scoreboard');
    scoreboard.innerHTML = '';

    teams.forEach((team, i) => {
        const div = document.createElement('div');
        div.className = `team-score ${i === currentTeamIdx ? 'active-team' : ''}`;
        div.innerHTML = `
            <div class="t-name">${team.name}</div>
            <div class="t-points">${team.score}</div>
        `;
        scoreboard.appendChild(div);
    });

    document.getElementById('current-team-name').innerText = teams[currentTeamIdx].name;
}

// Инициализация полей при загрузке
window.onload = () => {
    document.getElementById('team-count').dispatchEvent(new Event('input'));
};
