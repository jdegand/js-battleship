function readUserInput(prompt, min_value, max_value){
    // cancel of the prompt is useless
    var line
   
    while (true) {
        line = window.prompt(prompt)

        var value = parseInt(line)

        try {

            if(isNaN(value)){
                throw new Error('Numbers only. Try Again')
            }

            if (value < min_value){
                console.log(`The minimum value is ${min_value}. Try again.`)
            } else if( value > max_value){
                console.log(`The maximum value is ${max_value}. Try again.`)
            } else {
                return value
            }

        } catch(error){
            console.log('Numbers only. Try Again')
        }
    }
}

class BattleshipBoard{
    constructor(columns, rows){
        this.guesses_count = 5;
        this.columns = columns;
        this.rows = rows;
        this.shipLocation = null;
        this.grid = Array.from({length: this.rows}, () => Array.from({length: this.columns}, ()=> "O"));
        /*
        could set the grid with a nested for-loop
        issue if you create array with fill method where all values could be point to same place in memory
        ie you change one value - you can them all to that value
        didn't have any issues with above solution that I found from stackoverflow
        I try to avoid using nested for-loops
        although nested forloops are easy to understand performance wise they are not recommended

        const mainArr = [];
        for (let i = 0; i < 8; i++) {
          const row = [];
          for (let i = 0; i < 8; i++) row.push(0);
          mainArr.push(row);
        }
        */
    }

    addShip(){
        var ship_row = Math.floor(Math.random() * this.rows)  //Math.floor(Math.random() * (this.rows - 1))
        var ship_col =  Math.floor(Math.random() * this.columns)
        this.grid[ship_row][ship_col] = "S";
        this.shipLocation = [ship_row, ship_col]
    }

    printBoard(isEnemy){
      const headers = createHeaders(this.grid.length);
      console.log(headers)
      for (let i = 0; i < this.grid.length; i++) {
        let rowStr = i + ' ';
        for (let cell of this.grid[i]) {
          if (!isEnemy && cell === 'S') {
            rowStr += 'O ';
          } else {
            rowStr += cell + ' ';
          }
        }
        console.log(rowStr);
      }
    }

    isShip(row, column){
        return this.grid[row][column] === 'S'
    }

    alreadyGuessed(row, column){
        return this.grid[row][column] === 'X'
    }

    placeGuess(row, column){
        if(!this.isShip(row, column)){
            this.grid[row][column] = 'X'
        }
    }
}

function createHeaders(size) {
  let result = '  ';
  for (let i = 0; i < size; i++) {
    result += i + ' ';
  }
  return result;
}

function readGuess(board){
    while (true) {
        guess_row = readUserInput("Guess row: ", min_value=0, max_value=4) //- 1
        guess_col = readUserInput("Guess column: ", min_value=0, max_value=4)// - 1

        // if the guess is valid, return the guessed row and column
        if (!board.alreadyGuessed(guess_row, guess_col)){
            return [guess_row, guess_col]
        }
        console.log("You've already guessed on that row! Try again.")
    }
}

function turn(board){
    board.printBoard(false)
    let [guess_row, guess_col] = readGuess(board)
    board.placeGuess(guess_row, guess_col)
    return board.isShip(guess_row, guess_col)
}

function playGame(player_count, board) {
    let total_guesses = 0
    let won_game = false

    while (total_guesses < board.guesses_count * player_count){
        current_player = (total_guesses % player_count) + 1
        // for collective guesses total
        // let remaining_guesses = (board.guesses_count * player_count ) - total_guesses
        let remaining_guesses = Math.ceil(board.guesses_count - total_guesses / player_count)

        console.log(`Player ${current_player}'s turn: ${remaining_guesses} guesses left.`)

        if (turn(board)) {
              console.log(`Congratulations! Player ${current_player} sank the ship!`)
              won_game = true
              return;
        } else {
          console.log("Sorry, you missed!")
          total_guesses += 1
          board.printBoard(false)
        }
    }
    // print the board one last time, showing the ship
    if (!won_game){
        console.log(`Game over, you didn't find the ship located at [${board.shipLocation}] in time.`)
    } 
    board.printBoard(true)
}

function main() {
    console.clear()
    let player_count = readUserInput("How many players are going to play: ", min_value=1, max_value=2)
    let board = new BattleshipBoard(5,5)
    board.addShip()
    playGame(player_count, board)
}

document.getElementById('play').addEventListener('click', ()=> main())