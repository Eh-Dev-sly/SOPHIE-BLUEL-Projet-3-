let modal1 = null; // Référence de la modal principale
const focusableSelector = 'button, a, input, textarea'; // Éléments focusables dans une modal
let focusables = []; // Liste des éléments focusables dans la modal active

const stopPropagation = function (e) {
    e.stopPropagation();
};

// ==========================
// OUVERTURE DE LA MODAL 1
// ==========================
const openModal = function (e) {
    e.preventDefault();

    modal1 = document.querySelector(e.target.getAttribute('href')); // Récupère la modal ciblée
    focusables = Array.from(modal1.querySelectorAll(focusableSelector)); // Stocke les éléments focusables
    
    modal1.style.display = null;
    modal1.removeAttribute('aria-hidden');
    modal1.setAttribute('aria-modal', 'true');
    modal1.removeAttribute('inert');

    // Gestion des fermetures
    modal1.addEventListener('click', closeModal);
    modal1.querySelector('.js-modal-close')?.addEventListener('click', closeModal);
    modal1.querySelector('.js-modal-stop')?.addEventListener('click', stopPropagation);

    modal2.style.display = 'none';

    modal1.querySelector('.modal_editor-container').style.display = 'block';
};

// ==========================
// FERMETURE DE LA MODAL 1
// ==========================
const closeModal = function (e) {
    if (modal1 === null) return; // Si aucune modal ouverte
    e.preventDefault();

    // Retire le focus
    const active = document.activeElement;
    if (modal1.contains(active)) {
        active.blur();
    }

    // Fermeture avec délai
    window.setTimeout(function () {
        modal1.style.display = 'none';
        modal1 = null;
    }, 500);

    // Mise à jour des attributs d'accessibilité
    modal1.setAttribute('aria-hidden', 'true');
    modal1.removeAttribute('aria-modal');
    modal1.setAttribute('inert', '');

    // Suppression des addEvent
    modal1.removeEventListener('click', closeModal);
    modal1.querySelector('.js-modal-close')?.removeEventListener('click', closeModal);
    modal1.querySelector('.js-modal-stop')?.removeEventListener('click', stopPropagation);
};

// ==========================
// NAVIGATION AU CLAVIER DANS LA MODAL
// ==========================
const focusInModal = function (e) {
    e.preventDefault();
    let index = focusables.findIndex(f => f === modal1.querySelector(':focus')); // Trouve l'élément actuellement focus

    // Shift+Tab
    if (e.shiftKey) {
        index--;
    } else {
        index++;
    }

    // Boucle le focus
    if (index >= focusables.length) index = 0;
    if (index < 0) index = focusables.length - 1;

    focusables[index].focus();
};

// ==========================
// ADDEVENT GLOBAUX
// ==========================

// Boutons d'ouverture des modales
document.querySelectorAll('.js-modal').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();

    const modal = document.getElementById('modal_editor');
    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden', 'false');
    modal.setAttribute('aria-modal', 'true');
  });
});

// Escape => fermer modal ; Tab => gestion du focus
window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' || e.key === 'Esc') {
        closeModal(e);
    }
    if (e.key === 'Tab' && modal1 !== null) {
        focusInModal(e);
    }
});

// ==========================
// MODAL 2 (Ajout de projet)
// ==========================
const modal2 = document.getElementById('modal_add_work_container');

// Empêche la fermeture de modal2 au clic intérieur
modal2.querySelector('.js-modal2-stop')?.addEventListener('click', stopPropagation);

// Ouvre modal2 depuis un bouton de modal1
document.querySelector('.open_modal2')?.addEventListener('click', function (e) {
    e.preventDefault();

    // Cache le contenu principal de modal1
    modal1.querySelector('.modal_editor-container').style.display = 'none';

    // Affiche modal2
    modal2.style.display = 'flex';
    modal2.removeAttribute('aria-hidden');
    modal2.setAttribute('aria-modal', 'true');
    modal2.removeAttribute('inert');

    // Réinitialise des éléments d'erreur et mise en page
    document.querySelector('.error-alert').style.display = 'none';
    document.querySelector('.add_work').style.margin = '50px 0';
    document.querySelector('.modal_add_work-content').style.paddingBottom = '45px';
});

// Ferme modal2 (et modal1 si elle est encore visible)
document.querySelector('.js-modal2-close')?.addEventListener('click', function (e) {
    e.preventDefault();

    const active = document.activeElement;
    if (modal2.contains(active)) active.blur();
    if (modal1 && modal1.contains(active)) active.blur();

    modal2.style.display = 'none';
    modal2.setAttribute('aria-hidden', 'true');
    modal2.setAttribute('inert', '');

    // Nettoyage de modal1 également (dans le doute)
    if (modal1) {
        modal1.style.display = 'none';
        modal1.setAttribute('aria-hidden', 'true');
        modal1.setAttribute('inert', '');
        modal1.removeEventListener('click', closeModal);
        modal1.querySelector('.js-modal-close')?.removeEventListener('click', closeModal);
        modal1.querySelector('.js-modal-stop')?.removeEventListener('click', stopPropagation);
        modal1 = null;
    }
});

// ==========================
//       BOUTON RETOUR
// ==========================

// retour complet à modal1 (focus, affichage, accessibilité)
document.querySelector('.js-modal-return')?.addEventListener('click', function (e) {
    e.preventDefault();

    modal2.style.display = 'none';
    modal2.setAttribute('aria-hidden', 'true');
    modal2.setAttribute('inert', '');

    if (modal1) {
        modal1.style.display = 'flex'; // Important : flex pour layout modal
        modal1.removeAttribute('aria-hidden');
        modal1.removeAttribute('inert');
        modal1.setAttribute('aria-modal', 'true');

        const container = modal1.querySelector('.modal_editor-container');
        if (container) {
            container.style.display = 'flex'; // Réactive le contenu principal
        }

        modal1.offsetHeight; // 👈 Forçage du reflow (utile si transition CSS)

        // Focus direct sur le bouton de fermeture
        const closeBtn = modal1.querySelector('.js-modal-close');
        if (closeBtn) closeBtn.focus();
    }
});
