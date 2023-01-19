// TODO: Créez un tableau icons ayant pour valeur:
// ['bicycle', 'leaf', 'cube', 'anchor', 'paper-plane-o', 'bolt', 'bomb', 'diamond']
// La liste des icones que l'on souhaite avoir dans le jeu
let icons = ['bicycle', 'leaf', 'cube', 'anchor', 'paper-plane', 'bolt', 'bomb', 'diamond']

// on créer un nouveau tableau qui contient toutes les icones dupliquées
// afin d'avoir les icones en double et ainsi avoir des paires d'icones:
// ['bicycle', 'bicycle', 'leaf', 'leaf', ...]
let allIcons = icons.slice().concat(icons)

// Selecteurs utiles
// TODO: Remplacez les chaîne de caractères vide par le sélecteur approprié
// le container de la page
const containerElement = document.querySelector('.container') // TODO: sélectionnez l'élément ayant l'id container
// l'élément contenant les scores
const scorePanelElement = document.querySelector('#score-panel') // TODO: sélectionne l'élément ayant l'id score-panel
// l'élément permettant d'afficher le classement avec les étoiles
const ratingElement = document.querySelectorAll('.fa-star') // TODO: sélectionnez LES élémentS ayant la classe fa-star
// l'élément permettant d'afficher le nombre de tours
const movesElement = document.querySelector('#moves') // TODO: sélectionnez l'élément ayant l'id moves
// l'élément permettant d'afficher le temps déjà écoulé
const timerElement = document.querySelector('#timer') // TODO: sélectionnez l'élément ayant l'id' timer
// l'élément permettant de relancer le jeu
const restartElement = document.querySelector('#restart') // TODO: sélectionnez l'élément ayant l'id' restart
// l'élément permettant d'afficher les cartes
const deckElement = document.querySelector('#deck') // TODO: sélectionnez l'élément ayant l'id' deck
// le bouton de la modal
const modalBtnElement = document.querySelector('.modal-footer button') // TODO: sélectionnez le bouton de la modal dans modal-footer
// la modal Bootstrap
const modalElement = new bootstrap.Modal(document.querySelector('.modal'))
// l'élément qui contiendra le texte de fin de partie
const winnerTextElement = document.querySelector('.modal-body p')

// Variables utiles
let nowTime // permet de mettre à zéro le compteur de temps
let openedCards = [] // un tableau contenant les cartes qui restent face visible
let match = 0 // le nombre de cartes trouvées
let second = 0 // les secondes écoulées
let moves = 0 // le nombres de tour
const wait = 1000 // le nombre de millisecondes à attendre lors de certaines actions
const totalCard = allIcons.length / 2 // le nombre total de carte paire

// Le système de score :
const stars3 = 14 // entre 14 et 16 tours pour finir le jeu valent 3 étoiles
const stars2 = 16 // entre 16 et 20 tours pour finir le jeu valent 2 étoiles
const star1 = 20 // 20 tours ou plus pour finir le jeu valent 1 étoiles

/**
 * Shuffling function: mélange les cartes
 * permet qu'aucune partie n'ait le même arrangement de cartes
 * @param array
 * @returns {array}
 */
const shuffle = (array) => {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

/**
 * La function init() permet de démarrer le jeu
 */
const init = () => {
    // La function shuffle mélange le tableau allIcons
    // TODO: appelle la fonction shuffle avec pour paramètre le tableau allIcons, et stock le résultat de la fonction dans la variable allCards;
    let allCards = shuffle(allIcons)

    // TODO: supprime tous les éléments enfant de deckElement grâce à https://developer.mozilla.org/fr/docs/Web/API/Element/innerHTML
    // ...
    deckElement.innerHTML = ''

    // Le jeu commence sans cartes correspondantes et sans coups
    match = 0; // aucun match
    moves = 0; // aucun tour

    // TODO: change le texte de movesElement avec la valeur de la variable moves grâce à https://developer.mozilla.org/fr/docs/Web/API/Node/textContent
    // autrement dit, on veut afficher le nombre de tour dans movesElement
    // ...
    movesElement.textContent = moves

    // TODO: parcours le tableau allCards avec une boucle for
    for (let i = 0; i < allCards.length; i++) {
        // on ajoute l'index allCards[i] à fa-. pour obtenir une chaîne de caractères du type 'fa fa-bicycle'
        const faClass = 'fa-' + allCards[i]

        // on crée un nouvel élément <li>
        const li = document.createElement('li')
        li.classList.add('card')
        li.dataset.icon = allCards[i]
        // on crée un nouvel élément <i>
        const icon = document.createElement('i')
        icon.classList.add('fa-solid')
        icon.classList.add(faClass)
        // on ajoute l'élément <i> à l'élément <li>
        li.appendChild(icon)

        // TODO: avec la même approche, ajoute le li dans l'élément deckElement grâce à https://developer.mozilla.org/fr/docs/Web/API/Node/appendChild
        // ...
        deckElement.appendChild(li)

    }

    // on appelle la fonction addCardListener
    addCardListener();

    // Permet au chronomètre de se réinitialiser à 0 lorsque le jeu est redémarré
    resetTimer(nowTime);
    second = 0;
    // TODO: changez le texte de timerElement avec la valeur de la variable second grâce à https://developer.mozilla.org/fr/docs/Web/API/Node/textContent
    // ...
    timerElement.textContent = second

    initTime();
}

/**
 * Ajoute un score de 1 à 3 étoiles en fonction du nombre de mouvements effectués
 * @param moves
 * @returns {{score: number}}
 */
const rating = (moves) => {
    let rating = 3;
    if (moves > stars3 && moves < stars2) {
        // TODO: supprimez la class fa-solid et ajoutez la classe fa-regular du 3eme élément contenu dans ratingElement*
        // https://developer.mozilla.org/fr/docs/Web/API/Element/querySelector
        // ...
    } else if (moves > stars2 && moves < star1) {
        // TODO: supprimez la class fa-solid et ajoutez la classe fa-regular du 2eme élément contenu dans ratingElement
        // ...
    } else if (moves > star1) {
        // TODO: supprimez la class fa-solid et ajoutez la classe fa-regular du 1er élément contenu dans ratingElement
        // ...
        rating = 1;
    }
    return {score: rating};
}

/**
 * Ajouter une fenêtre d'alerte modale bootstrap indiquant le temps,
 * les mouvements, le score nécessaire pour terminer le jeu,
 * s'affiche lorsque toutes les paires sont trouvées.
 *
 * @param moves
 * @param score
 */
const gameOver = (moves, score) => {
    winnerTextElement.textContent = `En ${second} seconds, vous avez fait un total de ${moves} mouvements avec un score de ${score}. Bien joué !`
    modalElement.show()
}

// Clique sur le bouton situé en haut à droite du jeu permet également de réinitialiser les cartes
restartElement.addEventListener('click', () => {
    // TODO: complétez la function reset()
    reset();
});

// Clique sur le bouton de la modale permet également de réinitialiser les cartes
modalBtnElement.addEventListener('click', () => {
    // TODO: complétez la function reset()
    reset();
});

/**
 * Cette fonction permet de valider qu'une carte correspond à une autre carte ouverte lorsque que l'on clique dessus
 * Si les cartes correspondent, elles restent ouvertes.
 * Si les cartes ne correspondent pas, les deux cartes sont retournées.
 */
const addCardListener = () => {
    /** @var {NodeList} card */
    const cards = deckElement.querySelectorAll('.card')

    /** @var {Node} card */
    cards.forEach((card) => {
        card.addEventListener('click', (event) => {

            /* TODO: vérifier que card possède la classe show OU la class match */
            // on ne veut pas que l'utilisateur clique sur une carte déjà retournée
            if (card.classList.contains('show') || card.classList.contains('match')) {
                return true;
            }

            // TODO: ajoutez les classes open et show à l'élément card
            card.classList.add('open')
            card.classList.add('show')

            // on stocke la carte dans le tableau openedCards, pour savoir quelles cartes sont retournées face visible
            openedCards.push({
                element: card,
                icon: card.dataset.icon
            })

            if (openedCards[0].icon === openedCards[1].icon) { // si card correspond à la précédente carte retournée
                // TODO: ajoute la classe match au carte contenu dans openedCards
                // ...
                for (let i = 0; i < 2; i++) {
                    openedCards[i].element.classList.add('match')
                    openedCards[i].element.classList.add('match')
                }

                // On réinitialise le tableau openedCards
                openedCards = [];

                match++;

                // Si les cartes ne correspondent pas, il y a un délai de 630 ms et les cartes se retournent face cachée.
            } else {
                setTimeout(function () {
                    for (let i = 0; i < 2; i++) {
                        openedCards[i].element.classList.remove('open')
                        openedCards[i].element.classList.remove('show')
                    }
                    // On réinitialise le tableau openedCards
                    openedCards = [];

                }, wait);
            }

            // Incrémente le nombre de coups de 1 lorsque deux cartes correspondent ou ne correspondent pas
            moves++;

            // Le nombre de coups est ajouté à la fonction rating () qui déterminera le score d'étoiles
            // TODO: completes la function rating()
            rating(moves);

            // Le nombre de coups est affiché dans movesElement
            movesElement.textContent = moves;

            // Le jeu est terminé une fois que toutes les cartes ont été trouvées, avec un court délai
            if (totalCard === match) {
                rating(moves);
                let score = rating(moves).score;
                setTimeout(function () {
                    gameOver(moves, score);
                }, 500);
            }
        })
    })
}

const reset = () => {
    // TODO: supprime la classe fa-star-o des éléments ratingElement
    // TODO: et ajoute la classe fa-star aux éléments ratingElement
    // ...
    init();
}

/**
 * Lance le chronomètre dès que le jeu est chargé
 */
const initTime = () => {
    nowTime = setInterval(function () {
        timerElement.textContent = `${second}`
        second = second + 1
    }, 1000);
}

/**
 * Réinitialise le chronomètre lorsque le jeu se termine ou est redémarré
 * @param timer - l'interval
 */
const resetTimer = (timer) => {
    if (timer) {
        clearInterval(timer);
    }
}

init();
