getWorks();

async function getWorks () {
  const url = 'http://localhost:5678/api/works';
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const works = await response.json();
    console.log(works);
    for (let i = 0; i < works.length ; i++) {
        figureWork(works[i]);
    }
  } catch (error) {
    console.error(error.message);
  }
}

function figureWork(data) {
    const gallery = document.querySelector(".gallery");

    const figure = document.createElement("figure");
    figure.innerHTML = `<img src=${data.imageUrl} alt=${data.title}> <figcaption>${data.title}</figcaption>`;

    gallery.appendChild(figure);
}

