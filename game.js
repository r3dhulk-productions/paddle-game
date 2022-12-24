var canvas;
var canvasContext;

var ballX = 395;
var ballSpeedX = 6;
var ballY = 295;
var ballSpeedY = 3;

var paddleX = 350;
const paddleHeight = 10;
const paddleWidth = 100;
const paddleDist = 60;

var mouseX;
var mouseY;


const brickheight = 20;
const brickwidth = 50;
const bricknumH = 16;
const bricknumV = 12;
const brickGap = 2;
var bricksLeft = 0;
var brickGrid = new Array(bricknumH*bricknumV);



function calculateMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    mouseX = evt.clientX - rect.left - root.scrollLeft;
    mouseY = evt.clientY - rect.top - root.scrollTop;
    return{
        x:mouseX,
        y:mouseY
    };
}



window.onload = function(){
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');
    var FPS = 60;
    setInterval(function () {
            moveEverything();
            drawEverything();
        }
        , 1000/FPS);
    canvas.addEventListener('mousemove',
        function(evt){
            var mousePos = calculateMousePos(evt);
            paddleX = mousePos.x - paddleWidth/2;
        }
    );
    brickReset();
};

function drawEverything(){
    colorRect(0,0,canvas.width,canvas.height, 'black');
    colorBall(ballX,ballY,5,'green');
    colorRect(paddleX, canvas.height-paddleDist, paddleWidth, paddleHeight, 'white');
    drawBricks();
    var brickCol = Math.floor(mouseX /brickwidth);
    var brickRow = Math.floor(mouseY / brickheight);
    colorWords(brickCol+","+brickRow, mouseX, mouseY, 'yellow');
}

function ballMove(){

    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if(ballX > canvas.width && ballSpeedX > 0.0){
        ballSpeedX = -ballSpeedX;
    }
    if(ballX < 0 && ballSpeedX < 0.0){
        ballSpeedX = -ballSpeedX;
    }
    if(ballY > canvas.height){
        resetBall();
        brickReset();
    }
    if(ballY < 0){
        ballSpeedY = -ballSpeedY;
    }

}

function ballBrickHandling(){
    var ballbrickCol = Math.floor(ballX / brickwidth);
    var ballbrickRow = Math.floor(ballY / brickheight);
    var brickIndexUnderBall = rowColToArrayIndex(ballbrickCol, ballbrickRow);

    if(ballbrickCol >= 0 && ballbrickCol < bricknumH && ballbrickRow >= 0 && ballbrickRow < bricknumV){
        if( brickGrid[brickIndexUnderBall]){
            brickGrid[brickIndexUnderBall] = false;
            bricksLeft--;
            console.log(bricksLeft);
            var prevBallX = ballX - ballSpeedX;
            var prevBallY = ballY - ballSpeedY;
            var prevBallbrickCol = Math.floor(prevBallX / brickwidth);
            var prevBallbrickRow = Math.floor(prevBallY / brickheight);
            var bothTestFailed = true;

            if(prevBallbrickCol != ballbrickCol){
                var adjBrickSide = rowColToArrayIndex(prevBallbrickCol, ballbrickRow);
                if(!brickGrid[adjBrickSide]){
                    ballSpeedX *= -1;
                    bothTestFailed = false;
                }

            }
            if(prevBallbrickRow != ballbrickRow){
                var adjBrickTopBot = rowColToArrayIndex(ballbrickCol, prevBallbrickRow);
                if(!brickGrid[adjBrickTopBot]) {
                    ballSpeedY *= -1;
                    bothTestFailed = false;
                }
            }
            if(bothTestFailed){
                ballSpeedX *= -1;
                ballSpeedY *= -1;
            }

        }

    }
}

function ballPadleHandling(){
    var paddleTop = canvas.height - paddleDist;
    var paddleBottom = paddleTop + paddleHeight;
    var paddleLeft = paddleX;
    var paddleRight = paddleLeft + paddleWidth;

    if(ballY > paddleTop && ballY < paddleBottom && ballX > paddleLeft && ballX < paddleRight){
        ballSpeedY = -ballSpeedY;
        var deltaX = ballX - (paddleX + paddleWidth/2);
        ballSpeedX = deltaX * 0.2;

        if(bricksLeft == 0){
            brickReset();
        }
    }

}

function moveEverything() {
    ballMove();
    ballBrickHandling();
    ballPadleHandling();

}

function colorRect(leftX, topY, width, height, drawColor) {
    canvasContext.fillStyle = drawColor;
    canvasContext.fillRect(leftX, topY, width, height);
}

function colorBall(centerX, centerY, radius, drawColor){
    canvasContext.fillStyle = drawColor;
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2,true);
    canvasContext.fill();
}

function colorWords(words, x, y, color){
    canvasContext.fillStyle = color;
    canvasContext.fillText(words, x, y);
}


function drawBricks(){
    for(var i = 0; i < bricknumH; i++) {
        for(var j = 0; j < bricknumV; j++) {
            var brickIndex = i+j*bricknumH;
            if(brickGrid[brickIndex]) {
                colorRect(brickwidth * i, brickheight*j, brickwidth - brickGap, brickheight - brickGap, 'blue');
            }
        }
    }
}

function resetBall(){

    ballSpeedX = -ballSpeedX;
    ballX = canvas.width/2;
    ballY = canvas.height/2;
}
function brickReset(){
    bricksLeft = 0;
    for(var i = 0; i < bricknumH * bricknumV; i++) {
        if(i < 3*bricknumH){
            brickGrid[i] = false;
        }else{
            brickGrid[i]=true;
            bricksLeft++;
        }

    }

}
function rowColToArrayIndex(Col, Row){
    var index = bricknumH*Row + Col;
    return index;
}