function setCookie(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	var expires = "expires=" + d.toUTCString();
	// document.cookie = cname + "=" + cvalue + ";" + expires;
	document.cookie = `${cname}=${cvalue};${expires};path=/`
}


function getCookie(cname) {
	var name = cname + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}

function checkCookie() {
	var language = getCookie("language");
	if (language == "en" || language == "fr"){
		window.location.pathname = `/${language}`;
	}
}
toggle = function () {
	document.getElementById("navbar").classList.toggle("visible");
}
toggleCookie = function (lang = null) {
	if (lang !== null) {
		if (lang == "en") {
			setCookie('language', 'fr', 365)
			l = "fr";
		} else {
			setCookie('language', 'en', 365)
			l = "en";
		}
	} else {
		var l;
		var language = getCookie("language");
		if (language == "en") {
			setCookie('language', 'fr', 365)
			l = "fr";
		} else {
			setCookie('language', 'en', 365)
			l = "en";
		}
	}
	var current_link = window.location.pathname;
	console.log(x)
	var x = current_link.split('/')
	x[1] = l;
	console.log(x)
	var new_link = x.join("/")
	console.log(new_link)
	window.location.pathname = `${new_link}`
	// console.log(`${window.location.protocol}${window.location.hostname}/${new_link}`);
}