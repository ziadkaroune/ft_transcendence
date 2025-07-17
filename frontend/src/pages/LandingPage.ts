
export function renderLandingPage() {
  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = `
<div class="relative h-screen w-screen bg-black overflow-hidden ">
  <!-- Background Glow & Grid -->
  <div class="absolute inset-0 bg-gradient-to-br from-purple-900 via-black to-blue-900 opacity-80 z-0"></div>
  <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] opacity-10 z-0"></div>

  <!-- Futuristic Light Beams -->
  <div class="absolute inset-0 flex items-center justify-center z-0">
    <div class="h-[200%] w-[2px] bg-cyan-400 blur-2xl animate-pulse"></div>
  </div>

  <!-- 3D Glass Panel -->
  <div class="relative z-10 flex h-full flex-col justify-center items-center  px-6 text-center">
    <div class="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-2xl p-10 max-w-xl w-full">
      <h1 class="text-5xl font-bold text-cyan-400 drop-shadow-xl tracking-wide mb-6 neon-text">
        PONG TOURNAMENT
      </h1>
      <p class="text-lg text-gray-300 mb-8">
        Battle your opponent in this retro-futuristic 2-player arena.
      </p>
      <div class="flex flex-col space-y-4">
        <button id="start" class="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-lg font-semibold rounded-lg hover:from-purple-500 hover:to-cyan-500 shadow-lg transition-all duration-300">
          ▶ Start Game
        </button>
        <button class="px-6 py-3 bg-white/10 border border-white/20 text-gray-200 rounded-lg hover:bg-white/20 transition-all">
          Controls
        </button>

      </div>
    </div>
  </div>
  <div class="flex absolute left-0 bottom-0 justify-center items-center w-full h-[20vh] text-sm text-white">2025 all rights reserved transendence</div>
  <!-- Floating Decorations (Paddles & Ball for 3D effect) -->
  <div class="absolute top-1/3 left-10 h-28 w-4 bg-cyan-500 rounded-lg shadow-lg shadow-cyan-500/50 z-0 animate-pulse"></div>
  <div class="absolute top-2/3 right-10 h-28 w-4 bg-pink-500 rounded-lg shadow-lg shadow-pink-500/50 z-0 animate-pulse"></div>
  <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 bg-white rounded-full shadow-lg animate-bounce z-0"></div>

</div>

  `;

  document.getElementById('start')?.addEventListener('click', () => {
    history.pushState({}, '', '/register');
    window.dispatchEvent(new PopStateEvent('popstate'));
  });
}
