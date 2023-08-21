function Gameboard () {
    let _board = new Array(9);

    const reset = () => {
        _board = [];
    }

    const getBoard = () => _board;

    const updateBoard = (sign, index) => {
        _board[index] = sign;
    };

    const checkWinner = (sign, roundCount) => {
        if(roundCount < 5) {
            return false;
        }
        for(let i = 0; i < 9;) {
            if(_board[i] === sign && _board[i+1] === sign && _board[i+2] === sign) {
                return true;
            }
            i += 3; 
        }

        for(let i = 0; i < 3; ++i) {
            if(_board[i] === sign && _board[i+3] === sign && _board[i+6] === sign) {
                return true;
            }
        }

        if(_board[0] === sign && _board[4] === sign && _board[8] === sign) {
            return true;
        }

        if(_board[2] === sign && _board[4] === sign && _board[6] === sign) {
            return true;
        }

        return false;
    }
    return {getBoard, updateBoard, checkWinner, reset};
}

function GameController (
    playerOneName = "Player One", 
    playerTwoName = 'Player Two'
) {
    const board = Gameboard();


    const players = [
        {
            name: playerOneName, 
            sign: 'X'
        },
        {
            name: playerTwoName,
            sign: 'O'
        }
    ];

    let activePlayer = players[Math.floor(Math.random() * 2)];

    let roundCount = 0;
    let gameEnd = false;
    let winner = 'No';

    function hasGameEnded() {
        gameEnd = board.checkWinner(players[0].sign, roundCount);
        if(gameEnd === true) {
            return players[0].name;
        }

        gameEnd = board.checkWinner(players[1].sign, roundCount);
        if(gameEnd === true) {
            return players[1].name;
        }

        if(roundCount === 9) {
            return 'Draw';
        }

        if(gameEnd === false) {
            return 0;
        }
        
    }

    const switchPlayerTurn = () => {
        if(activePlayer === players[0]) {
            activePlayer = players[1];
        } else {
            activePlayer = players[0]
        }
    };

    const getActivePlayer = () => activePlayer;

    const playRound = (index) => {
        roundCount++;
        board.updateBoard(activePlayer.sign, index);
        
        winner = hasGameEnded();
        switchPlayerTurn();
        return winner;
    };

    const reset = () => {
        board.reset();
        roundCount = 0;
        activePlayer = players[Math.floor(Math.random() * 2)];
    }

    
    return {
        playRound,
        getActivePlayer,
        getBoard: board.getBoard,
        reset
    };
}

function ScreenController () {
    const game = GameController();
    const playerTurn = document.getElementById('playerTurn');
    const crossBtn = document.getElementById('cross');
    const circleBtn = document.getElementById('circle');
    const resetBtn = document.getElementById('resetBtn');

    resetBtn.onclick = () => {
        reset();
    };

    const gameResultModal = document.getElementById('overlay');
    const winMessage = document.getElementById('winMessage');

    let result = 0;

    let buttons = new Array(9);
    for(let i = 0; i < 9; ++i) {
        buttons[i] = document.getElementById(`box${(i+1)}`);
    }
    
    const reset = () => {
        game.reset();
        buttons.forEach((button) => {
            button.removeAttribute('disabled');
        });
        gameResultModal.classList.remove('active');
        updateScreen();
    }

    const updateScreen = () => {

        const board =  game.getBoard();
        const activePlayer = game.getActivePlayer();
        updateActivePLayerSign(activePlayer.sign);

        playerTurn.textContent = `${activePlayer.name}'s turn..`;
        
        for(let i = 0; i < 9; ++i) {
            buttons[i].firstElementChild.textContent = board[i];
        }
    }

    const gameEnd = () => {
        gameResultModal.classList.add('active');
        if(result === 'Draw')
        {
            winMessage.innerText = `The result is a DRAW`;
        } else {
            winMessage.innerText = `${result} is the WINNER`;
        }
        gameResultModal.addEventListener('click', () => { 
            reset();
        });
    } 

    function clickHandlerBoard() {
        result = game.playRound(this.value - 1);
        this.setAttribute('disabled', '');
        updateScreen();
        if(result != 0) {
            gameEnd();
        }
    }
    buttons.forEach((button) => {
        button.addEventListener('click', clickHandlerBoard);
    });

    const updateActivePLayerSign = (sign) => {
        if(sign === 'X') {
            circleBtn.classList.remove('selected-sign');
            crossBtn.classList.add('selected-sign');
        } else {
            crossBtn.classList.remove('selected-sign');
            circleBtn.classList.add('selected-sign');
        }
    };
    updateScreen();
}


ScreenController();
