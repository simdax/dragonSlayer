"use strict";

 //      ___           ___                        ___
 //     /  /\         /  /\           ___        /  /\
 //    /  /::|       /  /::\         /__/\      /  /::|
 //   /  /:|:|      /  /:/\:\        \__\:\    /  /:|:|
 //  /  /:/|:|__   /  /::\ \:\       /  /::\  /  /:/|:|__
 // /__/:/_|::::\ /__/:/\:\_\:\   __/  /:/\/ /__/:/ |:| /\
 // \__\/  /~~/:/ \__\/  \:\/:/  /__/\/:/~~  \__\/  |:|/:/
 //       /  /:/       \__\::/   \  \::/         |  |:/:/
 //      /  /:/        /  /:/     \  \:\         |__|::/
 //     /__/:/        /__/:/       \__\/         /__/:/
 //     \__\/         \__\/                      \__\/


var Game={};

/// HELPERS

function check(boolArr){
	var gate=true;
	var cat = ["me parler de vostre valure", "choisir une arme", "choisir une armure"];
	for (var i=0; i < boolArr.length	; i += 3) {
		if(! (boolArr[i] || boolArr[i+1] || boolArr[i+2] )){
			window.alert("Monseigneur, vous avez oublié de "+cat[i/3]);
			gate =false;
		}
	};
	return gate;
}


function init() {
	
	var tmp=document.querySelectorAll('[type=radio]');
	var vals=[];
	for (var i = 0; i < tmp.length; i++) {
		vals.push(tmp[i].checked);
	};

	if (check(vals)) {
		Game.round=1;
		for (var i = 0; i < 3; i++) {
			if(vals[i]) {Game.difficulty=i+1}
				else{}
			};
		if(vals[5]) {Game.hpPlayer=getRand(150,200)}
			else{ Game.hpPlayer=getRand(200,250)};

		Game.hpDragon=getRand(200,250);
		var swordRatio=[0.5,1,2];
		for (var i = 0; i < 3; i++) {
			if(vals[i+3]) {Game.swordRatio=swordRatio[i]}
				else{}
			};
		var armorRatio=[1,1.25,2];
		for (var i = 0; i < 3; i++) {
			if(vals[i+6]) {Game.armorRatio=armorRatio[i]}
				else{}
			}
		save(Game);
		return true;
	}else{
		return false;
	}

}


