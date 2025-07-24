// ===========================================
//            Chargement des œuvres
// ===========================================

// Appel initial de la fonction de récupération des œuvres
let allWorks = []; // Stockage global des œuvres pour la galerie principale
getWorks();

// Fonction de récupération des œuvres depuis l'API
async function getWorks() {
  const url = 'http://localhost:5678/api/works';

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Response status: ${response.status}`);

    allWorks = await response.json();
    console.log(allWorks);

    // Génère une figure pour chaque œuvre dans la galerie principale
    allWorks.forEach(figureWork);
  } catch (error) {
    console.error(error.message);
  }
}

// Génération d’un <figure> pour une œuvre dans la galerie principale
function figureWork(data) {
  const gallery = document.querySelector(".gallery");

  const figure = document.createElement("figure");
  figure.innerHTML = `
    <img src="${data.imageUrl}" alt="${data.title}">
    <figcaption>${data.title}</figcaption>
  `;

  gallery.appendChild(figure);
}

// ===========================================
//    Chargement des œuvres dans la modale
// ===========================================

let allWorksModal = []; // Stockage pour la galerie de la modale
getWorksForModal();

// Fonction de récupération des œuvres pour la modale
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

// Génère une figure pour la modale et ajoute un bouton de suppression
function figureWorkModal(data) {
  const gallery = document.querySelector(".modal_gallery");

  const figure = document.createElement("figure");
  figure.classList.add("gallery-item");

  figure.innerHTML = `
    <img src="${data.imageUrl}" alt="${data.title}">
    <button type="button" class="delete-button" data-id="${data.id}">
      <img src="assets/icons/trash.svg" alt="Supprimer">
    </button>
  `;

  gallery.appendChild(figure);

  // Ajout de l'écouteur d'événement pour le bouton supprimer
  const button = figure.querySelector(".delete-button");
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
        figure.remove(); // Supprime la figure de la modale
        console.log(`Travail ${workId} supprimé.`);
      } else {
        console.error("Erreur lors de la suppression :", response.status);
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
    }
  });
}

// ===========================================
//     Ouverture de la modale d’édition
// ===========================================

document.querySelectorAll('.js-modal').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();

    const modal = document.getElementById('modal_editor');
    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden', 'false');
    modal.setAttribute('aria-modal', 'true');
  });
});

// ==========================
//     Filtres par catégorie
// ==========================

let allCategories = []; // Stockage des catégories
getCategories();

// Fonction de récupération des catégories depuis l’API
async function getCategories() {
  const url = 'http://localhost:5678/api/categories';

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Response status: ${response.status}`);

    allCategories = await response.json();
    console.log(allCategories);

    allCategories.forEach(btnFilters); // Génère un bouton filtre par catégorie
  } catch (error) {
    console.error(error.message);
  }
}

// Bouton "Tous" : affiche toutes les œuvres
const btnAll = document.querySelector('.btn_all');
btnAll.addEventListener('click', () => {
  document.querySelector(".gallery").innerHTML = "";
  allWorks.forEach(figureWork);
});

// Création dynamique des boutons de filtre
function btnFilters(data) {
  const filters = document.querySelector(".filter");
  const button = document.createElement("button");

  button.className = `btn_${data.id}`;
  button.innerText = data.name;

  filters.appendChild(button);

  // Affiche uniquement les œuvres de la catégorie sélectionnée
  button.addEventListener("click", () => {
    const filtered = allWorks.filter(work => work.categoryId === data.id);
    document.querySelector(".gallery").innerHTML = "";
    filtered.forEach(figureWork);
  });
}

// ==========================
//     Mode édition connecté
// ==========================

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");

  if (token) {
    document.querySelector('.editor_mode').style.display = 'flex';
    document.querySelector('.btn_editor').style.display = 'flex';
    document.querySelector('.login').style.display = 'none';
    document.querySelector('.logout').style.display = 'flex';
    document.querySelector('.filter').style.display = 'none';
    document.querySelector('.portfolio_header').style.marginBottom = '92px';
  }
});

// ==========================
//     Déconnexion utilisateur
// ==========================

document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logout");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("token");

      // Mise à jour de l’interface après déconnexion
      document.querySelector('.editor_mode').style.display = 'none';
      document.querySelector('.btn_editor').style.display = 'none';
      document.querySelector('.login').style.display = 'flex';
      document.querySelector('.logout').style.display = 'none';
      document.querySelector('.filter').style.display = 'flex';
      document.querySelector('.portfolio_header').style.marginBottom = '0';
    });
  }
});

// ==========================
//     Ajout d’une œuvre
// ==========================

document.getElementById('add_works').addEventListener('click', function (e) {
  e.preventDefault();

  const form = document.getElementById('add_work-form');
  const imgNewWork = document.getElementById('imageWork');
  const titleNewWork = document.getElementById('titleWork');

  // Vérification des champs requis
  if (
    imgNewWork.files.length === 0 ||
    titleNewWork.value.trim() === '' ||
    document.getElementById('categoriesWork').value === ''
  ) {
    console.log("Erreur : Remplir toutes les cases");
    document.querySelector('.error-alert').style.display = 'flex';
    document.querySelector('.add_work').style.margin = '0 0 50px 0';
    document.querySelector('.modal_add_work-content').style.paddingBottom = '0';
    return;
  }

  // Vérifie la taille de l'image (max 4 Mo)
  const file = imgNewWork.files[0];
  if (file.size > 4 * 1024 * 1024) {
    alert("L'image dépasse 4 Mo. Veuillez choisir une image plus légère.");
    imgNewWork.value = "";
    return;
  }

  const formData = new FormData(form);

  // Envoi du formulaire via POST
  fetch('http://localhost:5678/api/works', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    },
    body: formData
  })
  .then(res => res.json())
  .then(data => {
    console.log('Upload réussi:', data);
  })
  .catch(err => {
    console.error('Erreur lors de l\'upload:', err);
  });
});

// ================================
//   Chargement des catégories dans le formulaire
// ================================

let allCategoriesForForm = []; // Stockage catégories pour le formulaire
getCategoriesForForm();

// Fonction de récupération des catégories pour le formulaire
async function getCategoriesForForm() {
  const url = 'http://localhost:5678/api/categories';

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Response status: ${response.status}`);

    allCategoriesForForm = await response.json();
    console.log(allCategoriesForForm);

    allCategoriesForForm.forEach(selectCat);
  } catch (error) {
    console.error(error.message);
  }
}

// Ajout d'option dans le <select> des catégories
function selectCat(data) {
  const form = document.getElementById("categoriesWork");
  const option = document.createElement("option");

  option.value = data.id;
  option.textContent = data.name;

  form.appendChild(option);
}

// ================================
//     Aperçu de l’image importée
// ================================

document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('imageWork');
  const container = document.querySelector('.custom-upload-button');

  input.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Supprime l'image précédente si existante
    const oldPreview = container.querySelector('.preview-image');
    if (oldPreview) oldPreview.remove();

    // Création de l’aperçu
    const reader = new FileReader();
    reader.onload = (event) => {
      const imgTag = document.createElement('img');
      imgTag.src = event.target.result;
      imgTag.className = 'preview-image';

      // Cacher les éléments de chargement
      document.querySelector('.icone_import').style.display = 'none';
      document.querySelector('.button_add_image').style.display = 'none';
      document.querySelector('.format_image').style.display = 'none';

      container.appendChild(imgTag);
    };

    reader.readAsDataURL(file);
  });
});

// ================================
//   Activation du bouton "Valider"
// ================================

document.addEventListener('DOMContentLoaded', () => {
  const btnValider = document.getElementById('add_works');
  const imageInput = document.getElementById('imageWork');
  const titleInput = document.getElementById('titleWork');
  const categorySelect = document.getElementById('categoriesWork');

  // Vérifie si tous les champs sont remplis pour activer le bouton
  function checkFormFields() {
    const imageOK = imageInput.files.length > 0;
    const titleOK = titleInput.value.trim() !== '';
    const categoryOK = categorySelect.value !== '';

    if (imageOK && titleOK && categoryOK) {
      btnValider.classList.add('active');
    } else {
      btnValider.classList.remove('active');
    }
  }

  imageInput.addEventListener('change', checkFormFields);
  titleInput.addEventListener('input', checkFormFields);
  categorySelect.addEventListener('change', checkFormFields);
});
