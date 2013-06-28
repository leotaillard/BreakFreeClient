var nbrFacile = 0;
var nbrMoyen = 0;
var nbrDiff = 0;
var config = {
	"serverUrl": "http://10.192.58.61:8080/BreakFreeEngineV2/webresources/",
	
	"ordre" : {
		"1": ["f","m","d"],
		"2": ["f","m","d"],
		"3": ["f","m","d"]
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
