const Gameboard = (function(){
    let board = Array(9).fill(0); // 0 -> empty , 1 -> "X" , 2 -> "O"
    let getboard = () => board;
    let placeMark = (index,player) => {
        if (board[index] !== 0) return false;
        board[index] = player;
        return true; 
    };
    let reset = () => board.fill(0);
    return { getboard , placeMark , reset };
})();
const player = (id,mark) => {
    return { id , mark};
};
function playRound(currPlayer,index){
    if (!Gameboard.placeMark(index,currPlayer.id)) {
        return -1; // -1 -> failed to mark already marked ,1 -> curr played won , 0 -> Draw noOne win, NULL -> Continue Game
    }
    const currBoard = Gameboard.getboard();
    const WINNING_LINES = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for(let line of WINNING_LINES){
        const [a, b, c] = line;
        if (currBoard[a] !== 0 && currBoard[a] === currBoard[b] && currBoard[a] === currBoard[c]){
            return 1;
        }
    }
    if (!currBoard.includes(0)) {
        return 0;
    }
    return null;
}
const game = (function(){
        const player1 = player(1,"X");
        const player2 = player(2,"O");
        let currPlayer = player1;
        let isOver = false;
        let play = (index) => {
            if(isOver) return;
            let status = playRound(currPlayer,index);
            if(status === -1) return;
            if(status === 1){
                isOver = true;
                return currPlayer.mark;
            }
            if(status === 0){
                isOver = true;
                return "Draw";
            }
            currPlayer = currPlayer === player1 ? player2 : player1;
            return "C";
        };
        let reStart = () =>{
            isOver = false;
            Gameboard.reset();
            currPlayer = player1;
        };
        let currChance = () => currPlayer;
        return {play , reStart , currChance};
})();
const cells = document.querySelectorAll(".cell");
function removeMarks(){
    cells.forEach(currCell => {
        currCell.textContent = "";
    });
}
(function () {
    const board = document.querySelector(".board");
    const mark = document.querySelector(".mark");
    const playerX = document.getElementById("playerX");
    const currDraw = document.getElementById("currDraw");
    const playerO = document.getElementById("playerO");
    board.addEventListener("click",(e) => {
        if(e.target.classList.contains("cell")){
            const index = Number(e.target.dataset.index);
            const currPlayer = game.currChance();
            let currStatus = game.play(index);
            if(currStatus === undefined) return;
            e.target.textContent = `${currPlayer.mark}`;
            if (currStatus === "Draw") {
                let Num_Draw = Number(currDraw.textContent);
                Num_Draw++;
                currDraw.textContent = `${Num_Draw}`;
                game.reStart();
                removeMarks();
            }
            if (currStatus === "X") {
                let Num_X = Number(playerX.textContent);
                Num_X++;
                playerX.textContent = `${Num_X}`;
                game.reStart();
                removeMarks();
            }
            if (currStatus === "O") {
                let Num_O = Number(playerO.textContent);
                Num_O++;
                playerO.textContent = `${Num_O}`;
                game.reStart();
                removeMarks();
            }
            mark.textContent = game.currChance().mark;
        }
    });
})();