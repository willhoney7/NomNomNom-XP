//utils.js

function getImagePath (imageName) {
	//based on device dimensions, we need to get the proper image size.

	//will require lots of testing.

	return "assets/" + imageName;

};

function getPlatform () {
	var plat = navigator.appVersion;
	if(navigator.appVersion.indexOf("iPhone") !== -1){
		return "iPhone";
	} else if(navigator.appVersion.indexOf("iPad") !== -1){
		return "iPad";
	} else if(navigator.appVersion.indexOf("Chrome") !== -1){
		return "Chrome";
	} else if(navigator.appVersion.indexOf("Safari") !== -1){
		return "Safari";
	} else {
		return "Browser";
	}
}