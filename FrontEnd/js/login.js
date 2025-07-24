// ==========================
// Sélection des éléments du DOM
// ==========================
const form = document.querySelector('form'); // Formulaire de connexion
const btnSubmit = document.getElementById('btn_submit'); // Bouton "Se connecter"
const errorId = document.querySelector('.error-alert'); // Message d'erreur (affiché en cas d'échec)

let loginEmail = document.getElementById('loginEmail'); // Champ email
let loginPassword = document.getElementById('loginPassword'); // Champ mot de passe

// Variables contenant les valeurs saisies (initialisées une fois)
let email = loginEmail.value;
let password = loginPassword.value;

// ==========================
// Soumission du formulaire
// ==========================
btnSubmit.addEventListener('click', (e) => {
    e.preventDefault(); // Empêche le rechargement de la page

    // Met à jour les valeurs à chaque clic (utile si l'utilisateur modifie les champs)
    email = loginEmail.value;
    password = loginPassword.value;

    fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: email,
            password: password
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`)
        }
        return response.json(); // Parse la réponse JSON
    })
    .then(data => {
        console.log('Réponse API :', data); // debug

        localStorage.setItem('token', data.token);

        document.location.href = "index.html";
    })
    .catch(error => {
        // Affiche un message d'erreur si les identifiants sont incorrects ou si l'API est inaccessible
        errorId.style.display = 'flex'; // Rend visible la div contenant le message d'erreur
        form.style.marginTop = '0'; // Ajuste l’espacement pour éviter un saut visuel
    });
});
