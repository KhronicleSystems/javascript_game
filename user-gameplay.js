const prompt = require("prompt-sync")({sigint:true});

let input = null;

function endGame(){
    process.exit()


}

while(input !== "q"){
    console.log("(w)up, (s)down, (a)left, (d)right, (q)uit.");
    input = prompt("which way would you want to move?");

    switch(input.toLowerCase()){
        case "w":
            console.log("\n you moved up\n");
            break;
        case "s":
            console.log("\n you moved down\n");
            break;
        case "a":
            console.log("\n you moved left\n");
            break;
        case "d":
            console.log("\n you moved right\n");
            break;
        case "q":
            console.log("thank you for playing");
            endGame();
            break;
        default:
            console.log("\n unrecognized input ! \n")
            break;
    }
}