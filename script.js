const gameData = [
    {
        category: "Python",
        questions: [
            { p: 100, q: "Как вывести текст в консоль?", a: "print()" },
            { p: 200, q: "Тип данных для целых чисел?", a: "int" },
            { p: 300, q: "Метод для добавления в список?", a: "append()" },
            { p: 400, q: "Как начать цикл по диапазону чисел?", a: "for i in range():" },
            { p: 500, q: "Что такое __init__?", a: "Конструктор класса" }
        ]
    },
    {
        category: "Math",
        questions: [
            { p: 100, q: "2 + 2 * 2", a: "6" },
            { p: 200, q: "Корень из 144", a: "12" },
            { p: 300, q: "Число Пи до двух знаков", a: "3.14" },
            { p: 400, q: "Сумма углов треугольника", a: "180" },
            { p: 500, q: "Факториал числа 4", a: "24" }
        ]
    },
    {
        category: "Web",
        questions: [
            { p: 100, q: "Тег для ссылок?", a: "<a>" },
            { p: 200, q: "Свойство для жирного текста?", a: "font-weight" },
            { p: 300, q: "Как объявить константу в JS?", a: "const" },
            { p: 400, q: "Что такое DOM?", a: "Document Object Model" },
            { p: 500, q: "Свойство для сетки в CSS?", a: "display: grid" }
        ]
    },
    {
        category: "Stanford",
        questions: [
            { p: 100, q: "В какой стране находится Стэнфорд?", a: "США" },
            { p: 200, q: "В каком штате находится университет?", a: "Калифорния" },
            { p: 300, q: "Основатели Google учились там?", a: "Да (Ларри Пейдж и Сергей Брин)" },
            { p: 400, q: "Цвет Стэнфорда?", a: "Кардинал (красный)" },
            { p: 500, q: "Год основания?", a: "1885" }
        ]
    },
    {
        category: "CS",
        questions: [
            { p: 100, q: "Минимальная единица информации?", a: "Бит" },
            { p: 200, q: "Сколько бит в байте?", a: "8" },
            { p: 300, q: "Что такое CPU?", a: "Центральный процессор" },
            { p: 400, q: "Алгоритм поиска O(log n)?", a: "Бинарный поиск" },
            { p: 500, q: "Первый программист в истории?", a: "Ада Лавлейс" }
        ]
    }
];

let teams = [];
let currentTeamIdx = 0;
let currentVal = 0;
let currentCard = null;

// Динамическое создание полей для имен
document.getElementById('team-count').addEventListener('input', function() {
    const n = Math.min(Math.max(this.value, 2), 5);
    const container = document.getElementById('team-names-inputs');
    container.innerHTML = '';
    for(let i=1; i<=n; i++) {
        container.innerHTML += `<input type="text" id="t-name-${i}" placeholder="Команда ${i}" value="Команда ${i}">`;
    }
});

function startGame() {
    const overlay = document.getElementById('transition-overlay');
    overlay.classList.add('slide-up');

    setTimeout(() => {
        const n = document.getElementById('team-count').value;
        teams = [];
        for(let i=1; i<=n; i++) {
            teams.push({ 
                name: document.getElementById(`t-name-${i}`).value, 
                score: 0 
            });
        }
        document.getElementById('setup-screen').style.display = 'none';
        document.getElementById('game-screen').classList.remove('hidden');
        render();
        updateUI();
    }, 600);

    setTimeout(() => overlay.classList.remove('slide-up'), 1200);
}

function render() {
    const board = document.getElementById('game-board');
    board.innerHTML = '';
    
    // Категории
    gameData.forEach(c => {
        const h = document.createElement('div');
        h.className = 'category-title';
        h.innerText = c.category;
        board.appendChild(h);
    });

    // Очки
    for(let i=0; i<5; i++) {
        gameData.forEach(c => {
            const q = c.questions[i];
            const div = document.createElement('div');
            div.className = 'card';
            div.innerText = q.p;
            div.onclick = () => openQ(q, div);
            board.appendChild(div);
        });
    }
}

function openQ(q, el) {
    if(el.classList.contains('used')) return;
    
    currentVal = q.p;
    currentCard = el;
    
    document.getElementById('modal-question').innerText = q.q;
    document.getElementById('modal-answer').innerText = q.a;
    
    // Скрываем ответ и кнопки оценки в начале
    document.getElementById('modal-answer').classList.add('hidden');
    document.getElementById('answer-section').classList.add('hidden');
    document.getElementById('show-answer-btn').classList.remove('hidden');
    
    document.getElementById('modal').classList.remove('hidden');
}

function showAnswer() {
    document.getElementById('modal-answer').classList.remove('hidden');
    document.getElementById('answer-section').classList.remove('hidden');
    document.getElementById('show-answer-btn').classList.add('hidden');
}

function processResult(ok) {
    if(ok) teams[currentTeamIdx].score += currentVal;
    else teams[currentTeamIdx].score -= currentVal;

    currentCard.classList.add('used');
    currentCard.innerText = '';
    
    document.getElementById('modal').classList.add('hidden');
    currentTeamIdx = (currentTeamIdx + 1) % teams.length;
    updateUI();
}

function updateUI() {
    const sb = document.getElementById('scoreboard');
    sb.innerHTML = '';
    teams.forEach((t, i) => {
        const d = document.createElement('div');
        d.className = `team-score ${i === currentTeamIdx ? 'active-team' : ''}`;
        d.innerHTML = `<div>${t.name}</div><div style="font-size: 1.5rem; font-weight:800">${t.score}</div>`;
        sb.appendChild(d);
    });
    document.getElementById('current-team-name').innerText = teams[currentTeamIdx].name;
}

// Инициализация при загрузке
document.getElementById('team-count').dispatchEvent(new Event('input'));
