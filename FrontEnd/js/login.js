const form = document.querySelector('form'); // Sélectionne l'élément formulaire
const btnSubmit = document.getElementById('btn_submit'); // Sélectionne le bouton de soumission
const errorId = document.querySelector('.error-alert'); // Sélectionne la div error_login

let loginEmail = document.getElementById('loginEmail'); // Sélectionne le champ de saisie de l'email
let loginPassword = document.getElementById('loginPassword'); // Sélectionne le champ de saisie du mot de passe

let email = loginEmail.value; // Initialise la variable email avec la valeur du champ email
let password = loginPassword.value; // Initialise la variable mot de passe avec la valeur du champ mot de passe

btnSubmit.addEventListener('click', (e) => { // Ajoute un écouteur d'événement au clic sur le bouton
    e.preventDefault(); // Empêche le rechargement par défaut du formulaire
    email = loginEmail.value;   // Met à jour la variable email avec la valeur actuelle saisie
    password = loginPassword.value; // Met à jour la variable mot de passe avec la valeur actuelle saisie
    
    fetch('http://localhost:5678/api/users/login', { // Envoie une requête POST à l'API de connexion
        method: 'POST', // Méthode HTTP utilisée
        headers: { 'Content-Type': 'application/json' }, // Spécifie que le corps de la requête est en JSON
        body: JSON.stringify({ // Convertit les données en format JSON
            email: email, // Inclut l'email
            password: password // Inclut le mot de passe
        })
    })
    .then(response => { // Traite la réponse du serveur
        if (!response.ok) { // Vérifie si la réponse n'est pas un succès (code HTTP 2xx)
            throw new Error(`Erreur HTTP : ${response.status}`); // Déclenche une erreur avec le code HTTP
        }
        return response.json(); // Transforme la réponse en objet JSON
    })
    .then(data => { // Traite les données JSON reçues
        console.log('Réponse API :', data); // Affiche la réponse de l'API dans la console
        localStorage.setItem('token', data.token); // Stockage du token pour la connexion
        document.location.href="index.html";
    })
    .catch(error => { // Gère les erreurs survenues pendant la requête
        // alert('Erreur lors de la connexion. Veuillez vérifier vos identifiants.'); // Affiche une alerte pour l'utilisateur en cas d'erreur
        errorId.style.display = 'flex';
        form.style.marginTop = '0';
    });
});

