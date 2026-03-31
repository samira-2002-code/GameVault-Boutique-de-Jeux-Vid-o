// Données de jeux (chargées depuis games.json)
// const games = [ ... ]; // Supprimé, maintenant chargé depuis JSON

let games = []; // Variable globale pour stocker les jeux chargés

let cart = {}; // panier sous forme d'objet { id: { game, quantity } }

// Détecter la page
const isCartPage = !document.getElementById('gamesGrid');

// Références DOM
const gamesGrid = document.getElementById('gamesGrid');
const cartContainer = document.getElementById('cartContainer');
const cartTotal = document.getElementById('cartTotal');
const searchInput = document.getElementById('searchInput');
const orderBtn = document.getElementById('orderBtn');

// Fonction pour charger les jeux depuis games.json
async function loadGames() {
  try {
    console.log('Tentative de chargement des jeux depuis games.json...');
    const response = await fetch('./games.json');
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    console.log('Données chargées avec succès:', data);
    games = data; // Assigner les données chargées
  } catch (error) {
    console.error('Erreur lors du fetch:', error);
    throw error; // Relancer pour que le catch dans init puisse le gérer
  }
}

// Initialisation
loadCartFromLocalStorage();
if (!isCartPage) {
  loadGames().then(() => {
    renderGames(games);
  }).catch((error) => {
    console.error('Erreur lors du chargement des jeux:', error);
    if (gamesGrid) {
      gamesGrid.innerHTML = '<p class="text-red-500">Erreur de chargement des données. Vérifiez la console pour plus de détails.</p>';
    }
  });
}
renderCart();

// Filtrage en temps réel
if (!isCartPage) {
  searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const selectedCategory = document.querySelector('.category-btn.bg-indigo-500').dataset.category;
    filterAndRenderGames(searchTerm, selectedCategory);
  });

  // Boutons de catégorie
  const categoryButtons = document.querySelectorAll('.category-btn');
  categoryButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      categoryButtons.forEach((b) => {
        b.classList.remove('bg-indigo-500');
        b.classList.add('bg-slate-700');
      });
      btn.classList.add('bg-indigo-500');
      btn.classList.remove('bg-slate-700');

      const selectedCategory = btn.dataset.category;
      const searchTerm = searchInput.value.trim().toLowerCase();
      filterAndRenderGames(searchTerm, selectedCategory);
    });
  });
}

// Commander: vider panier
if (orderBtn) {
  orderBtn.addEventListener('click', () => {
    if (Object.keys(cart).length === 0) {
      alert('Votre panier est vide.');
      return;
    }

    cart = {}; // reset panier
    saveCartToLocalStorage();
    renderCart();

    alert('Commande réussie ! Merci de votre achat.');
  });
}

// Fonction de rendu des jeux
function renderGames(gameList) {
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
        <button class="mt-4 w-full py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white font-semibold add-cart-btn" data-id="${game.id}">
          Ajouter au panier
        </button>
      </div>
    `;

    gamesGrid.appendChild(card);
  });

  // Ajout des événements aux boutons du panier
  document.querySelectorAll('.add-cart-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const gameId = Number(btn.dataset.id);
      addToCart(gameId);
    });
  });
}

// Filtrer et afficher selon recherche + catégorie
function filterAndRenderGames(searchTerm, category) {
  let filtered = games;

  if (category && category !== 'Tous') {
    filtered = filtered.filter((game) => game.genre.toLowerCase() === category.toLowerCase());
  }

  if (searchTerm) {
    filtered = filtered.filter((game) => game.title.toLowerCase().includes(searchTerm));
  }

  renderGames(filtered);
}

// Ajouter un jeu au panier
function addToCart(gameId) {
  const game = games.find((item) => item.id === gameId);
  if (!game) return;

  if (cart[gameId]) {
    cart[gameId].quantity += 1;
  } else {
    cart[gameId] = { game, quantity: 1 };
  }

  saveCartToLocalStorage();
  renderCart();
}

// Rendu du panier
function renderCart() {
  if (!cartContainer) return; // Ne rien faire si pas de conteneur (page index)

  cartContainer.innerHTML = '';

  if (Object.keys(cart).length === 0) {
    if (isCartPage) {
      cartContainer.innerHTML = '<p class="text-slate-300 col-span-full text-center">Le panier est vide.</p>';
    } else {
      cartContainer.innerHTML = '<p class="text-slate-300">Le panier est vide.</p>';
    }
    if (cartTotal) cartTotal.textContent = '0 €';
    return;
  }

  let total = 0;

  if (isCartPage) {
    // Rendu en cartes pour la page panier
    Object.values(cart).forEach((item) => {
      const subTotal = item.game.price * item.quantity;
      total += subTotal;

      const card = document.createElement('article');
      card.className = 'card rounded-xl overflow-hidden border border-slate-700 bg-slate-800 shadow-md';

      card.innerHTML = `
        <img src="${item.game.image}" alt="${item.game.title}" class="w-full h-44" />
        <div class="p-4">
          <h3 class="text-xl font-semibold">${item.game.title}</h3>
          <p class="text-slate-300">Genre: ${item.game.genre}</p>
          <p class="mt-2 text-lg font-bold">${item.game.price.toFixed(2)} €</p>
          <div class="flex items-center justify-between mt-4">
            <div class="flex items-center gap-2">
              <button class="quantity-btn bg-slate-700 hover:bg-slate-600 px-2 py-1 rounded" data-action="decrease" data-id="${item.game.id}">-</button>
              <span class="w-8 text-center">${item.quantity}</span>
              <button class="quantity-btn bg-slate-700 hover:bg-slate-600 px-2 py-1 rounded" data-action="increase" data-id="${item.game.id}">+</button>
            </div>
            <button class="remove-btn bg-red-500 hover:bg-red-600 px-2 py-1 rounded" data-id="${item.game.id}">🗑</button>
          </div>
        </div>
      `;

      cartContainer.appendChild(card);
    });
  } else {
    // Rendu en liste pour index.html
    Object.values(cart).forEach((item) => {
      const subTotal = item.game.price * item.quantity;
      total += subTotal;

      const cartItem = document.createElement('div');
      cartItem.className = 'bg-slate-800 rounded-lg p-3 border border-slate-700 flex flex-col sm:flex-row justify-between gap-3 items-start';
      cartItem.innerHTML = `
        <div>
          <h3 class="font-semibold">${item.game.title}</h3>
          <p class="text-slate-300">Prix unitaire: ${item.game.price.toFixed(2)} €</p>
          <p class="text-slate-300">Sous-total: ${subTotal.toFixed(2)} €</p>
        </div>
        <div class="flex items-center gap-2">
          <button class="quantity-btn bg-slate-700 hover:bg-slate-600 px-2 py-1 rounded" data-action="decrease" data-id="${item.game.id}">-</button>
          <span class="w-8 text-center">${item.quantity}</span>
          <button class="quantity-btn bg-slate-700 hover:bg-slate-600 px-2 py-1 rounded" data-action="increase" data-id="${item.game.id}">+</button>
          <button class="remove-btn ml-2 bg-red-500 hover:bg-red-600 px-2 py-1 rounded" data-id="${item.game.id}">🗑</button>
        </div>
      `;

      cartContainer.appendChild(cartItem);
    });
  }

  if (cartTotal) cartTotal.textContent = `${total.toFixed(2)} €`;

  // Evénements des boutons de quantité et suppression
  document.querySelectorAll('.quantity-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.id);
      const action = btn.dataset.action;
      if (action === 'increase') {
        cart[id].quantity += 1;
      } else if (action === 'decrease') {
        cart[id].quantity -= 1;
        if (cart[id].quantity <= 0) {
          delete cart[id];
        }
      }
      saveCartToLocalStorage();
      renderCart();
    });
  });

  document.querySelectorAll('.remove-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.id);
      delete cart[id];
      saveCartToLocalStorage();
      renderCart();
    });
  });
}

// LocalStorage - sauvegarde
function saveCartToLocalStorage() {
  localStorage.setItem('gamevault-cart', JSON.stringify(cart));
}

// LocalStorage - chargement
function loadCartFromLocalStorage() {
  const savedCart = localStorage.getItem('gamevault-cart');
  if (savedCart) {
    try {
      cart = JSON.parse(savedCart);
    } catch (error) {
      console.error('Erreur lecture panier:', error);
      cart = {};
    }
  }
}
