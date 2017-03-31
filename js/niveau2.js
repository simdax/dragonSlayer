"use strict";

var game = getGame();

function printMenu(argument) {

		var html = "";

		html += "HP : " + game.hpPlayer + "<br>";
		html += "Dégâts épée : "+game.swordRatio + "<br>";
		html += "Protection armure : "+game.armorRatio + "<br>";

		$('nav').html(html);
		// body...
	}


function printDragonHP() {
	$('#dragonHP').html(game.hpDragon);
}


function hitDragon() {

	switch(game.difficulty){
		case 1:
			game.hpDragon -=	getRand(25,30);
		break;
		case 2:
			game.hpDragon -=	getRand(15,20);
		break;
		case 3:
			game.hpDragon -=	getRand(5,10);
		break;
		default:
	};
	if (game.hpDragon<= 0) {
		// truc de ouf
	};
	printDragonHP();
}

printMenu();
printDragonHP();
