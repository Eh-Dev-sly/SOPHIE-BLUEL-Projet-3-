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

async function getCategories() {
  const url = "http://localhost:5678/api/categories";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    console.log(json);
  } catch (error) {
    console.error(error.message);
  }
}
getCategories();

const btnAll = document.querySelector('.btn_all');

btnAll.addEventListener('click', function () {
  const objets = allWorks;

  document.querySelector(".gallery").innerHTML = ""; // vide la galerie

  objets.forEach(figureWork); // génère uniquement les objets
});

const btnObjects = document.querySelector('.btn_objects');

btnObjects.addEventListener('click', function () {
  const objets = allWorks.filter(work => work.categoryId === 1);

  document.querySelector(".gallery").innerHTML = ""; // vide la galerie

  objets.forEach(figureWork); // génère uniquement les objets
});

const btnAppartements = document.querySelector('.btn_appartements');

btnAppartements.addEventListener('click', function () {
  const objets = allWorks.filter(work => work.categoryId === 2);

  document.querySelector(".gallery").innerHTML = ""; // vide la galerie

  objets.forEach(figureWork); // génère uniquement les objets
});

const btnHotelsRestau = document.querySelector('.btn_hotels-restaurants');

btnHotelsRestau.addEventListener('click', function () {
  const objets = allWorks.filter(work => work.categoryId === 3);

  document.querySelector(".gallery").innerHTML = ""; // vide la galerie

  objets.forEach(figureWork); // génère uniquement les objets
});
