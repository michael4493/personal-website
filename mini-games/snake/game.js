const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// 遊戲設定
const gridSize = 20;    // 每一格的大小為 20x20 像素
const tileCount = 20;   // 畫布為 400x400，所以有 20x20 格
let speed = 100;        // 遊戲速度 (毫秒)

// 遊戲狀態變數
let snake = [];
let dx = 0; // 水平移動速度
let dy = 0; // 垂直移動速度
let foodX;
let foodY;
let score = 0;
let gameLoopTimeout;

// 取得 HTML 元素
const scoreElement = document.getElementById("score");
const gameOverScreen = document.getElementById("gameOverScreen");
const restartBtn = document.getElementById("restartBtn");
const difficultySelect = document.getElementById("difficultySelect");

// 初始化遊戲
function initGame() {
    snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
    ];
    dx = 1; 
    dy = 0;
    score = 0;
    
    // 從選單讀取當前設定的難度 (毫秒)
    speed = parseInt(difficultySelect.value);
    
    scoreElement.textContent = score;
    gameOverScreen.classList.add("hidden");
    
    spawnFood();
    clearTimeout(gameLoopTimeout);
    gameLoop();
}

// 主遊戲迴圈
function gameLoop() {
    if (checkGameOver()) {
        gameOverScreen.classList.remove("hidden");
        return; // 停止迴圈
    }

    gameLoopTimeout = setTimeout(() => {
        clearCanvas();
        drawFood();
        moveSnake();
        drawSnake();
        gameLoop();
    }, speed);
}

// 清空畫布並繪製棋盤格背景
function clearCanvas() {
    for (let row = 0; row < tileCount; row++) {
        for (let col = 0; col < tileCount; col++) {
            if ((row + col) % 2 === 0) {
                ctx.fillStyle = "#2c3e50"; 
            } else {
                ctx.fillStyle = "#34495e"; 
            }
            ctx.fillRect(col * gridSize, row * gridSize, gridSize, gridSize);
        }
    }
}

// 繪製貪吃蛇
function drawSnake() {
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? "#2ecc71" : "#27ae60"; 
        ctx.strokeStyle = "#145c32";
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
        ctx.strokeRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
    });
}

// 移動貪吃蛇
function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head); 

    if (head.x === foodX && head.y === foodY) {
        score += 10;
        scoreElement.textContent = score;
        spawnFood(); 
    } else {
        snake.pop(); 
    }
}

// 產生食物
function spawnFood() {
    foodX = Math.floor(Math.random() * tileCount);
    foodY = Math.floor(Math.random() * tileCount);

    snake.forEach(segment => {
        if (segment.x === foodX && segment.y === foodY) {
            spawnFood();
        }
    });
}

// 繪製食物 (精緻版蘋果)
function drawFood() {
    const centerX = foodX * gridSize + gridSize / 2;
    const centerY = foodY * gridSize + gridSize / 2;

    ctx.fillStyle = "#e74c3c";
    ctx.beginPath();
    ctx.arc(centerX, centerY, gridSize / 2 - 2, 0, 2 * Math.PI);
    ctx.fill();

    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    ctx.beginPath();
    ctx.arc(centerX - 3, centerY - 3, 2.5, 0, 2 * Math.PI);
    ctx.fill();

    ctx.fillStyle = "#27ae60";
    ctx.beginPath();
    ctx.arc(centerX + 4, centerY - 6, 3, 0, 2 * Math.PI);
    ctx.fill();
}

// 檢查遊戲是否結束
function checkGameOver() {
    const head = snake[0];

    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        return true;
    }

    for (let i = 4; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }

    return false;
}

// 監聽鍵盤實體方向鍵與 WASD
document.addEventListener("keydown", (event) => {
    if ([32, 37, 38, 39, 40].indexOf(event.keyCode) > -1) {
        event.preventDefault();
    }
    const LEFT_KEY = 37;
    const UP_KEY = 38;
    const RIGHT_KEY = 39;
    const DOWN_KEY = 40;

    const W_KEY = 87;
    const A_KEY = 65;
    const S_KEY = 83;
    const D_KEY = 68;

    const keyPressed = event.keyCode;
    
    const goingUp = dy === -1;
    const goingDown = dy === 1;
    const goingRight = dx === 1;
    const goingLeft = dx === -1;

    if ((keyPressed === LEFT_KEY || keyPressed === A_KEY) && !goingRight) {
        dx = -1;
        dy = 0;
    }
    if ((keyPressed === UP_KEY || keyPressed === W_KEY) && !goingDown) {
        dx = 0;
        dy = -1;
    }
    if ((keyPressed === RIGHT_KEY || keyPressed === D_KEY) && !goingLeft) {
        dx = 1;
        dy = 0;
    }
    if ((keyPressed === DOWN_KEY || keyPressed === S_KEY) && !goingUp) {
        dx = 0;
        dy = 1;
    }
});

// 綁定重新開始按鈕
restartBtn.addEventListener("click", initGame);

// 監難度切換
difficultySelect.addEventListener("change", (event) => {
    speed = parseInt(event.target.value);
    event.target.blur(); 
});

// 【已更新】綁定手機/滑鼠通用虛擬按鈕事件 (使用 pointerdown 解決沒反應問題)
function bindVirtualKeys() {
    const btnUp = document.getElementById("btn-up");
    const btnDown = document.getElementById("btn-down");
    const btnLeft = document.getElementById("btn-left");
    const btnRight = document.getElementById("btn-right");

    // 封裝轉向邏輯，阻止預設行為防止頁面捲動或放大
    btnUp.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        if (dy !== 1) { dx = 0; dy = -1; }
    });
    btnDown.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        if (dy !== -1) { dx = 0; dy = 1; }
    });
    btnLeft.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        if (dx !== 1) { dx = -1; dy = 0; }
    });
    btnRight.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        if (dx !== -1) { dx = 1; dy = 0; }
    });
}

// 網頁載入完成後啟動遊戲與綁定
window.onload = () => {
    initGame();
    bindVirtualKeys();
};