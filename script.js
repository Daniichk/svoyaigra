const gameData = [
    { cat: "Испания", qs: [
        {p: 100, q: "Какой популярный вид спорта в Испании считается «королевским»?", a: "Футбол"},
        {p: 200, q: "Традиционное испанское блюдо из риса с добавлением морепродуктов или мяса?", a: "Паэлья"},
        {p: 300, q: "Какое животное является символом Испании?", a: "Бык"},
        {p: 400, q: "Как называется знаменитый танец, родом из Андалусии, где танцоры громко стучат каблуками и используют веера?", a: "Фламенко"},
        {p: 500, q: "На каком острове, принадлежащем Испании, находится самый высокий вулкан страны — Тейде?", a: "Тенерифе (Канарские острова)"}
    ]},
    { cat: "Математика", qs: [
        {p: 100, q: "2 + 2 * 2", a: "6"},
        {p: 200, q: "Корень из 169", a: "13"},
        {p: 300, q: "Сумма углов треугольника", a: "180"},
        {p: 400, q: "Производная от x^2", a: "2x"},
        {p: 500, q: "Чему равно число e (до 2 знаков)?", a: "2.71"}
    ]},
    { cat: "Стэнфорд", qs: [
        {p: 100, q: "В какой стране университет?", a: "США"},
        {p: 200, q: "В каком штате?", a: "Калифорния"},
        {p: 300, q: "Цвет Стэнфорда?", a: "Cardinal Red (Красный)"},
        {p: 400, q: "Девиз Стэнфорда?", a: "Веет ветер свободы"},
        {p: 500, q: "Основатель (имя)?", a: "Лиланд Стэнфорд"}
    ]},
    { cat: "Web", qs: [
        {p: 100, q: "Тег ссылки?", a: "<a>"},
        {p: 200, q: "Свойство для сетки?", a: "display: grid"},
        {p: 300, q: "Как объявить константу в JS?", a: "const"},
        {p: 400, q: "Что такое API?", a: "Application Programming Interface"},
        {p: 500, q: "Первый браузер в истории?", a: "WorldWideWeb (Nexus)"}
    ]},
    { cat: "Разное", qs: [
        {p: 100, q: "Столица Испании?", a: "Мадрид"},
        {p: 200, q: "Кто создал биткоин?", a: "Сатоши Накамото"},
        {p: 300, q: "Самая высокая гора?", a: "Эверест"},
        {p: 400, q: "Сколько планет в солнечной системе?", a: "8"},
        {p: 500, q: "В каком году распался СССР?", a: "1991"}
    ]}
];

let teams = [];
let turn = 0;
let currentVal = 0;
let currentEl = null;

// Обновление полей имен
document.getElementById('team-count').addEventListener('input', function() {
    const n = Math.max(2, Math.min(5, this.value));
    const container = document.getElementById('team-names-inputs');
    container.innerHTML = '';
    for(let i=1; i<=n; i++) {
        container.innerHTML += `<input type="text" id="name-${i}" placeholder="Команда ${i}" value="Команда ${i}">`;
    }
});

function startGame() {
    const overlay = document.getElementById('transition-overlay');
    overlay.classList.add('slide-active');

    setTimeout(() => {
        const count = document.getElementById('team-count').value;
        teams = [];
        for(let i=1; i<=count; i++) {
            teams.push({ name: document.getElementById(`name-${i}`).value, score: 0 });
        }
        document.getElementById('setup-screen').classList.add('hidden');
        document.getElementById('game-screen').classList.remove('hidden');
        buildBoard();
        updateUI();
    }, 500);

    setTimeout(() => overlay.classList.remove('slide-active'), 1000);
}

function buildBoard() {
    const board = document.getElementById('game-board');
    board.innerHTML = '';
    
    // Заголовки
    gameData.forEach(c => {
        const div = document.createElement('div');
        div.className = 'cat-head';
        div.innerText = c.cat;
        board.appendChild(div);
    });

    // Карточки
    for(let i=0; i<5; i++) {
        gameData.forEach(c => {
            const q = c.qs[i];
            const div = document.createElement('div');
            div.className = 'q-card';
            div.innerText = q.p;
            div.onclick = () => openModal(q, div, c.cat);
            board.appendChild(div);
        });
    }
}

function openModal(q, el, catName) {
    if(el.classList.contains('used')) return;
    currentVal = q.p;
    currentEl = el;

    document.getElementById('modal-category').innerText = catName;
    document.getElementById('modal-question').innerText = q.q;
    document.getElementById('modal-answer').innerText = q.a;
    
    document.getElementById('answer-box').classList.add('hidden');
    document.getElementById('result-buttons').classList.add('hidden');
    document.getElementById('show-answer-btn').classList.remove('hidden');
    
    document.getElementById('modal').classList.remove('hidden');
}

function showAnswer() {
    document.getElementById('answer-box').classList.remove('hidden');
    document.getElementById('result-buttons').classList.remove('hidden');
    document.getElementById('show-answer-btn').classList.add('hidden');
}

function processResult(isWin) {
    if(isWin) teams[turn].score += currentVal;
    else teams[turn].score -= currentVal;

    currentEl.classList.add('used');
    currentEl.innerText = '';
    
    document.getElementById('modal').classList.add('hidden');
    turn = (turn + 1) % teams.length;
    updateUI();
}

function updateUI() {
    const sb = document.getElementById('scoreboard');
    sb.innerHTML = '';
    teams.forEach((t, i) => {
        const d = document.createElement('div');
        d.className = `team-item ${i === turn ? 'active' : ''}`;
        d.innerHTML = `<small>${t.name}</small><div>${t.score}</div>`;
        sb.appendChild(d);
    });
    document.getElementById('current-team-display').innerText = teams[turn].name;
}

// Инициализация
document.getElementById('team-count').dispatchEvent(new Event('input'));
