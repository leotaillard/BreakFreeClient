$(document).ready(function() {
	$("#footer").click(function() {
		if ($('#stylesheet').attr('href') == config.day_css) {
			// -> en nuit
			document.getElementById('stylesheet').href='css/night.css';
		}	 else {
			// -> en jour
			document.getElementById('stylesheet').href='css/main.css';
		}
	return false;
	});
});