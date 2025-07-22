let modal1 = null ;
const focusableSelector = 'button, a, input, textarea'
let focusables = []

const openModal = function (e) {
    e.preventDefault();
    modal1 = document.querySelector(e.target.getAttribute('href'))
    focusables = Array.from(modal1.querySelectorAll(focusableSelector))
    modal1.style.display = null
    modal1.removeAttribute('aria-hidden')
    modal1.setAttribute('aria-modal', 'true')
    modal1.addEventListener('click', closeModal)
    modal1.querySelector('.js-modal-close').addEventListener('click', closeModal)
    modal1.querySelector('.js-modal-stop').addEventListener('click', stopPropagation)
    modal2.style.display = "none"
    modal1.querySelector('.modal_editor-container').style.display = 'block'
}

const closeModal = function (e) {
    if (modal1 === null) return
    e.preventDefault()
    window.setTimeout(function () {
    modal1.style.display = "none"
    modal1 = null
    }, 500)
    modal1.setAttribute('aria-hidden', 'true')
    modal1.removeAttribute('aria-modal')
    modal1.removeEventListener('click', closeModal)
    modal1.querySelector('.js-modal-close').removeEventListener('click', closeModal)
    modal1.querySelector('.js-modal-close').removeEventListener('click', stopPropagation)
}

const stopPropagation = function (e) {
    e.stopPropagation()
}

const focusInModal = function (e){
    e.preventDefault()
    let index = focusables.findIndex(f => f === modal1.querySelector(':focus'))
    if (e.shiftKey === true){
        index 
    } else {
        index ++
    }
    if (index >= focusables.length){
        index = 0
    }
    if (index < 0) {
        index = focusables.length - 1
    }
    focusables[index].focus()
}

document.querySelectorAll('.js-modal').forEach(a => {
    a.addEventListener('click', openModal)
})

window.addEventListener('keydown', function (e){
    if (e.key === "Escape" || e.key === "Esc") {
        closeModal(e)
    }
    if (e.key === 'Tab' && modal1 !== null){
        focusInModal(e)
    }
})

// =================================
//   Référence vers la 2ème modal
// =================================
const modal2 = document.getElementById('modal_add_work_container');

// Gestion de l'ouverture de la 2e modal
document.querySelector('.open_modal2').addEventListener('click', function (e) {
    e.preventDefault();
    
    // Cacher la première modal
    modal1.querySelector('.modal_editor-container').style.display = 'none';
    
    // Afficher la 2e modal
    modal2.style.display = 'block';
    modal2.removeAttribute('aria-hidden');
    modal2.setAttribute('aria-modal', 'true');
});

// Gestion de la fermeture de la 2e modal
document.querySelector('.js-modal2-close').addEventListener('click', function (e) {
    e.preventDefault();

    // Cacher la 2e modal
    modal2.style.display = 'none';
    modal2.setAttribute('aria-hidden', 'true');
    modal2.removeAttribute('aria-modal');

    // Réafficher la 1re modal
    modal1.querySelector('.modal_editor-content').style.display = 'block';
});

document.querySelector('.js-modal-return').addEventListener('click', function (e) {
    e.preventDefault();
    modal2.style.display = 'none';
    modal1.querySelector('.modal_editor-content').style.display = 'block';
});


