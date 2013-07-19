var nbrFacile = 0;
var nbrMoyen = 0;
var nbrDiff = 0;

var config = {
	"day_css": "css/main.css",
	"night_css": "css/night.css",
	"serverUrl": "http://192.168.192.4:8080/BreakFreeEngineV2/webresources/",
	
	//ordre et nombres des questions
	// f = question facile
	// m = question moyenne
	// d = question dur
	"ordre" : {
		//première partie
		"1": ["f","d","d"],
		//deuxième partie
		"2": ["f","d","d"],
		//troisième partie
		"3": ["f","d","d"]
	}
	}
	
	
	
for (x in config.ordre) {
	object = config.ordre[x];
	for (i = 0; i < object.length; i++) {
		if (object[i] == "f") {
			nbrFacile++;
		} else if (object[i] == "m") {
			nbrMoyen++;
		} else if (object[i] == "d") {
			nbrDiff++;
		} 
	}
}
