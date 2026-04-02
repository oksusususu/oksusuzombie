const gameBoard = document.getElementById('game-board');
const player = document.getElementById('player');
const scoreDisplay = document.getElementById('score');
const finalScoreDisplay = document.getElementById('final-score');
const gameOverScreen = document.getElementById('game-over');

let score = 0;
let zombies = [];
let playerPos = { x: 300, y: 200 };
let isGameOver = false;
let startTime = Date.now();

// 1. 마우스 움직임 감지
gameBoard.addEventListener('mousemove', (e) => {
    if (isGameOver) return;
    
    // 게임판 내에서의 마우스 상대 좌표 계산
    const rect = gameBoard.getBoundingClientRect();
    playerPos.x = e.clientX - rect.left;
    playerPos.y = e.clientY - rect.top;

    // 농부 위치 업데이트
    player.style.left = playerPos.x + 'px';
    player.style.top = playerPos.y + 'px';
});

// 2. 좀비(옥수수) 생성 함수
function spawnZombie() {
    const zombie = document.createElement('div');
    zombie.className = 'zombie';
    zombie.innerText = '🌽';
    
    // 랜덤 위치 (캐릭터와 너무 가깝지 않게 생성하는 것이 좋으나, 여기선 단순 랜덤 처리)
    const x = Math.random() * 570;
    const y = Math.random() * 370;
    
    const zombieObj = {
        element: zombie,
        x: x,
        y: y
    };
    
    zombie.style.left = x + 'px';
    zombie.style.top = y + 'px';
    gameBoard.appendChild(zombie);
    zombies.push(zombieObj);
}

// 초기 좀비 생성
spawnZombie();

// 3. 메인 게임 루프 (30ms 마다 실행)
const gameLoop = setInterval(() => {
    if (isGameOver) return;

    // 시간 계산
    const currentTime = Date.now();
    score = Math.floor((currentTime - startTime) / 1000);
    scoreDisplay.innerText = score;

    // 10초마다 좀비 추가 (현재 초 단위가 바뀌는 순간 체크)
    if (score > 0 && score % 10 === 0 && !zombies.addedThisInterval) {
        spawnZombie();
        zombies.addedThisInterval = true; 
        // 10초 단위에서 한 번만 추가되도록 플래그 설정 (다음 초에 해제)
    }
    if (score % 10 !== 0) {
        zombies.addedThisInterval = false;
    }

    // 좀비 이동 및 충돌 체크
    zombies.forEach(zombie => {
        // 방향 계산 (캐릭터 좌표 - 좀비 좌표)
        const dx = playerPos.x - zombie.x;
        const dy = playerPos.y - zombie.y;
        
        // 직선 거리 계산
        const distance = Math.sqrt(dx * dx + dy * dy);

        // 좀비 이동 (2px씩)
        if (distance > 0) {
            zombie.x += (dx / distance) * 2;
            zombie.y += (dy / distance) * 2;
            zombie.element.style.left = zombie.x + 'px';
            zombie.element.style.top = zombie.y + 'px';
        }

        // 충돌 감지 (30px 이내)
        if (distance < 30) {
            endGame();
        }
    });
}, 30);

// 4. 게임 종료 함수
function endGame() {
    isGameOver = true;
    clearInterval(gameLoop);
    finalScoreDisplay.innerText = score;
    gameOverScreen.classList.remove('hidden');
    gameBoard.style.cursor = 'default';
}