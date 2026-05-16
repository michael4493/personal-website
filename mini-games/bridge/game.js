const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const gameOverScreen = document.getElementById("gameOverScreen");
const restartBtn = document.getElementById("restartBtn");

// 遊戲狀態機
// waiting: 等待按壓 | stretching: 橋樑伸長中 | falling: 橋樑倒下中 | walking: 小人移動中 | dead: 死亡掉落
let phase = "waiting"; 
let score = 0;

// 遊戲元件參數
let hero = { x: 0, y: 0, width: 20, height: 20 };
let bridge = { x: 0, y: 0, length: 0, angle: 0 };
let pillars = [];

// 常數設定
const pillarHeight = 150; // 橋墩在畫面下方的高度
const bridgeSpeed = 1.25;    // 橋樑伸長速度
const fallSpeed = 0.05;   // 橋樑倒下速度 (弧度)
const walkSpeed = 1.5;      // 小人行走速度

function initGame() {
    score = 0;
    scoreElement.textContent = score;
    gameOverScreen.classList.add("hidden");
    
    // 初始化兩座橋墩
    pillars = [
        { x: 0, width: 80 }, // 起始橋墩
        generateNextPillar(80)
    ];
    
    resetTurn();
    gameLoop();
}

// 產生下一座隨機位置與寬度的橋墩
function generateNextPillar(currentPillarRightEdge) {
    const minDistance = 50;
    const maxDistance = 200;
    const minWidth = 30;
    const maxWidth = 80;
    
    const distance = Math.random() * (maxDistance - minDistance) + minDistance;
    const width = Math.random() * (maxWidth - minWidth) + minWidth;
    
    return {
        x: currentPillarRightEdge + distance,
        width: width
    };
}

// 重置每一回合的初始位置
function resetTurn() {
    phase = "waiting";
    
    // 小人站在第一座橋墩的右緣
    hero.x = pillars[0].x + pillars[0].width - hero.width - 15;
    hero.y = canvas.height - pillarHeight - hero.height;
    
    // 橋樑的起點在第一座橋墩的右緣
    bridge.x = pillars[0].x + pillars[0].width - 5;
    bridge.y = canvas.height - pillarHeight;
    bridge.length = 0;
    bridge.angle = 0;
}

// 核心遊戲迴圈
function gameLoop() {
    update();
    draw();
    
    if (phase !== "dead" || hero.y < canvas.height) {
        requestAnimationFrame(gameLoop);
    } else {
        gameOverScreen.classList.remove("hidden");
    }
}

// 邏輯更新
function update() {
    if (phase === "stretching") {
        bridge.length += bridgeSpeed;
    } 
    else if (phase === "falling") {
        bridge.angle += fallSpeed;
        if (bridge.angle >= Math.PI / 2) { // 倒下 90 度
            bridge.angle = Math.PI / 2;
            phase = "walking";
        }
    } 
    else if (phase === "walking") {
        hero.x += walkSpeed;
        
        // 小人走到橋的盡頭
        if (hero.x >= bridge.x + bridge.length - hero.width / 2) {
            checkOutcome();
        }
    } 
    else if (phase === "dead") {
        hero.y += 10; // 小人掉下海
    }
}

// 判斷成功或失敗
function checkOutcome() {
    const nextPillar = pillars[1];
    const bridgeTip = bridge.x + bridge.length;
    
    // 判斷橋尖端是否落在下一個橋墩的範圍內
    if (bridgeTip >= nextPillar.x && bridgeTip <= nextPillar.x + nextPillar.width) {
        // 成功！
        score++;
        scoreElement.textContent = score;
        
        // 將下一座橋墩變成現在的橋墩，並產生新的下一座橋墩
        pillars[0] = { x: 0, width: nextPillar.width }; // 視覺上把它移到最左邊
        pillars[1] = generateNextPillar(pillars[0].width);
        
        resetTurn(); // 重新開始下一回合
    } else {
        // 失敗！橋太短或太長
        phase = "dead";
    }
}

// 畫面繪製
function draw() {
    // 1. 畫背景：天空漸層
    const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    skyGradient.addColorStop(0, "#4facfe"); // 頂部深藍天
    skyGradient.addColorStop(1, "#00f2fe"); // 底部淺藍天
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. 畫太陽
    ctx.fillStyle = "#FFD700"; // 金黃色
    ctx.beginPath();
    ctx.arc(320, 80, 25, 0, Math.PI * 2);
    ctx.fill();

    // 3. 畫遠處的裝飾山脈
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)"; // 半透明白色的遠山
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - pillarHeight);
    ctx.lineTo(80, canvas.height - pillarHeight - 120);
    ctx.lineTo(200, canvas.height - pillarHeight - 40);
    ctx.lineTo(320, canvas.height - pillarHeight - 150);
    ctx.lineTo(400, canvas.height - pillarHeight - 80);
    ctx.lineTo(400, canvas.height - pillarHeight);
    ctx.fill();

    // 4. 畫海面 (橋墩下方稍微降低一點的區域)
    ctx.fillStyle = "rgba(41, 128, 185, 0.8)"; // 海水藍
    ctx.fillRect(0, canvas.height - pillarHeight + 20, canvas.width, pillarHeight - 20);

    // 5. 畫橋墩 (深灰色)
    ctx.fillStyle = "#2c3e50";
    pillars.forEach(pillar => {
        ctx.fillRect(pillar.x, canvas.height - pillarHeight, pillar.width, pillarHeight);
    });
    
    // 6. 畫橋樑 (咖啡色)
    ctx.fillStyle = "#8B4513";
    ctx.save(); 
    ctx.translate(bridge.x, bridge.y); 
    ctx.rotate(bridge.angle); 
    // 【修改這裡】將原本的 0 改成 -5
    // 這樣直立時橋樑會踩在橋墩邊緣上；倒下時厚度會往上長，完美平躺在橋面上！
    ctx.fillRect(-5, -bridge.length, 5, bridge.length); 
    ctx.restore();
    
    // 7. 畫小人 (紅色身體)
    ctx.fillStyle = "#e74c3c";
    ctx.fillRect(hero.x, hero.y, hero.width, hero.height);
    
    // 給小人加上眼睛！(看著右邊)
    ctx.fillStyle = "white";
    ctx.fillRect(hero.x + 12, hero.y + 4, 6, 6); // 眼白
    ctx.fillStyle = "black";
    ctx.fillRect(hero.x + 15, hero.y + 5, 3, 4); // 瞳孔
}

// 事件監聽 (滑鼠點擊與觸控)
function startStretching(e) {
    // 防止觸發按鈕等其他元素
    if(e.target.id === 'restartBtn') return; 
    
    if (phase === "waiting") {
        phase = "stretching";
    }
}

function stopStretching() {
    if (phase === "stretching") {
        phase = "falling";
    }
}

// 支援滑鼠與手機觸控
canvas.addEventListener("mousedown", startStretching);
canvas.addEventListener("mouseup", stopStretching);
canvas.addEventListener("touchstart", (e) => { e.preventDefault(); startStretching(e); }, { passive: false });
canvas.addEventListener("touchend", stopStretching);

// 重新開始按鈕
restartBtn.addEventListener("click", () => {
    initGame();
});

// 啟動遊戲
window.onload = initGame;