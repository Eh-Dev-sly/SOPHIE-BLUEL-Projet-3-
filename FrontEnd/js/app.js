getWorks();

async function getWorks () {
  const url = 'http://localhost:5678/api/works';
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const work = await response.json();
    console.log(work, "test123");
    figureWork(work);
  } catch (error) {
    console.error(error.message);
  }
}

function figureWork(data) {
    
    const gallery = document.querySelector(".gallery");

    const figure = document.createElement("figure");
    figure.innerHTML = `<img src=${data[0].imageUrl} alt=${data[0].title}> <figcaption>${data[0].title}</figcaption>`;

    gallery.appendChild(figure);
}

