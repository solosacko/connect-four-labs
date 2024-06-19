/*====================================================== constants ========================================================*/
const COLORS = {
    '0': 'white',
    '1': 'purple',
    '-1': 'orange'
  };
  
  /*=================================================== state variables ====================================================*/
  let turn; // this will 1 or -1
  let board; // this will be a 2d array of 7 arrays with six values
  let winner; // this will be set to null, 1, -1 or 'T'
  
  /*============================================ cached elements ============================================================*/
  const messageEl = document.querySelector('h1');
  const playAgainBtn = document.querySelector('button');
  const markerEls = [...document.querySelectorAll('#markers > div')];
  /*============================================event listeners ===========================================================*/
  document.querySelector('#markers').addEventListener('click', handleDrop);
  
  playAgainBtn.addEventListener('click', init);
  
  /*=============================================functions ===================================================================*/
  init();
  
  function init() {
    turn = 1;
    board = [
      [0, 0, 0, 0, 0, 0], // col 0
      [0, 0, 0, 0, 0, 0], // col 1
      [0, 0, 0, 0, 0, 0], // col 2
      [0, 0, 0, 0, 0, 0], // col 3
      [0, 0, 0, 0, 0, 0], // col 4
      [0, 0, 0, 0, 0, 0], // col 5
      [0, 0, 0, 0, 0, 0], // col 6
      //r0 r1 r2 r3 r4 r5 
    ];
    winner = null;
    render();
  }
  
  // handleDrop updates state and transfers updates to the DOM
  function handleDrop(evt) {
    console.log(evt)
    // 1) find the column index for each marker
    const colIdx = markerEls.indexOf(evt.target);
    // 1.1) add a guard to prevent acting on parent element trigger
    if (colIdx === -1 || winner) return;
    // 2) find the column for the corresponding column index in the board array
    const colArr = board[colIdx]
    // 3) find the first available zero in the column array
    // 4) update that zero to a 1 or -1 depending on who's turn it is
    const rowIdx = colArr.indexOf(0);
  
    colArr[rowIdx] = turn;
    // 5) toggle the turn 
    turn *= -1;
    // 6) update the winner - check if we have a winner
    winner = getWinner(colIdx, rowIdx);
    // 7) call render to transfer updated state to the DOM
    render();
  }
  
  
  function getWinner(colIdx, rowIdx) {
    return checkVerticalWin(colIdx, rowIdx) ||
      checkHorizontalWin(colIdx, rowIdx) ||
      checkDiagonalWinNESW(colIdx, rowIdx) ||
      checkDiagonalWinNWSE(colIdx, rowIdx);
  }  

  function checkDiagonalWinNWSE(colIdx, rowIdx) {
    const countAdjacentNW = countAdjacent(colIdx, rowIdx, -1, 1);
    const countAdjacentSE = countAdjacent(colIdx, rowIdx, 1, -1);
    return (countAdjacentNW + countAdjacentSE) >= 3 ? board[colIdx][rowIdx] : null;
  }
  
  function checkDiagonalWinNESW(colIdx, rowIdx) {
    const countAdjacentNE = countAdjacent(colIdx, rowIdx, 1, 1);
    const countAdjacentSW = countAdjacent(colIdx, rowIdx, -1, -1);
    return (countAdjacentNE + countAdjacentSW) >= 3 ? board[colIdx][rowIdx] : null;
  }
  
  function checkHorizontalWin(colIdx, rowIdx) {
    const countAdjacentLeft = countAdjacent(colIdx, rowIdx, -1, 0);
    const countAdjacentRight = countAdjacent(colIdx, rowIdx, 1, 0);
    return (countAdjacentLeft + countAdjacentRight) >= 3 ? board[colIdx][rowIdx] : null;
  }
  
  function checkVerticalWin(colIdx, rowIdx) {
    return countAdjacent(colIdx, rowIdx, 0, -1) === 3 ? board[colIdx][rowIdx] : null;
  }
  
  function countAdjacent(colIdx, rowIdx, colOffset, rowOffset) {
    // create a variable to keep track of the player we are counting disks for
    const player = board[colIdx][rowIdx]; // 1
    // create a variable to keep track of the count
    let count = 0;
    // initialize our new coords
    colIdx += colOffset;
    rowIdx += rowOffset;
    // begin counting
    while (
      board[colIdx] !== undefined &&
      board[colIdx][rowIdx] !== undefined &&
      board[colIdx][rowIdx] === player
    ) {
      // During counting:
      // make sure we stay within the bounds of the game board
      // make sure the current disk we're checking is for the same player
    // count
    count++
    // update coords
    colIdx += colOffset;
    rowIdx += rowOffset;
  }
  // return the count
  return count;
}

// this function transfers the state of our application to the DOM
function render() {
  renderBoard();
  renderMessage();
  renderControls();
}

function renderBoard() {
  board.forEach(function(colArr, colIdx) {
    colArr.forEach(function(rowVal, rowIdx) {
      const cellId = `c${colIdx}r${rowIdx}`;
      const cellEl = document.getElementById(cellId);
      cellEl.style.backgroundColor = COLORS[rowVal];
    });
  });
}

function renderMessage() {
  if (winner === 'T') {
    messageEl.innerText = "It's a Tie!!!";
  } else if (winner) {
    messageEl.innerHTML = `<span style="color: ${COLORS[winner]}">${COLORS[winner].toUpperCase()}</span> Wins!`;
  } else {
    messageEl.innerHTML = `<span style="color: ${COLORS[turn]}">${COLORS[turn].toUpperCase()}</span>'s turn`;
  }
}

function renderControls() {
  // the button & markers need to be rendered conditionally
  // button: hide while the game is in play
  // markers: hide when a column is occupied or there's a winner
  playAgainBtn.style.visibility = winner ? 'visible' : 'hidden';
  // 1) iterate the markers NodeList using forEach
  // 2) for each div check the corresponding column to see if there are no zeros
  // 3) if there are no zeros or there's winner, we set visibility to hidden
  // 4) otherwise we set visibility to visible
  markerEls.forEach(function(marker, colIdx) {
    const colArr = board[colIdx];
    const hideMarker = !colArr.includes(0) || winner;
    marker.style.visibility = hideMarker ? 'hidden' : 'visible';
  });
}

