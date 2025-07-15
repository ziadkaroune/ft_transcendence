type AliasList = string[];

function getAliasQueue(): AliasList {
  const queue = localStorage.getItem('aliasQueue');
  return queue ? JSON.parse(queue) : [];
}

function saveAliasQueue(queue: AliasList) {
  localStorage.setItem('aliasQueue', JSON.stringify(queue));
}

export function initRouter() {
  const app = document.getElementById('app');
  if (!app) return;

  const path = window.location.pathname;
  render(path);

  window.onpopstate = () => render(window.location.pathname);
}

function render(path: string) {
  const app = document.getElementById('app');
  if (!app) return;

  if (path === '/game') {
    const queue = getAliasQueue();
    if (queue.length < 2) {
      app.innerHTML = `
        <p class="text-red-500">You need at least 2 players to start the game.</p>
        <button onclick="location.href='/'" class="mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600">Back</button>
      `;
      return;
    }

    const [player1, player2] = queue;

    app.innerHTML = `
      <h2 class="text-xl mb-2">Now Playing: ${player1} vs ${player2}</h2>
      <canvas id="pong" width="640" height="480" class="border border-white"></canvas>
      <div class="mt-4 space-x-2">
        <button id="nextMatch" class="px-4 py-2 bg-green-600 hover:bg-green-700">Next Match</button>
        <button onclick="location.href='/'" class="px-4 py-2 bg-gray-700 hover:bg-gray-600">Back</button>
      </div>
    `;

    import('./pong').then(({ startGame }) => startGame());

    document.getElementById('nextMatch')?.addEventListener('click', () => {
      const queue = getAliasQueue();
      const rotated = [...queue.slice(2), queue[0], queue[1]];
      saveAliasQueue(rotated);
      render('/game');
    });
  } else {
    const queue = getAliasQueue();

    app.innerHTML = `
      <h1 class="text-3xl font-bold mb-4">Tournament Registration</h1>
      <div class="space-y-2 mb-4">
        <input type="text" id="alias" placeholder="Enter alias" class="p-2 text-black rounded" />
        <button id="addBtn" class="ml-2 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded">Add Player</button>
      </div>
      <h2 class="text-xl mb-2">Players:</h2>
      <ul id="playerList" class="list-disc ml-6 mb-4 text-lg text-yellow-300">
        ${queue.map((a) => `<li>${a}</li>`).join('')}
      </ul>
      <button id="startGame" class="p-2 bg-green-600 hover:bg-green-700 text-white rounded">Start Tournament</button>
    `;

    document.getElementById('addBtn')?.addEventListener('click', () => {
      const input = document.getElementById('alias') as HTMLInputElement;
      const alias = input.value.trim();
      if (alias) {
        const updatedQueue = [...queue, alias];
        saveAliasQueue(updatedQueue);
        render('/');
      }
    });

    document.getElementById('startGame')?.addEventListener('click', () => {
      if (queue.length < 2) {
        alert('Need at least 2 players.');
        return;
      }
      history.pushState({}, '', '/game');
      render('/game');
    });
  }
}
