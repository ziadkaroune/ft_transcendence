type AliasList = string[];
type Match = { player1: string; player2: string; winner: string };

function getAliasQueue(): AliasList {
  const queue = localStorage.getItem('aliasQueue');
  return queue ? JSON.parse(queue) : [];
}

function saveAliasQueue(queue: AliasList) {
  localStorage.setItem('aliasQueue', JSON.stringify(queue));
}

function getMatchHistory(): Match[] {
  const data = localStorage.getItem('matchHistory');
  return data ? JSON.parse(data) : [];
}

function resetTournament() {
  localStorage.removeItem('aliasQueue');
  localStorage.removeItem('matchHistory');
}

function getWinCount(alias: string): number {
  return getMatchHistory().filter((m) => m.winner === alias).length;
}

export function renderRegistrationPage() {
  const app = document.getElementById('app');
  if (!app) return;

  const queue = getAliasQueue();
  const matchHistory = getMatchHistory();

  app.innerHTML = `
    <h1 class="text-3xl font-bold mb-4">Tournament Registration</h1>
    <div class="space-y-2 mb-4">
      <input type="text" id="alias" placeholder="Enter alias" class="p-2 text-black rounded" />
      <button id="addBtn" class="ml-2 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded">Add Player</button>
    </div>

    <h2 class="text-xl mt-4">Players:</h2>
    <ul class="list-disc ml-6 mb-4 text-lg text-yellow-300">
      ${queue.map((a) => `<li>${a} — Wins: ${getWinCount(a)}</li>`).join('')}
    </ul>

    <button id="startGame" class="p-2 bg-green-600 hover:bg-green-700 text-white rounded">Start Tournament</button>
    <button id="resetBtn" class="ml-2 p-2 bg-red-600 hover:bg-red-700 text-white rounded">Reset Tournament</button>

    <h2 class="text-xl mt-6">Match History:</h2>
    <ul class="ml-6 text-sm text-gray-200">
      ${matchHistory.map((m, i) => `<li>Match ${i + 1}: ${m.player1} vs ${m.player2} — Winner: ${m.winner}</li>`).join('')}
    </ul>
  `;

  document.getElementById('addBtn')?.addEventListener('click', () => {
    const input = document.getElementById('alias') as HTMLInputElement;
    const alias = input.value.trim();
    if (alias) {
      const updatedQueue = [...queue, alias];
      saveAliasQueue(updatedQueue);
      renderRegistrationPage();
    }
  });

  document.getElementById('startGame')?.addEventListener('click', () => {
    if (queue.length < 2) {
      alert('Need at least 2 players.');
      return;
    }
    history.pushState({}, '', '/game');
    window.dispatchEvent(new PopStateEvent('popstate'));
  });

  document.getElementById('resetBtn')?.addEventListener('click', () => {
    if (confirm('Reset tournament and clear all data?')) {
      resetTournament();
      renderRegistrationPage();
    }
  });
}
