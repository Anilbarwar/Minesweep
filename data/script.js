let container = [];
let flag = false;
let mines = 20;
let minesLocation = new Map();
let flagBox = new Map();
let youLoose = false;
let darkMode = document.getElementById("checkbox");
let mode = 1;
let variables = document.querySelector(':root');
let finished = false;
let win = false;
let foundNumbers = 0;

function changeBackground() {
    mode = (mode+1) % 2;
    if(mode == 1) {
        variables.style.setProperty('--bgImg', 'url("bg-lite1.jpeg") no-repeat center center/cover');
        variables.style.setProperty('--txtColor', 'rgb(180, 194, 208)');
    }
    else {
        variables.style.setProperty('--bgImg', 'url("bg.jpg") no-repeat center center/cover');
        variables.style.setProperty('--txtColor', 'rgb(62, 70, 78)');
    }
}

window.onload = function() {
    setup();
}

function setup() {
    for (let i = 0; i < 10; i++) {
        let rows = [];
        for (let j = 0; j < 10; j++) {
            let box = document.createElement("div");
            box.id = i.toString() + "-" + j.toString();
            box.className = "tiles";
            let container = document.getElementById("container");
            let px = getComputedStyle(container).height;
            box.style.display = "inline-block";
            box.style.margin = "auto";
            box.style.height =  "5.5vmin";
            box.style.width = "5.5vmin";
            box.style.borderRadius = "10px";
            box.style.border = "1px solid rgba(255, 255, 255, 0.25)";
            box.style.boxShadow = "0 8px 32px 0 rgba(0, 0, 0, 0.37)";
            box.addEventListener("click", checkValue);
            container.append(box);
            rows.push(box);
        }
        container.push(rows);
    }

    for (let i = 0;i < mines; i++) {
        let x = Math.floor(Math.random() * 10);
        let y = Math.floor(Math.random() * 10);
        minesLocation.set(x.toString()+"-"+y.toString(), 1);
    }
}

function gameOver() {
    finished = true;
    let fullBox = document.getElementById("container");

    let message = document.createElement("div");
    if (win) {
        message.textContent = "You Win!!";
        message.style.color = "green";
    } else {
        message.textContent = "You Lose";
        message.style.color = "red";
    }
    message.style.position = "absolute";
    message.style.top = "40%";
    message.style.left = "50%";
    message.style.transform = "translate(-50%, -50%)";
    message.style.fontSize = "5vmin";
    message.style.fontWeight = "bold";
    message.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    message.style.padding = "20px";
    message.style.borderRadius = "10px";
    message.style.textAlign = "center";
    message.style.zIndex = "1000";

    let retryButton = document.createElement("button");
    retryButton.textContent = "Retry";
    retryButton.style.padding = "8px 16px";
    retryButton.style.fontSize = "2.5vmin";
    retryButton.style.marginTop = "10px";
    retryButton.style.cursor = "pointer";
    retryButton.style.border = "none";
    retryButton.style.borderRadius = "20px";
    retryButton.style.backgroundColor = "lightgray";
    retryButton.style.zIndex = "1000";

    retryButton.onclick = function() {
        location.reload();
    };

    message.appendChild(retryButton);
    fullBox.appendChild(message);
}


function checkValue() {
    if (foundNumbers == 100 - minesLocation.size) {
        win = true;
        gameOver();
    }
    let box = event.target;
    if (box.textContent != '' || finished == true) {
        return;
    }
    if (flag) {
        if (flagBox.has(box.id)) {
            box.style.background = '';
            flagBox.delete(box.id);
        } else {
            box.style.background = 'url("./data/danger.png") no-repeat center center';
            box.style.backgroundSize = '4.2vmin';
            flagBox.set(box.id, 1);
        }
    } else {
        if (minesLocation.has(box.id)) {
            if (mode == 1) {
                box.style.background = 'url("./data/blue-mine.png") no-repeat center center';
            } else {
                box.style.background = 'url("./data/black-mine.png") no-repeat center center';
            }
            
            box.style.backgroundSize = '4.2vmin';
            gameOver();
        } else {
            let count = countMines(box);
            box.style.background = '';
            box.textContent = count;
            
            if (mode == 1) {
                box.style.color = "black";
            } else {
                box.style.color = "white";
            }
            
            box.style.fontSize = "3vmin";
            box.style.textAlign = "center";
            box.style.lineHeight = "5.5vmin";
            foundNumbers++;
        }
    }
}

function countMines(box) {
    let [x, y] = box.id.split('-').map(num => parseInt(num));
    let mineCount = 0;

    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) {
                continue;
            }
            let neighborX = x + i;
            let neighborY = y + j;
            let neighborId = neighborX + "-" + neighborY;

            if (neighborX >= 0 && neighborX < 10 
                && neighborY >= 0 && neighborY < 10) {
                if (minesLocation.has(neighborId)) {
                    mineCount++;
                }
            }
        }
    }

    return mineCount;
}

function toggleFlag() {
    let skull = document.getElementById("flag");
    if (flag) {
        flag = false;
        skull.style.background="linear-gradient(135deg,rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0))";
    } else {
        flag = true;
        skull.style.background="linear-gradient(135deg,rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0))";
    }
    console.log("flag value is "+ flag);
}

