import * as BABYLON from 'babylonjs';

export function startGame(onMatchEnd: (winner: string) => void) {
  const canvas = document.getElementById('pong') as HTMLCanvasElement;
  if (!canvas) return;

  // Set up HTML elements for score display
  const scoreDiv = document.getElementById('scoreDisplay');
  if (!scoreDiv) {
    const div = document.createElement('div');
    div.id = 'scoreDisplay';
    div.style.position = 'absolute';
    div.style.top = '10px';
    div.style.left = '50%';
    div.style.transform = 'translateX(-50%)';
    div.style.color = 'red';
    div.style.fontSize = '24px';
    div.style.fontFamily = 'Arial, sans-serif';
    document.body.appendChild(div);
  }

  const engine = new BABYLON.Engine(canvas, true);
  const scene = new BABYLON.Scene(engine);

  const camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0, 0, -100), scene);
  camera.setTarget(BABYLON.Vector3.Zero());
  camera.attachControl(canvas, true);

  new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

  // ⚙️ GAME SETTINGS
  const WIN_SCORE = 5;
  const BALL_SPEED = .8;
  const PADDLE_SPEED = 2;

  // Field
  const fieldWidth = 100;
  const fieldHeight = 60;
  const paddleSize = { width: 3, height: 14, depth: 2 };
  const ballSize = 4;

  // Materials
  const paddleMat = new BABYLON.StandardMaterial("paddleMat", scene);
  paddleMat.diffuseColor = new BABYLON.Color3(0.8, 0.8, 1);

  const ballMat = new BABYLON.StandardMaterial("ballMat", scene);
  ballMat.diffuseColor = new BABYLON.Color3(1, 0.4, 0.4);

  // Ground (2D flat background)
  const ground = BABYLON.MeshBuilder.CreateGround("ground", {
    width: fieldWidth,
    height: fieldHeight
  }, scene);
  const groundMat = new BABYLON.StandardMaterial("groundMat", scene);
  groundMat.diffuseColor = new BABYLON.Color3(0.05, 0.1, 0.15);
  ground.material = groundMat;

  // Player info
  const queue = localStorage.getItem('aliasQueue') ? JSON.parse(localStorage.getItem('aliasQueue')!) : ['Player 1', 'Player 2'];
  const p1 = queue[0];
  const p2 = queue[1];

  let leftScore = 0;
  let rightScore = 0;
  let gameOver = false;

  // Paddles
  const paddleLeft = BABYLON.MeshBuilder.CreateBox("paddleLeft", {
    width: paddleSize.width,
    height: paddleSize.height,
    depth: paddleSize.depth
  }, scene);
  paddleLeft.position.x = -fieldWidth / 2 + 5;
  paddleLeft.material = paddleMat;

  const paddleRight = paddleLeft.clone("paddleRight");
  paddleRight.position.x = fieldWidth / 2 - 5;

  // Ball
  const ball = BABYLON.MeshBuilder.CreateSphere("ball", { diameter: ballSize }, scene);
  ball.material = ballMat;

  // Game state (same logic as original)
  const left = { x: paddleLeft.position.x, y: 0, dy: 0, mesh: paddleLeft };
  const right = { x: paddleRight.position.x, y: 0, dy: 0, mesh: paddleRight };
  const ballObj = {
    x: 0,
    y: 0,
    size: ballSize,
    dx: BALL_SPEED,
    dy: BALL_SPEED * (Math.random() > 0.5 ? 1 : -1)
  };

  const keys: Record<string, boolean> = {};

  function updateScoreText() {
    const display = document.getElementById('scoreDisplay');
    if (display) {
      display.textContent = `${p1} ${leftScore} : ${rightScore} ${p2}`;
    }
  }

  function resetBall() {
    ballObj.x = 0;
    ballObj.y = 0;
    ballObj.dx = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
    ballObj.dy = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
  }

  function update() {
    if (gameOver) return;

    // Paddle movement
    left.y += left.dy;
    right.y += right.dy;

    const maxY = fieldHeight / 2 - paddleSize.height / 2;
    left.y = Math.max(-maxY, Math.min(maxY, left.y));
    right.y = Math.max(-maxY, Math.min(maxY, right.y));

    // Sync paddle positions
    left.mesh.position.y = left.y;
    right.mesh.position.y = right.y;

    // Ball movement
    ballObj.x += ballObj.dx;
    ballObj.y += ballObj.dy;
    ball.position.x = ballObj.x;
    ball.position.y = ballObj.y;

    // Top/Bottom wall bounce
    if (ballObj.y <= -fieldHeight / 2 || ballObj.y >= fieldHeight / 2) {
      ballObj.dy *= -1;
    }

    // Paddle collisions
    if (
      ballObj.x - ballObj.size / 2 <= left.x + paddleSize.width / 2 &&
      ballObj.y + ballObj.size / 2 >= left.y - paddleSize.height / 2 &&
      ballObj.y - ballObj.size / 2 <= left.y + paddleSize.height / 2
    ) {
      ballObj.dx *= -1;
    }

    if (
      ballObj.x + ballObj.size / 2 >= right.x - paddleSize.width / 2 &&
      ballObj.y + ballObj.size / 2 >= right.y - paddleSize.height / 2 &&
      ballObj.y - ballObj.size / 2 <= right.y + paddleSize.height / 2
    ) {
      ballObj.dx *= -1;
    }

    // Scoring
    if (ballObj.x < -fieldWidth / 2) {
      rightScore++;
      updateScoreText();
      checkWinner();
      resetBall();
    }

    if (ballObj.x > fieldWidth / 2) {
      leftScore++;
      updateScoreText();
      checkWinner();
      resetBall();
    }
  }

  function checkWinner() {
    if (leftScore >= WIN_SCORE) {
      gameOver = true;
      onMatchEnd(p1);
    } else if (rightScore >= WIN_SCORE) {
      gameOver = true;
      onMatchEnd(p2);
    }
  }

  function loop() {
    update();
    scene.render();
    requestAnimationFrame(loop);
  }

  // Keyboard controls
  document.addEventListener("keydown", (e) => {
    keys[e.key] = true;
    if (keys["w"]) left.dy = PADDLE_SPEED;
    if (keys["s"]) left.dy = -PADDLE_SPEED;
    if (keys["ArrowUp"]) right.dy = PADDLE_SPEED;
    if (keys["ArrowDown"]) right.dy = -PADDLE_SPEED;
  });

  document.addEventListener("keyup", (e) => {
    keys[e.key] = false;
    if (!keys["w"] && !keys["s"]) left.dy = 0;
    if (!keys["ArrowUp"] && !keys["ArrowDown"]) right.dy = 0;
  });

  // Start game
  updateScoreText();
  resetBall();
  loop();
  window.addEventListener("resize", () => engine.resize());
}
