// ===========================================
//            Chargement des œuvres
// ===========================================

// Appel initial
getWorks();
let allWorks = []; // Stockage global des œuvres

// Récupération des travaux depuis l'API
async function getWorks() {
  const url = 'http://localhost:5678/api/works';

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Response status: ${response.status}`);

    allWorks = await response.json();
    console.log(allWorks);

    allWorks.forEach(figureWork); // Affiche chaque œuvre
  } catch (error) {
    console.error(error.message);
  }
}

// Génération d’un <figure> pour la galerie principale
function figureWork(data) {
  const gallery = document.querySelector(".gallery");

  const figure = document.createElement("figure");
  figure.innerHTML = `
    <img src=${data.imageUrl} alt=${data.title}>
    <figcaption>${data.title}</figcaption>
  `;

  gallery.appendChild(figure);
}

// ===========================================
//    Chargement des œuvres dans la modale
// ===========================================

getWorksForModal();
let allWorksModal = [];

async function getWorksForModal() {
  const url = 'http://localhost:5678/api/works';

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Response status: ${response.status}`);

    allWorksModal = await response.json();
    console.log(allWorksModal);

    allWorksModal.forEach(figureWorkModal);
  } catch (error) {
    console.error(error.message);
  }
}

// Génère les figures de la modale + écouteurs de suppression
function figureWorkModal(data) {
  const gallery = document.querySelector(".modal_gallery");

  const figure = document.createElement("figure");
  figure.classList.add("gallery-item");
  figure.innerHTML = `
    <img src="${data.imageUrl}" alt="${data.title}">
    <button class="delete-button" data-id="${data.id}">
      <img src="assets/icons/trash.svg" alt="Supprimer">
    </button>
  `;

  gallery.appendChild(figure);

  // Sélectionne tous les boutons "Supprimer"
  const deleteButtons = document.querySelectorAll('.delete-button');

  deleteButtons.forEach((button) => {
    button.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const workId = button.dataset.id;

      try {
        const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        });

        if (response.ok) {
          button.closest("figure").remove(); // Supprime l’élément du DOM
          console.log(`Travail ${workId} supprimé.`);
        } else {
          console.error("Erreur lors de la suppression :", response.status);
        }
      } catch (error) {
        console.error("Erreur réseau :", error);
      }
    });
  });
}

// ==========================
//   Filtres par catégorie
// ==========================

async function getCategories() {
  const url = 'http://localhost:5678/api/categories';

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Response status: ${response.status}`);

    allCategories = await response.json();
    console.log(allCategories);

    allCategories.forEach(btnFilters); // Crée un bouton pour chaque catégorie
  } catch (error) {
    console.error(error.message);
  }
}
getCategories();

// Bouton "Tous"
const btnAll = document.querySelector('.btn_all');
btnAll.addEventListener('click', () => {
  document.querySelector(".gallery").innerHTML = ""; // Vide la galerie
  allWorks.forEach(figureWork); // Affiche tout
});

// Création des boutons filtres
function btnFilters(data) {
  const filters = document.querySelector(".filter");
  const button = document.createElement("button");

  button.className = `btn_${data.id}`;
  button.innerText = data.name;

  filters.appendChild(button);

  // Écouteur pour filtrer selon la catégorie
  button.addEventListener("click", () => {
    const filtered = allWorks.filter(work => work.categoryId === data.id);
    document.querySelector(".gallery").innerHTML = "";
    filtered.forEach(figureWork);
  });
}

// ==========================
//  Mode édition / Connexion
// ==========================

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");

  if (token) {
    // Si l’utilisateur est connecté
    document.querySelector('.editor_mode').style.display = 'flex';
    document.querySelector('.btn_editor').style.display = 'flex';
    document.querySelector('.login').style.display = 'none';
    document.querySelector('.logout').style.display = 'flex';
    document.querySelector('.filter').style.display = 'none';
    document.querySelector('.portfolio_header').style.marginBottom = '92px';
  }
});

// ==========================
//  Déconnexion utilisateur
// ==========================

document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logout");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("token");

      document.querySelector('.editor_mode').style.display = 'none';
      document.querySelector('.btn_editor').style.display = 'none';
      document.querySelector('.login').style.display = 'flex';
      document.querySelector('.logout').style.display = 'none';
      document.querySelector('.filter').style.display = 'flex';
      document.querySelector('.portfolio_header').style.marginBottom = '0';
    });
  }
});
