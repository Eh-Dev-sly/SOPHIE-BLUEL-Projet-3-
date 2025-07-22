let modal1 = null;
const focusableSelector = 'button, a, input, textarea';
let focusables = [];

// Utilitaire : stopPropagation
const stopPropagation = function (e) {
    e.stopPropagation();
};

// Ouvre une modal (modal1)
const openModal = function (e) {
    e.preventDefault();
    modal1 = document.querySelector(e.target.getAttribute('href'));
    focusables = Array.from(modal1.querySelectorAll(focusableSelector));
    
    // Rendre active
    modal1.style.display = null;
    modal1.removeAttribute('aria-hidden');
    modal1.setAttribute('aria-modal', 'true');
    modal1.removeAttribute('inert');

    // Fermer avec clic extérieur ou bouton
    modal1.addEventListener('click', closeModal);
    modal1.querySelector('.js-modal-close')?.addEventListener('click', closeModal);
    modal1.querySelector('.js-modal-stop')?.addEventListener('click', stopPropagation);

    // S'assurer que la modal2 est cachée
    modal2.style.display = 'none';

    // Afficher le bon contenu
    modal1.querySelector('.modal_editor-container').style.display = 'block';
};

// Ferme la modal principale (modal1)
const closeModal = function (e) {
    if (modal1 === null) return;
    e.preventDefault();

    // ✅ Retirer le focus si dans modal
    const active = document.activeElement;
    if (modal1.contains(active)) {
        active.blur();
    }

    // Masquer avec délai pour animation
    window.setTimeout(function () {
        modal1.style.display = 'none';
        modal1 = null;
    }, 500);

    modal1.setAttribute('aria-hidden', 'true');
    modal1.removeAttribute('aria-modal');
    modal1.setAttribute('inert', '');

    // Nettoyage des écouteurs
    modal1.removeEventListener('click', closeModal);
    modal1.querySelector('.js-modal-close')?.removeEventListener('click', closeModal);
    modal1.querySelector('.js-modal-stop')?.removeEventListener('click', stopPropagation);
};

// Gestion du focus dans la modal
const focusInModal = function (e) {
    e.preventDefault();
    let index = focusables.findIndex(f => f === modal1.querySelector(':focus'));

    if (e.shiftKey) {
        index--;
    } else {
        index++;
    }

    if (index >= focusables.length) index = 0;
    if (index < 0) index = focusables.length - 1;

    focusables[index].focus();
};

// Écouteurs d'ouverture de la première modal
document.querySelectorAll('.js-modal').forEach(a => {
    a.addEventListener('click', openModal);
});

// Clavier : Escape / Tab
window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' || e.key === 'Esc') {
        closeModal(e);
    }
    if (e.key === 'Tab' && modal1 !== null) {
        focusInModal(e);
    }
});

// ======================================
//   Gestion de la 2e modal (modal2)
// ======================================
const modal2 = document.getElementById('modal_add_work_container');

// Empêche la fermeture au clic intérieur
modal2.querySelector('.js-modal2-stop')?.addEventListener('click', stopPropagation);

// Ouvrir la 2e modal
document.querySelector('.open_modal2')?.addEventListener('click', function (e) {
    e.preventDefault();

    // Cacher contenu de modal1
    modal1.querySelector('.modal_editor-container').style.display = 'none';

    // Afficher modal2
    modal2.style.display = 'block';
    modal2.removeAttribute('aria-hidden');
    modal2.setAttribute('aria-modal', 'true');
    modal2.removeAttribute('inert');
});

// Fermer la 2e modal avec bouton close
document.querySelector('.js-modal2-close')?.addEventListener('click', function (e) {
    e.preventDefault();

    // Cacher la 2e modal
    modal2.style.display = 'none';
    modal2.setAttribute('aria-hidden', 'true');
    modal2.removeAttribute('aria-modal');
    modal2.setAttribute('inert', '');

    // Réafficher la partie cachée de modal1
    const modal1Container = modal1.querySelector('.modal_editor-container');
    if (modal1Container) {
        modal1Container.style.display = 'block';
    }

    // Rendre modal1 interactive à nouveau
    modal1.removeAttribute('aria-hidden');
    modal1.removeAttribute('inert');
    modal1.setAttribute('aria-modal', 'true');
});


// Bouton retour depuis modal2
document.querySelector('.js-modal-return')?.addEventListener('click', function (e) {
    e.preventDefault();

    modal2.style.display = 'none';
    modal2.setAttribute('aria-hidden', 'true');
    modal2.removeAttribute('aria-modal');
    modal2.setAttribute('inert', '');

    modal1.querySelector('.modal_editor-content').style.display = 'block';
});
