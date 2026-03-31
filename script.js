// Données de jeux
const games = [
  { id: 1, title: 'CyberStrike', price: 29.99, genre: 'Action', image: 'https://images.unsplash.com/photo-1612368176505-3ff470c2f115?auto=format&fit=crop&w=800&q=80' },
  { id: 2, title: 'Dragon Saga', price: 45.50, genre: 'RPG', image: 'https://images.unsplash.com/photo-1578632097906-9f0afc2d0542?auto=format&fit=crop&w=800&q=80' },
  { id: 3, title: 'Space Frontier', price: 23.40, genre: 'FPS', image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80' },
  { id: 4, title: 'Rogue Legend', price: 39.00, genre: 'RPG', image: 'https://images.unsplash.com/photo-1585890474226-98aaf66a9a20?auto=format&fit=crop&w=800&q=80' },
  { id: 5, title: 'Neon Chase', price: 18.99, genre: 'Action', image: 'https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=800&q=80' },
  { id: 6, title: 'Battle Siege', price: 51.20, genre: 'FPS', image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80' }
];

// Fonction de rendu des jeux
function renderGames(gameList) {
  const gamesGrid = document.getElementById('gamesGrid');
  gamesGrid.innerHTML = '';

  if (gameList.length === 0) {
    gamesGrid.innerHTML = '<p class="text-slate-300">Aucun jeu trouvé.</p>';
    return;
  }

  gameList.forEach((game) => {
    const card = document.createElement('article');
    card.className = 'card rounded-xl overflow-hidden border border-slate-700 bg-slate-800 shadow-md';

    card.innerHTML = `
      <img src="${game.image}" alt="${game.title}" class="w-full h-44" />
      <div class="p-4">
        <h3 class="text-xl font-semibold">${game.title}</h3>
        <p class="text-slate-300">Genre: ${game.genre}</p>
        <p class="mt-2 text-lg font-bold">${game.price.toFixed(2)} €</p>
      </div>
    `;

    gamesGrid.appendChild(card);
  });
}

// Basic initialization
renderGames(games);

// Filtrage en temps réel
document.getElementById('searchInput').addEventListener('input', () => {
  const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();
  const filtered = games.filter((game) => game.title.toLowerCase().includes(searchTerm));
  renderGames(filtered);
});

console.log('GameVault initialized');
