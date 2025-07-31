let modal1 = null; // Référence de la modal principale
const modal2 = document.getElementById('modal_add_work_container'); // Modal 2 déclarée avant utilisation

const focusableSelector = 'button, a, input, textarea'; // Éléments focusables dans une modal
let focusables = []; // Liste des éléments focusables dans la modal active

const stopPropagation = function (e) {
    e.stopPropagation();
};

// ==========================
// Fonctions utilitaires d’affichage/accessibilité
// ==========================
function showModal(modal) {
    modal.style.display = 'flex';
    modal.removeAttribute('aria-hidden');
    modal.setAttribute('aria-modal', 'true');
    modal.removeAttribute('inert');
}

function hideModal(modal) {
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    modal.removeAttribute('aria-modal');
    modal.setAttribute('inert', '');
}

// ==========================
// OUVERTURE DE LA MODAL 1
// ==========================
const openModal = function (e) {
    e.preventDefault();

    modal1 = document.querySelector(e.target.getAttribute('href')); // Récupère la modal ciblée
    focusables = Array.from(modal1.querySelectorAll(focusableSelector)); // Stocke les éléments focusables
    
    showModal(modal1);

    // Gestion des fermetures
    modal1.addEventListener('click', closeModal);
    modal1.querySelector('.js-modal-close')?.addEventListener('click', closeModal);
    modal1.querySelector('.js-modal-stop')?.addEventListener('click', stopPropagation);

    // Cache modal2 si visible
    hideModal(modal2);

    // Affiche le contenu principal de modal1
    modal1.querySelector('.modal_editor-container').style.display = 'block';

    // Focus sur le premier élément focusable
    if (focusables.length > 0) {
        focusables[0].focus();
    }
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

    // Mise à jour des attributs d'accessibilité immédiatement
    hideModal(modal1);

    // Suppression des addEvent
    modal1.removeEventListener('click', closeModal);
    modal1.querySelector('.js-modal-close')?.removeEventListener('click', closeModal);
    modal1.querySelector('.js-modal-stop')?.removeEventListener('click', stopPropagation);

    // Recharge la page après fermeture
    //location.reload();

    window.setTimeout(function () {
        modal1 = null;
    }, 500);
};


// ==========================
// NAVIGATION AU CLAVIER DANS LA MODAL
// ==========================
const focusInModal = function (e) {
    e.preventDefault();
    let index = focusables.indexOf(document.activeElement); // Trouve l'élément actuellement focus

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
    btn.addEventListener('click', openModal);
});

// Escape => fermer modal ; Tab => gestion du focus
window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' || e.key === 'Esc') {
        if (modal2.style.display === 'flex') {
            // Fermer modal2 si ouverte
            document.querySelector('.js-modal2-close')?.click();
        } else {
            closeModal(e);
        }
    }
    if (e.key === 'Tab' && modal1 !== null) {
        focusInModal(e);
    }
});

// ==========================
// MODAL 2 (Ajout de projet)
// ==========================

// Empêche la fermeture de modal2 au clic intérieur
modal2.querySelector('.js-modal2-stop')?.addEventListener('click', stopPropagation);

// Ouvre modal2 depuis un bouton de modal1
document.querySelector('.open_modal2')?.addEventListener('click', function (e) {
    e.preventDefault();

    // Cache le contenu principal de modal1
    modal1.querySelector('.modal_editor-container').style.display = 'none';

    // Affiche modal2
    showModal(modal2);

    // Réinitialise des éléments d'erreur et mise en page
    document.querySelector('.error-alert').style.display = 'none';
    document.querySelector('.add_work').style.margin = '50px 0';
    document.querySelector('.modal_add_work-content').style.paddingBottom = '45px';

    // Focus sur le premier élément focusable de modal2 (optionnel)
    const focusablesModal2 = Array.from(modal2.querySelectorAll(focusableSelector));
    if (focusablesModal2.length > 0) {
        focusablesModal2[0].focus();
    }
});

// Ferme modal2 (et modal1 si elle est encore visible)
document.querySelector('.js-modal2-close')?.addEventListener('click', function (e) {
    e.preventDefault();

    const active = document.activeElement;
    if (modal2.contains(active)) active.blur();
    if (modal1 && modal1.contains(active)) active.blur();

    hideModal(modal2);

    // Nettoyage de modal1 également (dans le doute)
    if (modal1) {
        hideModal(modal1);
        modal1.removeEventListener('click', closeModal);
        modal1.querySelector('.js-modal-close')?.removeEventListener('click', closeModal);
        modal1.querySelector('.js-modal-stop')?.removeEventListener('click', stopPropagation);
        modal1 = null;
    }
});

// ==========================
// BOUTON RETOUR de modal2 vers modal1
// ==========================
document.querySelector('.js-modal-return')?.addEventListener('click', function (e) {
    e.preventDefault();

    hideModal(modal2);

    if (modal1) {
        showModal(modal1);

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
