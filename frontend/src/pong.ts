type Paddle = { x: number; y: number; width: number; height: number; dy: number };
type Ball = { x: number; y: number; size: number; dx: number; dy: number };

let leftScore = 0;
let rightScore = 0;

export function startGame() {
  const canvas = document.getElementById('pong') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d') || null;
  if (!ctx) return;

  const paddleHeight = 60;
  const paddleWidth = 10;
  const ballSize = 10;

  const left: Paddle = { x: 20, y: 210, width: paddleWidth, height: paddleHeight, dy: 0 };
  const right: Paddle = { x: canvas.width - 30, y: 210, width: paddleWidth, height: paddleHeight, dy: 0 };

  const ball: Ball = { x: canvas.width / 2, y: canvas.height / 2, size: ballSize, dx: 4, dy: 3 };

  const keys: Record<string, boolean> = {};

  function draw() {
    if(ctx){
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw paddles
    ctx.fillStyle = 'white';
    ctx.fillRect(left.x, left.y, left.width, left.height);
    ctx.fillRect(right.x, right.y, right.width, right.height);

    // Draw ball
    ctx.fillRect(ball.x, ball.y, ball.size, ball.size);

    // Draw scores
    ctx.font = '20px Arial';
    ctx.fillText(`${leftScore}`, canvas.width / 4, 30);
    ctx.fillText(`${rightScore}`, (3 * canvas.width) / 4, 30);
    }
  }

  function update() {
    // Move paddles
    left.y += left.dy;
    right.y += right.dy;

    // Clamp paddles
    left.y = Math.max(0, Math.min(canvas.height - left.height, left.y));
    right.y = Math.max(0, Math.min(canvas.height - right.height, right.y));

    // Move ball
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Top/bottom bounce
    if (ball.y <= 0 || ball.y + ball.size >= canvas.height) {
      ball.dy *= -1;
    }

    // Left paddle collision
    if (
      ball.x <= left.x + left.width &&
      ball.y + ball.size >= left.y &&
      ball.y <= left.y + left.height
    ) {
      ball.dx *= -1;
    }

    // Right paddle collision
    if (
      ball.x + ball.size >= right.x &&
      ball.y + ball.size >= right.y &&
      ball.y <= right.y + right.height
    ) {
      ball.dx *= -1;
    }

    // Score
    if (ball.x < 0) {
      rightScore++;
      resetBall();
    }

    if (ball.x > canvas.width) {
      leftScore++;
      resetBall();
    }
  }

  function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx *= -1;
    ball.dy = (Math.random() > 0.5 ? 1 : -1) * 3;
  }

  function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
  }

  // Controls
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

  // Start the loop
  loop();
}
