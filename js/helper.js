function getRand(lo,hi){
	var rand=Math.random();
	var range=hi-lo;
	return Math.round(lo + rand*range);
}

function save(Game) {
		localStorage.setItem("game",JSON.stringify(Game));
}
function getGame() {
	return JSON.parse( localStorage.getItem("game") );
}

