const CONFIG = {
    correctUser: "shamshon",
    correctPass: "16/4/2026",
    mathAnswer: 10,
    q2Answer: 9,
    puzzleImages: ["puzzle1.jpg", "puzzle2.jpg", "puzzle3.jpg"]
};

let currentStep = 0;
let currentPuzzleIndex = 0;
let puzzlePiecesOrder = [];
let originalOrder = [0, 1, 2, 3, 4, 5, 6, 7, 8];
let musicStarted = false;

function startMusic() {
    if (!musicStarted) {
        const music = document.getElementById('bg-music');
        music.play().then(() => {
            musicStarted = true;
        }).catch(error => {
            console.log("Audio waiting for interaction", error);
        });
    }
}

function checkLogin() {
    const userInput = document.getElementById('login-user').value.trim();
    const passInput = document.getElementById('login-pass').value.trim();
    const feedback = document.getElementById('login-feedback');

    if (userInput === CONFIG.correctUser && passInput === CONFIG.correctPass) {
        triggerMassiveHearts(() => {
            hideAllScreens();
            document.getElementById('screen-start').classList.remove('hidden');
        });
    } else {
        feedback.style.color = "red";
        feedback.innerText = "Wrong password! 😡";
    }
}

function triggerMassiveHearts(callback) {
    const symbols = ['❤️', '💖', '💗', '💓', '💕', '💘', '✨'];

    for (let i = 0; i < 90; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.className = 'massive-floating-heart';
            heart.innerText = symbols[Math.floor(Math.random() * symbols.length)];
            heart.style.left = Math.random() * 98 + 'vw';
            heart.style.fontSize = (Math.random() * 2 + 1.2) + 'rem';
            heart.style.animationDuration = (Math.random() * 0.5 + 1.1) + 's';
            document.body.appendChild(heart);

            setTimeout(() => {
                heart.remove();
            }, 1600);
        }, i * 12);
    }

    const container = document.getElementById('game-container');
    container.style.opacity = '0';
    container.style.transform = 'scale(0.85)';

    setTimeout(() => {
        callback();
        container.style.opacity = '1';
        container.style.transform = 'scale(1)';
    }, 800);
}

function hideAllScreens() {
    document.querySelectorAll('.container > div').forEach(el => el.classList.add('hidden'));
    document.getElementById('game-container').classList.remove('final-screen-container');
}

function directTransition(stepNum) {
    triggerMassiveHearts(() => {
        hideAllScreens();
        currentStep = stepNum;

        if (currentStep === 1) {
            document.getElementById('screen-math').classList.remove('hidden');
        } else if (currentStep === 3) {
            document.getElementById('screen-q2').classList.remove('hidden');
        }
    });
}

function checkMath() {
    const val = parseInt(document.getElementById('math-answer').value);
    const feedback = document.getElementById('math-feedback');

    if (val === CONFIG.mathAnswer) {
        feedback.style.color = "green";
        feedback.innerText = "Correct! ✨";

        setTimeout(() => {
            triggerMassiveHearts(() => {
                hideAllScreens();
                currentStep = 2;
                document.getElementById('screen-math-msg').classList.remove('hidden');
            });
        }, 600);
    } else {
        feedback.style.color = "red";
        feedback.innerText = "Wrong answer, try again! 😡";
    }
}

function checkQ2() {
    const val = parseInt(document.getElementById('q2-answer').value);
    const feedback = document.getElementById('q2-feedback');

    if (val === CONFIG.q2Answer) {
        triggerMassiveHearts(() => {
            hideAllScreens();
            document.getElementById('screen-msg2').classList.remove('hidden');
        });
    } else {
        feedback.style.color = "red";
        feedback.innerText = "rakzy ya shamshon 😡";
    }
}

function startPuzzlePhase(index) {
    currentPuzzleIndex = index - 1;

    if (currentPuzzleIndex >= CONFIG.puzzleImages.length) {
        triggerMassiveHearts(() => {
            hideAllScreens();
            const gameLayer = document.getElementById('game-layer');
            gameLayer.classList.add('leaving');
            setTimeout(() => {
                gameLayer.style.display = 'none';
                if (window.startBirthdayFilm) window.startBirthdayFilm();
            }, 650);
        });
        return;
    }

    triggerMassiveHearts(() => {
        hideAllScreens();
        document.getElementById('screen-puzzle').classList.remove('hidden');
        document.getElementById('puzzle-title').innerText =
            `Puzzle Stage (${currentPuzzleIndex + 1})`;
        document.getElementById('puzzle-feedback').innerText = "";
        setupPuzzleBoard();
    });
}

function playBirthdayTypingEffect() {
    const textElement = document.getElementById('typed-bday-line');
    textElement.innerHTML = "";

    const text = "Happiest of Birthdays ❤️";
    let i = 0;

    function typeWriter() {
        if (i < text.length) {
            textElement.innerHTML += text.charAt(i);
            i++;
            setTimeout(typeWriter, 90);
        }
    }

    typeWriter();
}

function setupPuzzleBoard() {
    const board = document.getElementById('puzzle-board');
    board.innerHTML = "";

    puzzlePiecesOrder = [...originalOrder];
    puzzlePiecesOrder.sort(() => Math.random() - 0.5);

    if (JSON.stringify(puzzlePiecesOrder) === JSON.stringify(originalOrder)) {
        puzzlePiecesOrder.reverse();
    }

    const imgUrl = CONFIG.puzzleImages[currentPuzzleIndex];

    puzzlePiecesOrder.forEach((pieceIndex, slotIndex) => {
        const piece = document.createElement('div');
        piece.className = 'puzzle-piece';
        piece.dataset.slot = slotIndex;
        piece.dataset.piece = pieceIndex;

        const x = (pieceIndex % 3) * 110;
        const y = Math.floor(pieceIndex / 3) * 110;

        piece.style.backgroundImage = `url('${imgUrl}')`;
        piece.style.backgroundPosition = `-${x}px -${y}px`;
        piece.style.backgroundSize = '330px 330px';

        piece.onclick = () => selectPiece(piece);
        board.appendChild(piece);
    });
}

let selectedPiece = null;

function selectPiece(piece) {
    if (!selectedPiece) {
        selectedPiece = piece;
        piece.style.border = "2px dashed #ff6584";
    } else {
        let tempBg = selectedPiece.style.backgroundPosition;
        let tempPieceVal = selectedPiece.dataset.piece;

        selectedPiece.style.backgroundPosition = piece.style.backgroundPosition;
        selectedPiece.dataset.piece = piece.dataset.piece;

        piece.style.backgroundPosition = tempBg;
        piece.dataset.piece = tempPieceVal;

        selectedPiece.style.border = "1px solid #fff";
        selectedPiece = null;
    }
}

function checkPuzzle() {
    const pieces = document.querySelectorAll('.puzzle-piece');
    let isCorrect = true;

    pieces.forEach(p => {
        if (parseInt(p.dataset.slot) !== parseInt(p.dataset.piece)) {
            isCorrect = false;
        }
    });

    const feedback = document.getElementById('puzzle-feedback');

    if (isCorrect) {
        feedback.style.color = "green";
        feedback.innerText = "Great job! Puzzle solved 🎯";

        setTimeout(() => {
            startPuzzlePhase(currentPuzzleIndex + 2);
        }, 800);
    } else {
        feedback.style.color = "red";

        let wrongMessages = [
            "tb graby tany tayb 😡",
            "ya shamshonnn 😡",
            "el sabr mn andk ya rb 😡"
        ];

        feedback.innerText = wrongMessages[currentPuzzleIndex];
    }
}

const soundtrack = document.getElementById('bg-music');

window.replayWholeGame = function() {
    if (window.resetBirthdayFilm) window.resetBirthdayFilm();

    const scene = document.getElementById('film-scene');
    if (scene) {
        scene.classList.remove('is-active');
        scene.setAttribute('aria-hidden', 'true');
    }

    const layer = document.getElementById('game-layer');
    layer.style.display = 'grid';
    requestAnimationFrame(() => layer.classList.remove('leaving'));

    hideAllScreens();
    document.getElementById('screen-login').classList.remove('hidden');

    document.getElementById('game-container').style.opacity = '1';
    document.getElementById('game-container').style.transform = 'scale(1)';

    ['login-user', 'login-pass', 'math-answer', 'q2-answer'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });

    ['login-feedback', 'math-feedback', 'q2-feedback', 'puzzle-feedback'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = '';
    });

    currentStep = 0;
    currentPuzzleIndex = 0;
    selectedPiece = null;
};