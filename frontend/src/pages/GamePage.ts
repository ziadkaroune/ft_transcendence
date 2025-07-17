import { startGame } from '../pong';

type Match = { player1: string; player2: string; winner: string };

function getAliasQueue(): string[] {
  const queue = localStorage.getItem('aliasQueue');
  return queue ? JSON.parse(queue) : [];
}

function saveAliasQueue(queue: string[]) {
  localStorage.setItem('aliasQueue', JSON.stringify(queue));
}

function saveMatch(winner: string, p1: string, p2: string) {
  const history = localStorage.getItem('matchHistory');
  const matches: Match[] = history ? JSON.parse(history) : [];
  matches.push({ player1: p1, player2: p2, winner });
  localStorage.setItem('matchHistory', JSON.stringify(matches));
}

export function renderGamePage() {
  const app = document.getElementById('app');
  if (!app) return;

  const queue = getAliasQueue();
  if (queue.length < 2) {
    app.innerHTML = `
      <p class="text-red-500">You need at least 2 players to start the game.</p>
      <button onclick="location.href='/'" class="mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600">Back</button>
    `;
    return;
  }

  const [p1, p2] = queue;

  app.innerHTML = `
  <div class="relative h-screen w-screen bg-black overflow-hidden bg-gradient-to-br from-purple-900 via-black to-blue-900 ">
  <!-- Background Glow & Grid -->

    <h2 id="scoreDisplay" class="text-xl text-white h-32 flex justify-center items-center"></h2>
    
       <canvas id="pong" width="640" height="480" class="border border-white mx-auto"></canvas>
 
    <div id="scoreDisplay" class=" text-lg mt-2 text-white"></div>
        <div class="mt-4 space-x-2 text-center">
          <button id="nextMatch" class="px-4 py-2  bg-purple-800 hover:bg-purple-900  rounded-lg font-bold shadow-md transition">Next Match</button>
          <button onclick="location.href='/register'" class="px-4 py-2 bg-gray-700 hover:bg-gray-600">Back</button>
        </div>
     </div>
       </div>
  `;

  startGame((winner: string) => {
    saveMatch(winner, p1, p2);
    // Winner text is already handled inside `startGame`
  });

  document.getElementById('nextMatch')?.addEventListener('click', () => {
    const rotated = [...queue.slice(2), queue[0], queue[1]];
    saveAliasQueue(rotated);
    renderGamePage();
  });
}
