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

  // Helper to get initials for avatar circle
  function getInitials(name: string) {
    return name
      .split(' ')
      .map((part) => part[0].toUpperCase())
      .slice(0, 2)
      .join('');
  }

  app.innerHTML = `
    <div class="h-screen w-screen p-8 bg-gradient-to-br from-purple-900 via-black to-blue-900  text-white font-sans flex flex-col md:flex-row gap-10">

      <!-- Left sectionn -->
      
      <section class="flex-1 rounded-xl p-8 shadow-lg">

         <div class="my-10"> <button onclick="location.href='/'" class="px-4 py-2 backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-2xl">HOME </button></div>
      <div>
        <h1 class="text-4xl font-semibold mb-6 border-b border-gray-700 pb-3">Tournament Registration</h1>
        
        <div class="flex gap-4 mb-6">
          <input type="text" id="alias" placeholder="Enter alias" 
            class="flex-grow px-4 py-3 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 border-1" />
          <button id="addBtn" 
            class="px-6 py-3 bg-pink-500 hover:bg-pink-600 rounded-lg font-semibold shadow-md transition">
            Add Player
          </button>
        </div>

        <div class="flex gap-4">
          <button id="startGame" 
            class="flex-1 py-3 bg-purple-500 hover:bg-purple-700 rounded-lg font-bold shadow-md transition">
            Start Tournament
          </button>
          <button id="resetBtn" 
            class="flex-1 py-3  bg-purple-800 hover:bg-purple-900  rounded-lg font-bold shadow-md transition">
            Reset Tournament
          </button>
        </div>
         </div>

      </section>


      <!-- Right Panel: Players & History -->
      <section class="flex-1 bg-black rounded-xl p-8 shadow-lg flex flex-col backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-2xl p-10   ">
        <h2 class="text-3xl font-semibold mb-6 border-b border-gray-700 pb-3">Players (${queue.length})</h2>
        
        <ul class="flex flex-col gap-3 max-h-64 overflow-y-auto mb-8 pr-2">
          ${queue.map((alias) => `
            <li class="flex items-center gap-4 bg-gray-800 rounded-lg px-4 py-2 shadow-md hover:bg-gray-600 transition">
              <div class="w-12 h-12 rounded-full  bg-purple-800 flex items-center justify-center text-white font-bold text-lg select-none">
                ${getInitials(alias)}
              </div>
              <div class="flex flex-col">
                <span class="font-semibold">${alias}</span>
                <span class="text-pink-500 text-sm">Wins: ${getWinCount(alias)}</span>
              </div>
            </li>
          `).join('')}
        </ul>

        <h2 class="text-2xl font-semibold mb-4 border-b border-gray-700 pb-2">Match History</h2>
        <ul class="flex-1 overflow-y-auto text-gray-300 text-sm pr-2 space-y-1">
          ${matchHistory.length > 0 
            ? matchHistory.map((m, i) => `
              <li>
                <strong>Match ${i + 1}:</strong> 
                <span class="text-blue-400">${m.player1}</span> vs 
                <span class="text-pink-400">${m.player2}</span> — 
                Winner: <span class="text-green-400">${m.winner}</span>
              </li>
            `).join('')
            : `<li class="italic">No matches played yet.</li>`
          }
        </ul>
      </section>

    </div>
  `;

  // Event listeners unchanged
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
