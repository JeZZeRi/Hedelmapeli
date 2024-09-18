const rullaImages = [
    'Hedelmäpelikuvat/omena.png', 
    'Hedelmäpelikuvat/paaryna.png', 
    'Hedelmäpelikuvat/kirsikka.png', 
    'Hedelmäpelikuvat/vesimeloni.png', 
    'Hedelmäpelikuvat/seiska.png'
];

const rullaElements = document.querySelectorAll('.rulla-image');
const lockButtons = document.querySelectorAll('.lock-button img');
const playButton = document.getElementById('play-button');
const startButton = document.getElementById('start-button');
const initialMoneyInput = document.getElementById('initial-money');
const balanceDisplay = document.getElementById('balance');
const messageDisplay = document.getElementById('message');

let money = 0;
let bet = 1;
let lockedrullas = [false, false, false, false];
let allowLocking = false;
let lockedThisRound = false;

const betImages = {
    1: {
        normal: 'Hedelmäpelikuvat/yksi.png',
        selected: 'Hedelmäpelikuvat/yksiy.png'
    },
    2: {
        normal: 'Hedelmäpelikuvat/kaksi.png',
        selected: 'Hedelmäpelikuvat/kaksiy.png'
    },
    3: {
        normal: 'Hedelmäpelikuvat/kolme.png',
        selected: 'Hedelmäpelikuvat/kolmey.png'
    },
    5: {
        normal: 'Hedelmäpelikuvat/viisi.png',
        selected: 'Hedelmäpelikuvat/viisiy.png'
    },
    10: {
        normal: 'Hedelmäpelikuvat/kymmenen.png',
        selected: 'Hedelmäpelikuvat/kymmeneny.png'
    }
};

function updateBalanceDisplay() {
    balanceDisplay.textContent = `Rahaa jäljellä: ${money}€`;
}

function updateLockButtons() {
    lockButtons.forEach((button, index) => {
        if (allowLocking) {
            button.src = lockedrullas[index] ? 'Hedelmäpelikuvat/lukittu.png' : 'Hedelmäpelikuvat/auki.png';
        } else {
            button.src = 'Hedelmäpelikuvat/off.png';
        }
    });
}

function checkWinnings() {
    const rullaResults = Array.from(rullaElements).map(img => img.src.split('/').pop());
    let winnings = 0;

    if (rullaResults.every(r => r === 'seiska.png')) winnings = 10 * bet;
    else if (rullaResults.filter(r => r === 'seiska.png').length === 3) winnings = 5 * bet;
    else if (rullaResults.every(r => r === 'omena.png')) winnings = 6 * bet;
    else if (rullaResults.every(r => r === 'vesimeloni.png')) winnings = 5 * bet;
    else if (rullaResults.every(r => r === 'paaryna.png')) winnings = 4 * bet;
    else if (rullaResults.every(r => r === 'kirsikka.png')) winnings = 3 * bet;

    if (winnings > 0) {
        messageDisplay.textContent = `Voitit ${winnings}€!`;
        money += winnings;
        allowLocking = false;
        lockedThisRound = false;
    } else {
        messageDisplay.textContent = 'Ei voittoa. Yritä uudelleen!';
        if (lockedThisRound) {
            allowLocking = false;
        } else {
            allowLocking = true;
        }
        lockedThisRound = false;
    }

    updateBalanceDisplay();
    updateLockButtons();
}

function spinrullas() {
    if (money < bet) {
        playButton.innerHTML = '<img src="Hedelmäpelikuvat/eipelaa.png" alt="Ei rahaa" class="img-fluid">';
        messageDisplay.textContent = 'Ei tarpeeksi rahaa pelata!';
        return;
    }

    money -= bet;
    updateBalanceDisplay();

    rullaElements.forEach((img, index) => {
        if (!lockedrullas[index]) {
            const randomImage = rullaImages[Math.floor(Math.random() * rullaImages.length)];
            img.src = randomImage;
        }
    });

    checkWinnings();

    if (!allowLocking) {
        lockedrullas = [false, false, false, false];
    }

    updateLockButtons();
}

startButton.addEventListener('click', function() {
    money = parseInt(initialMoneyInput.value);
    updateBalanceDisplay();
    document.getElementById('start-container').classList.add('d-none');
    document.getElementById('game-container').classList.remove('d-none');
    bet = 1;
    const defaultBetButton = document.querySelector('.bet-button[data-value="1"] img');
    defaultBetButton.src = betImages[1].selected;
    updateLockButtons();
});

playButton.addEventListener('click', spinrullas);

lockButtons.forEach((button, index) => {
    button.addEventListener('click', function () {
        if (allowLocking) {
            lockedrullas[index] = !lockedrullas[index];
            lockedThisRound = true;
            updateLockButtons();
        }
    });
});

document.querySelectorAll('.bet-button').forEach(button => {
    button.addEventListener('click', function() {
        document.querySelectorAll('.bet-button').forEach(btn => {
            const betValue = parseInt(btn.getAttribute('data-value'));
            btn.querySelector('img').src = betImages[betValue].normal;
        });

        const betValue = parseInt(this.getAttribute('data-value'));
        this.querySelector('img').src = betImages[betValue].selected;
        bet = betValue;
    });
})