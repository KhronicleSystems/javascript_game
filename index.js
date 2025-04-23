const prompt = require("prompt-sync");

// game elements
const GRASS = "░";
const HOLE = "O";
const HAT = "^";
const PLAYER = "*";

const rows = 20;
const cols = 20;

const field = []; //create array for the game field

// populate the game field as a 2D-array - using Math.random() via nested loops

for(let i=0; i<rows; i++){
    field[i] = []; //create new array in field
    for(let j=0; j<cols; j++){ //populate columns in each field's row
        field [i][j] = Math.random() > 0.2 ? GRASS : HOLE;
    }
}

field[0][0] = PLAYER; //populate player
for (let row of field){
    console.log(row.join(""));
}
