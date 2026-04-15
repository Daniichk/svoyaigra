const gameData = [
    {
        category: "Python",
        questions: [
            { p: 100, q: "Как вывести текст в консоль?", a: "Используйте print()" },
            { p: 200, q: "Неизменяемый список в Python?", a: "Tuple" },
            { p: 300, q: "Метод добавления в список?", a: "append()" },
            { p: 400, q: "Библиотека для работы с данными?", a: "Pandas" },
            { p: 500, q: "Тип данных для True/False?", a: "Boolean" }
        ]
    },
    {
        category: "Math",
        questions: [
            { p: 100, q: "2 плюс 2 умножить на 2?", a: "6" },
            { p: 200, q: "Корень из 144?", a: "12" },
            { p: 300, q: "Число Пи до двух знаков?", a: "3.14" },
            { p: 400, q: "Сумма углов квадрата?", a: "360 градусов" },
            { p: 500, q: "Чему равен факториал 4?", a: "24" }
        ]
    },
    {
        category: "Computer Science",
        questions: [
            { p: 100, q: "Минимальная единица информации?", a: "Бит" },
            { p: 200, q: "8 бит это один...", a: "Байт" },
            { p: 300, q: "Что такое CPU?", a: "Процессор" },
            { p: 400, q: "Первая версия протокола интернета?", a: "IPv4" },
            { p: 500, q: "Сложность бинарного поиска?", a: "O(log n)" }
        ]
    },
    {
        category: "Frontend",
        questions: [
            { p: 100, q: "Тег для ссылок?", a: "<a>" },
            { p: 200, q: "Свойство цвета текста в CSS?", a: "color" },
            { p: 300, q: "Как объявить константу в JS?", a: "const" },
            { p: 400, q: "Для чего нужен flexbox?", a: "Для выравнивания элементов" },
            { p: 500, q: "Что такое React?", a: "Библиотека для интерфейсов" }
        ]
    },
    {
        category: "General",
        questions: [
            { p: 100, q: "Столица Испании?", a: "Мадрид" },
            { p: 200, q: "Самый глубокий океан?", a: "Тихий" },
            { p: 300, q: "Год основания Стэнфорда?", a: "1885" },
            { p: 400, q: "Кто написал 'Войну и мир'?", a: "Лев Толстой" },
            { p: 500, q: "Химический символ золота?", a: "Au" }
        ]
    }
];

let teams = [];
let currentTeamIdx = 0;
let currentQuestionValue = 0;
let currentCardElement = null;

// Динамические поля ввода
document.getElementById('team-count').addEventListener('input', function() {
    const count = Math.min(Math.max(this.value, 2), 5);
    const container = document.getElementById('team-names-inputs');
    container.innerHTML = '';
    for (let i = 1; i <= count; i++) {
        container.innerHTML += `<input type="text" id="team-name-${i}" placeholder="Название ${i}" value="Команда ${i}">`;
    }
});

function startGame() {
    const overlay = document.getElementById('transition-overlay');
    overlay.classList.add('slide-up');

    // Начинаем логику в середине анимации
    setTimeout(() => {
        const count = document.getElementById('team-count').value;
        teams = [];
        for (let i = 1; i <= count; i++) {
            const name = document.getElementById(`team-name-${i}`).value || `Команда ${i}`;
            teams.push({ name: name, score: 0 });
        }

        document.getElementById('setup-screen').style.display = 'none';
        document.getElementById('game-screen').classList.remove('hidden');
        renderBoard();
        updateUI();
    }, 600);

    // Убираем класс анимации после завершения
    setTimeout(() => {
        overlay.classList.remove('slide-up');
    }, 1200);
}

function renderBoard() {
    const board = document.getElementById('game-board');
    board.innerHTML = '';

    gameData.forEach(cat => {
        const h = document.createElement('div');
        h.className = 'category-title';
        h.innerText = cat.category;
        board.appendChild(h);
    });

    for (let i = 0; i < 5; i++) {
        gameData.forEach(cat => {
            const q = cat.questions[i];
            const card = document.createElement('div');
            card.className = 'card';
            card.innerText = q.p;
            card.onclick = () => openQuestion(q, card);
            board.appendChild(card);
        });
    }
}

function openQuestion(data, card) {
    if (card.classList.contains('used')) return;
    currentQuestionValue = data.p;
    currentCardElement = card;
    document.getElementById('modal-question').innerText = data.q;
    document.getElementById('modal-answer').innerText = data.a;
    document.getElementById('modal').classList.remove('hidden');
    document.getElementById('answer-section').classList.add('hidden');
    document.getElementById('show-answer-btn').classList.remove('hidden');
}

function showAnswer() {
    document.getElementById('answer-section').classList.remove('hidden');
    document.getElementById('show-answer-btn').classList.add('hidden');
}

function processResult(isCorrect) {
    if (isCorrect) {
        teams[currentTeamIdx].score += currentQuestionValue;
    } else {
        teams[currentTeamIdx].score -= currentQuestionValue;
    }
    currentCardElement.classList.add('used');
    currentCardElement.innerText = '';
    document.getElementById('modal').classList.add('hidden');
    currentTeamIdx = (currentTeamIdx + 1) % teams.length;
    updateUI();
}

function updateUI() {
    const scoreboard = document.getElementById('scoreboard');
    scoreboard.innerHTML = '';
    teams.forEach((team, i) => {
        const div = document.createElement('div');
        div.className = `team-score ${i === currentTeamIdx ? 'active-team' : ''}`;
        div.innerHTML = `<div>${team.name}</div><div style="font-size: 1.5rem; font-weight: 800">${team.score}</div>`;
        scoreboard.appendChild(div);
    });
    document.getElementById('current-team-name').innerText = teams[currentTeamIdx].name;
}

window.onload = () => {
    document.getElementById('team-count').dispatchEvent(new Event('input'));
};
