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
            // 利用行列相加的奇偶數來交替顏色
            if ((row + col) % 2 === 0) {
                ctx.fillStyle = "#2c3e50"; // 原本的深藍灰色
            } else {
                ctx.fillStyle = "#34495e"; // 稍微亮一點的藍灰色
            }
            // 繪製每一個小方格
            ctx.fillRect(col * gridSize, row * gridSize, gridSize, gridSize);
        }
    }
}

// 繪製貪吃蛇
function drawSnake() {
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? "#2ecc71" : "#27ae60"; // 頭部顏色較亮
        ctx.strokeStyle = "#145c32";
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
        ctx.strokeRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
    });
}

// 移動貪吃蛇
function moveSnake() {
    // 根據方向計算新頭部的位置
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head); // 將新頭部加入陣列最前方

    // 檢查是否吃到食物
    if (head.x === foodX && head.y === foodY) {
        score += 10;
        scoreElement.textContent = score;
        spawnFood(); // 重新產生食物
        // 吃到食物就不移除尾巴，蛇就會變長
    } else {
        snake.pop(); // 沒吃到食物，移除最後一節尾巴
    }
}

// 產生食物
function spawnFood() {
    foodX = Math.floor(Math.random() * tileCount);
    foodY = Math.floor(Math.random() * tileCount);

    // 確保食物不會生在蛇的身上
    snake.forEach(segment => {
        if (segment.x === foodX && segment.y === foodY) {
            spawnFood();
        }
    });
}

// 繪製食物
// 繪製食物 (精緻版蘋果)
function drawFood() {
    const centerX = foodX * gridSize + gridSize / 2;
    const centerY = foodY * gridSize + gridSize / 2;

    // 1. 畫蘋果主體 (紅色)
    ctx.fillStyle = "#e74c3c";
    ctx.beginPath();
    ctx.arc(centerX, centerY, gridSize / 2 - 2, 0, 2 * Math.PI);
    ctx.fill();

    // 2. 畫蘋果的左上角高光 (半透明白色，增加立體感)
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    ctx.beginPath();
    ctx.arc(centerX - 3, centerY - 3, 2.5, 0, 2 * Math.PI);
    ctx.fill();

    // 3. 畫蘋果右上方的小葉子 (綠色)
    ctx.fillStyle = "#27ae60";
    ctx.beginPath();
    ctx.arc(centerX + 4, centerY - 6, 3, 0, 2 * Math.PI);
    ctx.fill();
}

// 檢查遊戲是否結束
function checkGameOver() {
    const head = snake[0];

    // 1. 撞到牆壁
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        return true;
    }

    // 2. 撞到自己 (從第 4 節開始檢查，因為前 3 節不可能撞到)
    for (let i = 4; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }

    return false;
}

// 監聽鍵盤方向鍵
document.addEventListener("keydown", (event) => {
    // 阻擋空白鍵和方向鍵的網頁預設捲動行為
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
    
    // 避免蛇直接 180 度反轉自殺
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

// 網頁載入完成後啟動遊戲
window.onload = () => {
    initGame();
};

// 監聽難度切換
difficultySelect.addEventListener("change", (event) => {
    speed = parseInt(event.target.value);
    // 取消選單焦點，防止玩家按下方向鍵時變成在切換下拉選單
    event.target.blur(); 
});