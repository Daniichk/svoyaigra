const gameData = [
    { cat: "Испания", qs: [
        {p: 100, q: "Какой популярный вид спорта в Испании считается «королевским»?", a: "Футбол"},
        {p: 200, q: "Традиционное испанское блюдо из риса с добавлением морепродуктов или мяса?", a: "Паэлья"},
        {p: 300, q: "Какое животное является символом Испании?", a: "Бык"},
        {p: 400, q: "Как называется знаменитый танец, родом из Андалусии, где танцоры громко стучат каблуками и используют веера?", a: "Фламенко"},
        {p: 500, q: "На каком острове, принадлежащем Испании, находится самый высокий вулкан страны — Тейде?", a: "Тенерифе (Канарские острова)"}
    ]},
    { cat: "География", qs: [
        {p: 100, q: "Как называется самое глубокое озеро в мире, в котором сосредоточено около 20% всей пресной воды планеты?", a: "Байкал"},
        {p: 200, q: "Как называется самая большая пустыня в мире, которая находится в Африке и покрыта песками?", a: "Сахара"},
        {p: 300, q: "Какое море на планете является самым соленым и находится в самой низкой точке суши (ниже уровня океана)?", a: "Мёртвое море"},
        {p: 400, q: "Через какую страну проходит линия экватора в Южной Америке, и само название страны переводится как «Экватор»?", a: "Эквадор"},
        {p: 500, q: "Какое второе название самой высокой точки планеты, если первое это Эверест?", a: "Джомолунгма"}
    ]},
    { cat: "Метро", qs: [
        {p: 100, q: "Кто управляет поездом?", a: "Машинист"},
        {p: 200, q: "Город, где появилось первое метро в 1863 году?", a: "Лондон"},
        {p: 300, q: "Поезд, на котором Гарри Поттер ехал в школу?", a: "Хогвартс-Экспресс"},
        {p: 400, q: "Самая длинная железная дорога (Москва — Владивосток)?", a: "Транссиб"},
        {p: 500, q: "Поезд на магнитной подушке, который «летит»?", a: "Маглев"}
    ]},
    { cat: "Мир Технологий", qs: [
        {p: 100, q: "Как называеться первая криптовалюта?", a: "Биткойн"},
        {p: 200, q: "Как называеться самая крупная поисковая система?", a: " Google"},
        {p: 300, q: "Как зовут программиста который создал операционную систему Linux?", a: "Линус Торвальдс"},
        {p: 400, q: "Как в программировании называется ситуация, когда два или более процесса бесконечно ждут друг друга, чтобы освободить ресурс, и в итоге вся программа «зависает» намертво??", a: "Deadlock (Взаимная блокировка)"},
        {p: 500, q: "Эта женщина-математик в 19 веке написала первую в мире программу для аналитической машины Бэббиджа. Кто она?", a: "Ада Лавлейс"}
    ]},
    { cat: "Логика (Hard)", qs: [
        {p: 100, q: "У отца Мэри есть 5 дочерей: Нана, Нене, Нини, Ноно. Как зовут пятую?", a: "Мэри"},
        {p: 200, q: "Какое слово начинается на три г, а заканчивается на три я?", a: "Тригонометрия"},
        {p: 300, q: "Дом имеет четыре стены, причём все они смотрят на юг. Вокруг дома ходит медведь. Какого он цвета?", a: "Белого (такое вохможно только на Северном Полюсе)"},
        {p: 400, q: "В квартире живут домашние животные: собаки и кошки. Из всех животных только одно не является собакой, при этом все питомцы, кроме одного, — кошки. Сколько всего кошек и собак?", a: "Одна собака и одна кошка"},
        {p: 500, q: "Какая закономерность в этом ряду цифр: 8,2,9,0,1,5,7,3,4,6 ?", a: "В алфавитом порядке их названий"}
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
    if(isWin) {
        teams[turn].score += currentVal;
    }
    // Если isWin === false, мы просто ничего не делаем со счетом

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
