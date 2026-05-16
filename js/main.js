// 1. 定義多國語言字典
const translations = {
    "zh-TW": {
        "nav_home": "首頁",
        "nav_games": "小遊戲專區",
        "nav_about": "關於我",
        "welcome_title": "歡迎來到我的個人網站",
        "welcome_desc": "這是一個展示我個人專案與網頁小遊戲的地方。",
        "btn_game_lobby": "前往遊戲大廳",
        "lobby_title": "小遊戲大廳",
        "game_snake_title": "貪吃蛇",
        "game_snake_desc": "經典的貪吃蛇遊戲，挑戰最高分！",
        "btn_start_game": "開始遊戲",
        "game_score": "分數：",
        "game_over": "遊戲結束！",
        "btn_restart": "重新開始", 
        "game_score": "分數：",
        "game_over": "遊戲結束！",
        "btn_restart": "重新開始",
        "game_difficulty": "難度：",
        "diff_easy": "簡單",
        "diff_normal": "普通",
        "diff_hard": "困難",
        "game_bridge_title": "造橋英雄",
        "game_bridge_desc": "長按伸長橋樑，幫助小人安全走到對岸！",
        "game_hold_to_build": "長按滑鼠或螢幕建造橋樑",

    },
    "en": {
        "nav_home": "Home",
        "nav_games": "Mini Games",
        "nav_about": "About Me",
        "welcome_title": "Welcome to my Personal Website",
        "welcome_desc": "A place to showcase my personal projects and web games.",
        "btn_game_lobby": "Go to Game Lobby",
        "lobby_title": "Game Lobby",
        "game_snake_title": "Snake Game",
        "game_snake_desc": "Classic Snake game, challenge the high score!",
        "btn_start_game": "Start Game",
        "game_score": "Score: ",
        "game_over": "Game Over!",
        "btn_restart": "Restart", 
        "game_score": "Score: ",
        "game_over": "Game Over!",
        "btn_restart": "Restart",
        "game_difficulty": "Difficulty: ",
        "diff_easy": "Easy",
        "diff_normal": "Normal",
        "diff_hard": "Hard",
        "game_bridge_title": "Bridge Builder",
        "game_bridge_desc": "Hold to stretch the bridge and help the hero cross!",
        "game_hold_to_build": "Hold mouse or screen to build bridge",
        
    }
};

// 2. 建立切換語言的函數
function setLanguage(lang) {
    // 將選擇的語言儲存到瀏覽器，切換頁面時才不會跑掉
    localStorage.setItem("selectedLanguage", lang);

    // 找出所有帶有 data-i18n 屬性的 HTML 元素
    const elements = document.querySelectorAll("[data-i18n]");

    // 替換每個元素的文字
    elements.forEach(element => {
        const key = element.getAttribute("data-i18n");
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
}

// 3. 網頁載入時的初始化設定
document.addEventListener("DOMContentLoaded", () => {
    // 檢查使用者之前是否選過語言，沒有的話預設為中文
    const savedLanguage = localStorage.getItem("selectedLanguage") || "zh-TW";
    
    // 設定網頁初始語言
    setLanguage(savedLanguage);

    // 讓下拉選單顯示目前正確的語言
    const langSelect = document.getElementById("language-select");
    if (langSelect) {
        langSelect.value = savedLanguage;
        
        // 監聽下拉選單的變更事件
        langSelect.addEventListener("change", (e) => {
            setLanguage(e.target.value);
        });
    }
});