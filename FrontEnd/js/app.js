// Function to get works of the DataBase and API
getWorks();
let allWorks = [];

async function getWorks () {
  const url = 'http://localhost:5678/api/works';
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    allWorks = await response.json(); // <- on stocke les œuvres dans la variable globale
    console.log(allWorks);
    for (let i = 0; i < allWorks.length ; i++) {
        figureWork(allWorks[i]);
    }
  } catch (error) {
    console.error(error.message);
  }
}

function figureWork(data) {
  const gallery = document.querySelector(".gallery"); // Sélection de la galerie
  
  const figure = document.createElement("figure"); // Création d'une figure pour chaque œuvre
  figure.innerHTML = `<img src=${data.imageUrl} alt=${data.title}> <figcaption>${data.title}</figcaption>`; // Ajout de l'image et du titre de l'œuvre
  
  gallery.appendChild(figure); // Ajout de la figure à la galerie
}

// Function to get works of the DataBase and API
getWorksForModal();
let allWorksModal = [];

async function getWorksForModal () {
  const url = 'http://localhost:5678/api/works';
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    allWorksModal = await response.json(); // <- on stocke les œuvres dans la variable globale
    console.log(allWorksModal);
    for (let i = 0; i < allWorksModal.length ; i++) {
        figureWorkModal(allWorksModal[i]);
    }
  } catch (error) {
    console.error(error.message);
  }
}

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

  const deleteButtons = document.querySelectorAll('.delete-button');

  deleteButtons.forEach((button) => {
    button.addEventListener('click', async (e) => {
      e.preventDefault();
      
      const workId = button.dataset.id; // Récupère l'ID des bouttons

      try {
        const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        });

        if (response.ok) {
          // 🧩 Étape 2 : supprimer l'élément du DOM
          const figure = button.closest("figure");
          figure.remove();
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

async function getCategories () {
  const url = 'http://localhost:5678/api/categories';
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    allCategories = await response.json(); // <- on stocke les œuvres dans la variable globale
    console.log(allCategories);
    for (let i = 0; i < allCategories.length ; i++) {
        btnFilters(allCategories[i]);
    }
  } catch (error) {
    console.error(error.message);
  }
}
getCategories();

// Fonction pour afficher toutes les travaux
const btnAll = document.querySelector('.btn_all'); // Sélection du bouton "Tous"

btnAll.addEventListener('click', function () { // Écouteur d'événement pour le clic sur le bouton "Tous"
const objets = allWorks; // On utilise la variable globale allWorks pour récupérer tous les travaux

document.querySelector(".gallery").innerHTML = ""; // vide la galerie

objets.forEach(figureWork); // affiche tous les travaux
});

// Fonction pour afficher les filtres
function btnFilters(data) { // Fonction pour créer un bouton de filtre pour chaque catégorie
  const filters = document.querySelector(".filter"); // Sélection de la section des filtres
  const button = document.createElement("button"); // Création d'un bouton pour chaque catégorie
  button.className = `btn_${data.id}`; // Classe du bouton basée sur l'ID de la catégorie
  button.innerText = data.name; // Texte du bouton basé sur le nom de la catégorie
  filters.appendChild(button); // Ajout du bouton à la section des filtres

  // Ajout de l'écouteur sur le bouton fraîchement créé
  button.addEventListener("click", function () { // Écouteur d'événement pour le clic sur le bouton de filtre
    const filtered = allWorks.filter(work => work.categoryId === data.id); // Filtre les travaux en fonction de la catégorie sélectionnée
    document.querySelector(".gallery").innerHTML = ""; // vide la galerie
    filtered.forEach(figureWork); // génère uniquement les travaux filtrés
  });
}

// Attend que le DOM soit entièrement chargé avant d'exécuter le script
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");  // Récupère le token de l'utilisateur depuis le localStorage
  if (token) { // Si un token existe (donc si l'utilisateur est connecté)
  document.querySelector('.editor_mode').style.display = 'flex';  // Affiche le editor_mode
  document.querySelector('.btn_editor').style.display = 'flex'; // Affiche le btn_editor
  document.querySelector('.login').style.display = 'none'; // Masque le login
  document.querySelector('.logout').style.display = 'flex'; // Affiche le logout
  document.querySelector('.filter').style.display = 'none'; // Masque les filtres
  document.querySelector('.portfolio_header').style.marginBottom = '92px'; // Ajoute un margin bottom
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logout")  // Si le bouton existe, on ajoute un écouteur d'événement
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      // Supprime le token du localStorage
      localStorage.removeItem("token");
      document.querySelector('.editor_mode').style.display = 'none';  // Affiche le editor_mode
      document.querySelector('.btn_editor').style.display = 'none'; // Affiche le btn_editor
      document.querySelector('.login').style.display = 'flex'; // Masque le login
      document.querySelector('.logout').style.display = 'none'; // Affiche le logout
      document.querySelector('.filter').style.display = 'flex'; // Masque les filtres
      document.querySelector('.portfolio_header').style.marginBottom = '0'; // Ajoute un margin bottom
    });
  }
});

