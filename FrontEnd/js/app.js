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
  <button type="button" class="delete-button" data-id="${data.id}">
  <img src="assets/icons/trash.svg" alt="Supprimer">
  </button>
  `;
  
  gallery.appendChild(figure);
  
  // Sélectionne le bouton déjà injecté via innerHTML
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
      figure.remove(); // Supprime l'image de la modale
      console.log(`Travail ${workId} supprimé.`);
    } else {
      console.error("Erreur lors de la suppression :", response.status);
    }
  } catch (error) {
    console.error("Erreur réseau :", error);
  }
});
}

document.querySelectorAll('.js-modal').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault(); // ← Empêche le comportement natif (scroll/reload)
    
    const modal = document.getElementById('modal_editor');
    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden', 'false');
    modal.setAttribute('aria-modal', 'true');
    document.body.style.overflow = 'hidden'; // Optionnel : empêche scroll en arrière-plan
  });
});




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

document.getElementById('add_works').addEventListener('click', function (e) {
  e.preventDefault();

  const form = document.getElementById('add_work-form');
  
  const imgNewWork = document.getElementById('imageWork');
  const titleNewWork = document.getElementById('titleWork');

  if (
    imgNewWork.files.length === 0 ||
    titleNewWork.value.trim() === '' ||
    document.getElementById('categoriesWork').value === ''
  ) {
    alert('Veuillez remplir tous les champs.');
    return; 
  }

  const formData = new FormData(form);

  for (const [key, value] of formData.entries()) {
    console.log(key, value);
  }

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
//   Catégorie pour le Formulaire
// ================================

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
getCategoriesForForm();

// Select
function selectCat(data) {
  const form = document.getElementById("categoriesWork");
  const option = document.createElement("option");

  option.value = data.id;               // ➤ ✅ ID numérique requis par l'API
  option.textContent = data.name;       // Affiche le nom dans le select

  form.appendChild(option);
}

document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('imageWork');
  const container = document.querySelector('.custom-upload-button');

  input.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imgTag = document.createElement('img');
      imgTag.src = event.target.result;
      document.querySelector('.icone_import').style.display = 'none';
      document.querySelector('.button_add_image').style.display = 'none';
      document.querySelector('.format_image').style.display = 'none';
      imgTag.className = 'preview-image';
      container.appendChild(imgTag);
    };
    reader.readAsDataURL(file);
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const btnValider = document.getElementById('add_works');
  const imageInput = document.getElementById('imageWork');
  const titleInput = document.getElementById('titleWork');
  const categorySelect = document.getElementById('categoriesWork');

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
