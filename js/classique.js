
var game; // On stockera à l'intérieur différentes informations du jeu

/*
 * Partie 1 : initialisation d'un
 * Créer une fonction d'initialisation du jeu
 * A l'intérieur de cete fonction :
 * - définir une propriété de l'objet game qui s'appelera "round" et à laquelle on donnera la valeur 1
 * - Demander à l'utilisateur le niveau de difficulté (là l'utilisateur peut choisir 1 : Facile, 2 : Moyen ou 3 : Difficile)
 * - Définir deux propriétés de l'objet game :
 *		- une première propriété hpPlayer qui vaudra :
 *			- Un nombre aléatoire entier entre 200 et 250 si le niveau choisi est 1 et 2
 *      - Un nombre aléatoire entier entre 150 et 200 si le niveau choisi est 3
 *    - une deuxième propriété hpDragon qui vaudra :
 *			- Un nombre aléatoire entre 200 et 250 quelque soit le niveau
 * - Demander à l'utilisateur l'arme qu'il souhaite choisir entre 1. Epée en bois 2. Epée en acier 3. Epée Excalibur
 *		- définir une propriété de l'objet game qui sera nommé swordRatio qui vaudra 0.5, 1 ou 2 en fonction du choix de l'utilisateur
 * - Demander à l'utilisateur l'armure qu'il souhaite choisir 1. Amure en cuivre 2. Armure en fer 3. Armure magique
 *		- définir une propriété de l'objet game qui sera nommé armorRatio qui vaudra 1, 1.25 ou 2 en fonction du choix de l'utilisateur
 * 	
 */
 
 // Cette fonction permet de générer un nombre aléatoire entre min et max
function generateRandomNumber(min, max) {
	var randomNumber;
  randomNumber = Math.ceil(Math.random() * (max-min) + min);
  
  return randomNumber;
 }
 
function initializeGame() {
	game = {}; // ou game = new Object()
  game.round = 1; // On initialise la valeur de la propriété round de l'objet game à 1
  
  // On demande à l'utilisateur le niveau de difficulté
  game.level = window.prompt("A quel niveau de difficulté souhaitez-vous jouer ? 1 = Facile, 2 = Moyen, 3 = Difficile");
  // On demande à l'utilisateur l'arme
  game.sword = window.prompt("Quelle arme choisissez-vous ? 1 = Epée en bois, 2 = Epée en acier, 3 = Epée Excalibur");
  // On demande à l'utilisateur l'armur
  game.armor = window.prompt("Quelle arme choisissez-vous ? 1 = Armure en cuivre, 2 = Armure en fer, 3 = Armure magique");
    
	switch (game.level) {
		case "1":
      // Si l'utilisateur a choisi le niveau 1
			game.hpDragon = generateRandomNumber(200,250); // Le dragon part avec des points de vie entre 200 et 250
      game.hpPlayer = generateRandomNumber(200,250); // Le chevalier part avec des points de vie entre 200 et 250
    	break;
    case "2":
			game.hpDragon = generateRandomNumber(200,250);
			game.hpPlayer = generateRandomNumber(200,250);
			break;
		case "3":
			game.hpDragon = generateRandomNumber(200,250);
			game.hpPlayer = generateRandomNumber(150,200);
 			break;
	}
  
  switch (game.sword) {
    case "1": // Si l'utilisateur a choisi l'épée en bois etc
      game.swordRatio = 0.5;
      break;
    case "2":
      game.swordRatio = 1;
      break;
    case "3":
      game.swordRatio = 2;
      break;
  }
  
	switch (game.armor) {
    case "1": // Si l'utilisateur a choisi l'amure en cuivre etc
      game.armorRatio = 1;
      break;
    case "2":
      game.armorRatio = 1.25;
      break;
    case "3":
      game.armorRatio = 2;
      break;
  }  
}

/**
* Partie 2 : afficher les points de vie
* Créer une fonction qui affiche les points de vie des deux personnages du jeu dans la console
* Sous la forme "Dragon : {pointsDeVie} PV - Chevalier : {pointsDevie} PV"
*/
function displayHealthPoints() {
 	console.log("Dragon : " + game.hpDragon + " PV - Chevalier : " + game.hpPlayer + " PV");
}

/**
* Partie 3 : exécution du jeu (doit être isolé dans une fonction comme le reste)
* Tant que le dragon et le jour sont vivants :
* - On détermine une vitesse pour le dragon : nombre aléatoire entier compris entre 10 et 20
* - On détermine une vitesse pour le chevalier de la même façon
* Si la vitesse du dragon est supérieure à celle du chevalier alors :
* - On retire des points de vie au chevalier :
*   - Entre 10 et 20 points aléatoirement (si le niveau est facile)
*   - Sinon entre 30 et 40 points
* Sinon :
* - On retire des points de vie au dragon :
*   - Entre 25 et 30 points si le niveau est facile
*   - Entre 15 et 20 points si le niveau est moyen
*   - Entre 5 et 10 points si le niveau est difficile
* A chaque tour on affiche dans la console les points de vie avec la fonction d'affichage de points de vie
* A chaque tour on affiche dans la console le numéro du tour (game.round) qui doit évidemment évoluer à chaque tour !
*/
function gameLoop() {
 //... 
 do{
 	var vitesseDragon;
 	var vitesseJoueur;
 	do{	
 	 vitesseJoueur = generateRandomNumber(10,20);
 	 vitesseDragon = generateRandomNumber(10,20);
 		}
	while(vitesseDragon!=vitesseJoueur);

 	if (vitesseDragon > vitesseJoueur) {
 		switch(game.level){
 		 			1:
 		 				game.hpJoueur -= generateRandomNumber(10,20)
 		 				break;
 		 			default:
	 					game.hpJoueur -= generateRandomNumber(30,40) 		 				
 		 			}
 	}else{
 		switch(game.level){
 		 			1:
 		 				game.hpDragon -= generateRandomNumber(25,30)
 		 				break;
 		 			2:
 		 				game.hpDragon -= generateRandomNumber(15,20)
 		 				break;
 		 			3:
 		 				game.hpDragon -= generateRandomNumber(5,10)
 		 				break;
 		 			default:
	 					console.log("bug hpDragon");
 		};
 		displayHealthPoints();
 		game.round++;
 		console.log(game.round);
 	}
 }while(
 	game.hpPlayer > 0 || game.hpDragon >0)
}

/**
* Partie 4 :
* Une fois le jeu terminé, on crée une fonction qui affiche le gagnant
* Si le gagnant est le chevalier :
* - On affiche sur la page l'image du chevalier
* - On affiche dans la console les messages suivants :
* 	- "Vous avez gagné vous êtes vraiment fort !"
*		- "Il vous restait {x} PV"
* Si le gagnant est le dragon :
* - On affiche sur la page l'image du dragon
* - On affiche dans la console les messages suivants :
*   - "Le dragon a gagné vous avez été carbonisé !"
*		- "Il restait {x} PV au dragon"
*/

// Initialisation du jeu : on appelle la fonction d'initialisation
initializeGame();

// Afficher les points de vie au départ : on appelle la fonction d'affichage des points de vie
displayHealthPoints();