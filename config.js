var nbrFacile = 0;
var nbrMoyen = 0;
var nbrDiff = 0;
var config = {
	"day_css": "css/main.css",
	"night_css": "css/night.css",
	"serverUrl": "http://10.192.81.197:8080/BreakFreeEngineV2/webresources/",
	
	"ordre" : {
		"1": ["f","d", "f","d"],
		"2": ["f"],
		"3": ["m"]
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
