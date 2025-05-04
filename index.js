const prompt = require('prompt-sync')();

// Constants for the game
const WIN = "Congratulations! You win!";                                    /* WIN */
const LOSE = "You lose!";                                                   /* LOSE */
const OUT_BOUND = "You are out of the field.";                              /* OUT OF BOUNDS */
const INTO_HOLE = "You fell into a hole";                                   /* FALLEN INTO HOLE */
const WELCOME = "Welcome to Find Your Hat game";                            /* START OF GAME WELCOME MESSAGE */
const DIRECTION = "Which direction, up(u), down(d), left(l) or right(r)?";  /* KEYBOARD DIRECTIONS */
const QUIT = "Press q or Q to quit the game.";                              /* KEYBOARD TO QUIT THE GAME */
const END_GAME = "Game Ended. Thank you.";                                  /* ENDED THE GAME */
const NOT_RECOGNISED = "Input not recognised.";                             /* INPUT NOT RECOGNISED */

// Constant Game Elements
const HAT = '^';
const HOLE = 'O';
const GRASS = '░';
const PLAYER = '*';

class Field {
    // constructor
    constructor(rows, cols, isHardMode = false) {
        this.rows = rows;                           /* property to set up the number of rows for the field */
        this.cols = cols;                           /* property to set up the number of cols for the field */
        this.field = new Array([]);                 /* property that represents the field for game */
        this.gamePlay = false;                      /* property to setup the game play */
        this.turns = 0;                              /* Track the number of turns */
        this.isHardMode = isHardMode;               /* Flag for hard mode */
    }
    
    // Welcome Message
    static welcomeMessage(msg) {
        console.log(
            "\n**********************************************\n" +
            msg
            + "\n**********************************************\n"
        );
    }
    
    generateField() {
        // Create the empty field with grass
        for (let i = 0; i < this.rows; i++) {
            this.field[i] = new Array();
            for (let j = 0; j < this.cols; j++) {
                this.field[i][j] = GRASS;
            }
        }
    
        // Place the player at a random starting position (not upper-left corner)
        this.placePlayer();
    
        // Place the hat at a random position
        this.placeHat();
    
        // Place holes at random positions
        this.placeHoles();
    }
    
    placePlayer() {
        let playerRow = Math.floor(Math.random() * this.rows);
        let playerCol = Math.floor(Math.random() * this.cols);
    
        // Ensure the player doesn't start at the upper-left corner
        while (playerRow === 0 && playerCol === 0) {
            playerRow = Math.floor(Math.random() * this.rows);
            playerCol = Math.floor(Math.random() * this.cols);
        }
    
        this.field[playerRow][playerCol] = PLAYER;
    }

    placeHat() {
        let hatRow = Math.floor(Math.random() * this.rows);
        let hatCol = Math.floor(Math.random() * this.cols);
    
        // Ensure the hat is not placed where the player starts
        while (this.field[hatRow][hatCol] === PLAYER) {
            hatRow = Math.floor(Math.random() * this.rows);
            hatCol = Math.floor(Math.random() * this.cols);
        }
    
        this.field[hatRow][hatCol] = HAT;
    }

    // Find the position of the hat
    findHatPosition() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (this.field[i][j] === HAT) {
                    return [i, j];
                }
            }
        }
        return null; // Hat not found
    }

    // Get the positions blocked around the hat (adjacent cells)
    getBlockedPositions(hatPosition) {
        const [hatRow, hatCol] = hatPosition;
        const blocked = [
            [hatRow - 1, hatCol], // above
            [hatRow + 1, hatCol], // below
            [hatRow, hatCol - 1], // left
            [hatRow, hatCol + 1], // right
        ];

        // Filter out blocked positions that are out of bounds
        return blocked.filter(([r, c]) => r >= 0 && r < this.rows && c >= 0 && c < this.cols);
    }

    // Randomly place holes (ensuring no overlap with player or hat, and not near the hat)
    placeHoles() {
        const totalHoles = Math.floor((this.rows * this.cols) / 5); // 1 hole for every 5 cells
        let hatPosition = this.findHatPosition();
        let blockedPositions = this.getBlockedPositions(hatPosition);

        for (let i = 0; i < totalHoles; i++) {
            let holeRow = Math.floor(Math.random() * this.rows);
            let holeCol = Math.floor(Math.random() * this.cols);

            // Ensure the hole is not placed on the player, the hat, or near the hat
            while (this.field[holeRow][holeCol] !== GRASS || 
                blockedPositions.some(([r, c]) => r === holeRow && c === holeCol)) {
                holeRow = Math.floor(Math.random() * this.rows);
                holeCol = Math.floor(Math.random() * this.cols);
            }

            this.field[holeRow][holeCol] = HOLE;
        }
    }

    // Add a hole in hard mode after certain turns
    addHoleInHardMode() {
        if (this.turns % 5 === 0) {  // Add a hole every 5 turns (you can change this number)
            let holeRow = Math.floor(Math.random() * this.rows);
            let holeCol = Math.floor(Math.random() * this.cols);

            // Ensure the hole is not placed on the player or hat
            while (this.field[holeRow][holeCol] !== GRASS) {
                holeRow = Math.floor(Math.random() * this.rows);
                holeCol = Math.floor(Math.random() * this.cols);
            }

            this.field[holeRow][holeCol] = HOLE;
        }
    }

    // Print out the game field
    printField() {
        this.field.forEach((element) => {
            console.log(element.join(""));
        });
    }
    
    // Start game
    startGame() {                                                    /* Start the game */
        this.gamePlay = true;
        this.generateField(this.rows, this.cols);                   /* Generate the field first */
        this.printField();                                          /* Print the field once */
        this.updateGame();                                          /* Update the game once */
    }

    // Update game
    updateGame() {                                                   /* Update the game */

        // Obtain user input
        let userInput = "";
        
        // Get the user's direction
        do {
            console.log(DIRECTION.concat(" ", QUIT));               /* Request for the user's input */
            userInput = prompt();                                   /* Get the user's input */
            
            switch (userInput.toLowerCase()) {                      /* Update the position of the player */
                case "u":
                case "d":
                case "l":
                case "r":
                    this.updatePlayer(userInput.toLowerCase());     /* user has pressed "u", "d", "l", "R" */
                    break;
                case 'q':
                    this.endGame();                                 /* user has quit the game */
                    break;
                default:
                    console.log(NOT_RECOGNISED);                    /* input not recognised */
                    break;
            }

            // Hard Mode: Add a hole every 5 turns
            if (this.isHardMode) {
                this.addHoleInHardMode();
            }

            this.printField();                                      /* Print field */
        } while (userInput.toLowerCase() !== "q");                  /* Continue to loop if the player hasn't quit */
    }

    // End game
    endGame() {
        console.log(END_GAME);                                      /* Inform the user the game has ended */
        this.gamePlay = false;                                      /* set gamePlay to false */
        process.exit();                                             /* Quit the program */
    }

    // Update the player's movement and game condition
    updatePlayer(direction) {
        // Find the player's current position
        let playerPos = this.findPlayer();
        
        if (!playerPos) {
            console.log("Error: Player not found.");
            return;
        }
    
        let [row, col] = playerPos;
    
        // Remove the player from the current position
        this.field[row][col] = GRASS;
    
        // Move based on direction
        switch (direction) {
            case "u": row -= 1; break; // move up
            case "d": row += 1; break; // move down
            case "l": col -= 1; break; // move left
            case "r": col += 1; break; // move right
            default: console.log(NOT_RECOGNISED); return;
        }
    
        // Check if the player is out of bounds
        if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) {
            console.log(OUT_BOUND);
            this.endGame();
            return;
        }
    
        // Check if the player landed in a hole
        if (this.field[row][col] === HOLE) {
            console.log(INTO_HOLE);
            this.endGame();
            return;
        }
    
        // Check if the player found the hat
        if (this.field[row][col] === HAT) {
            console.log(WIN);
            this.endGame();
            return;
        }
    
        // Place the player at the new position
        this.field[row][col] = PLAYER;
        this.turns++; // Increment the turn counter
        this.printField(); // Update the field display
    }
    
    // Find the current position of the player
    findPlayer() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (this.field[i][j] === PLAYER) {
                    return [i, j];
                }
            }
        }
        return null; // No player found
    }
}

Field.welcomeMessage(WELCOME);

// Ask if the user wants to play in hard mode
let playHardMode = prompt("Do you want to play in hard mode? (y/n): ").toLowerCase() === 'y';

const ROWS = 10;
const COLS = 10;
const field = new Field(ROWS, COLS, playHardMode);  // Pass hard mode selection
field.startGame();  // Start the game
