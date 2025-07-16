export function startGame(onMatchEnd: (winner: string) => void) {
  const canvas = document.getElementById('pong') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let leftScore = 0;
  let rightScore = 0;
  let gameOver = false;

  const WIN_SCORE = 5;

  const left = { x: 20, y: 210, width: 10, height: 60, dy: 0 };
  const right = { x: canvas.width - 30, y: 210, width: 10, height: 60, dy: 0 };
  const ball = { x: canvas.width / 2, y: canvas.height / 2, size: 10, dx: 4, dy: 3 };
  const keys: Record<string, boolean> = {};

  const queue = localStorage.getItem('aliasQueue') ? JSON.parse(localStorage.getItem('aliasQueue')!) : ['P1', 'P2'];
  const p1 = queue[0];
  const p2 = queue[1];

  function draw() {
    if(ctx){
        ctx.fillStyle = '#111';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = 'white';
        ctx.fillRect(left.x, left.y, left.width, left.height);
        ctx.fillRect(right.x, right.y, right.width, right.height);
        ctx.fillRect(ball.x, ball.y, ball.size, ball.size);

        ctx.font = '20px Arial';
        ctx.fillText(`${leftScore}`, canvas.width / 4, 30);
        ctx.fillText(`${rightScore}`, (3 * canvas.width) / 4, 30);
        ctx.fillText(`${p1}`, 20, 20);
        ctx.fillText(`${p2}`, canvas.width - 100, 20);

        if (gameOver) {
          ctx.font = '28px Arial';
          ctx.fillText('🏁 Game Over!', canvas.width / 2 - 100, canvas.height / 2 - 20);
        }
  }
  }

  function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx *= -1;
    ball.dy = (Math.random() > 0.5 ? 1 : -1) * 3;
  }

  function update() {
    if (gameOver) return;

    left.y += left.dy;
    right.y += right.dy;

    left.y = Math.max(0, Math.min(canvas.height - left.height, left.y));
    right.y = Math.max(0, Math.min(canvas.height - right.height, right.y));

    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.y <= 0 || ball.y + ball.size >= canvas.height) {
      ball.dy *= -1;
    }

    if (
      ball.x <= left.x + left.width &&
      ball.y + ball.size >= left.y &&
      ball.y <= left.y + left.height
    ) {
      ball.dx *= -1;
    }

    if (
      ball.x + ball.size >= right.x &&
      ball.y + ball.size >= right.y &&
      ball.y <= right.y + right.height
    ) {
      ball.dx *= -1;
    }

    if (ball.x < 0) {
      rightScore++;
      checkWinner();
      resetBall();
    }

    if (ball.x > canvas.width) {
      leftScore++;
      checkWinner();
      resetBall();
    }
  }

  function checkWinner() {
    if (leftScore >= WIN_SCORE) {
      endGame(p1);
    } else if (rightScore >= WIN_SCORE) {
      endGame(p2);
    }
  }

  function endGame(winner: string) {
    gameOver = true;
    onMatchEnd(winner);
  }

  function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
  }

  document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    if (keys['w']) left.dy = -5;
    if (keys['s']) left.dy = 5;
    if (keys['ArrowUp']) right.dy = -5;
    if (keys['ArrowDown']) right.dy = 5;
  });

  document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
    if (!keys['w'] && !keys['s']) left.dy = 0;
    if (!keys['ArrowUp'] && !keys['ArrowDown']) right.dy = 0;
  });

  loop();
}
