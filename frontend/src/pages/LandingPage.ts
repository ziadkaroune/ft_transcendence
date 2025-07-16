
export function renderLandingPage() {
  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = `
    <div class="text-center space-y-6 h-screen bg-red-400 text-3xl">
      <h1 class="text-4xl font-bold"> Welcome to Pong Tournament</h1>
      <p class="text-xl">Get ready for local 2-player madness!</p>
      <button id="start" class="p-4 bg-blue-600 hover:bg-blue-700 rounded text-white text-xl">Start Tournament</button>
    </div>
  `;

  document.getElementById('start')?.addEventListener('click', () => {
    history.pushState({}, '', '/register');
    window.dispatchEvent(new PopStateEvent('popstate'));
  });
}
