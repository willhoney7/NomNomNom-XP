function serviceWrapper (name) {
	this.name = name;
};
serviceWrapper.prototype.data = {
	"instapaper": {
		"authenticateUrl": "https://www.instapaper.com/api/authenticate",
		"addUrl": "https://www.instapaper.com/api/add",
	},
	"readitlater": {
		"authenticateUrl": "https://readitlaterlist.com/v2/auth",
		"addUrl": "https://readitlaterlist.com/v2/add",
		"apikey": "9a0T3t7bg2cH7pi2dSd4b92u89pfU8fY"
	},
	"delicious": {
		"authenticateUrl": "https://api.del.icio.us/v1/posts/update",
		"addUrl": "https://api.del.icio.us/v1/posts/add"
	},
	"pinboard": {
		"authenticateUrl": "https://api.pinboard.in/v1/posts/update",
		"addUrl": "https://api.pinboard.in/v1/posts/add"
	}
}

serviceWrapper.prototype.makeRequest = function (obj) {
	var queries = [];
	for (var i in obj.parameters) {
		queries.push(encodeURIComponent(i) + "=" + encodeURIComponent(obj.parameters[i]));
	}
	var queryString = queries.join("&");

	var url = obj.url + "?" + queryString;
	
	var request = new XMLHttpRequest();

	request.open((obj.method || "POST"), url, true);

	if(obj.headers.length > 0) {
		_.each(obj.headers, function(header){
			request.setRequestHeader(header.title, header.value);
		});
	}
	
	request.onreadystatechange = function(){
		if ((request.readyState === 4) && (request.status === 200 || request.status === 201)) {
			if(obj.onSuccess){
				obj.onSuccess(request);
			}
		} else if(request.readyState === 4){
			
			if(obj.onFailure){
				obj.onFailure(request);
			}

			console.error(request);
		}
	};
	
	request.send();
};

serviceWrapper.prototype.authenticate = function (username, password, callback) {
	var request = {
		url: this.data[this.name].authenticateUrl,
		parameters: {},
		headers: [],
		onSuccess: enyo.bind(this, function (response) {
			localStorage.setItem(this.name + "Username", username);
			var passToStore;
				switch (this.name) {
					case "instapaper":
					case "delicious":
					case "pinboard":
						passToStore = this.makeAuthHeader(username, password);
						break;
					case "readitlater":
						passToStore = password;
						break;
				}
			localStorage.setItem(this.name + "Password", passToStore);
			
			callback({success: true});
		}),
		onFailure: enyo.bind(this, function (response) {
			callback({error: this.getError(response.status)});
		})
	};
	switch (this.name) {
		case "delicious":
		case "pinboard":
			request.method = "GET";
		case "instapaper":
			request.headers.push({title: "Authorization", value: "Basic " + this.makeAuthHeader(username, password)}); 
			break;
		case "readitlater":
			request.parameters.username = username,
			request.parameters.password = password,
			request.parameters.apikey = this.data[this.name].apikey;			
			break;
	}
	this.makeRequest(request);
};

serviceWrapper.prototype.makeAuthHeader = function(username, password) {
	return btoa(utf8.encode(username) + ':' + utf8.encode(password));
};

serviceWrapper.prototype.logOut = function () {
	localStorage.removeItem(this.name + "Username");
	localStorage.removeItem(this.name + "Password");
};

serviceWrapper.prototype.add = function (obj, callback) {
	var request = {
		url: this.data[this.name].addUrl,
		parameters: {},
		headers: [],
		onSuccess: enyo.bind(this, function (response) {
			callback({success: true});
		}),
		onFailure: enyo.bind(this, function (response) {
			callback({error: this.getError(response.status)});
		})
	};
	switch (this.name) {
		case "instapaper":
			request.headers.push({title: "Authorization", value: "Basic " + localStorage.getItem(this.name + "Password")});
			request.parameters.title = utf8.encode(obj.title);
			//request.parameters.url = obj.url;
			break;
		case "readitlater":
			request.parameters.username = localStorage.getItem(this.name + "Username"),
			request.parameters.password = localStorage.getItem(this.name + "Password"),
			request.parameters.apikey = "9a0T3t7bg2cH7pi2dSd4b92u89pfU8fY";		
			request.parameters.title = utf8.encode(obj.title);	
			//request.parameters.url = obj.url;
			break;
		case "delicious":
		case "pinboard":
			request.headers.push({title: "Authorization", value: "Basic " + localStorage.getItem(this.name + "Password")});
			request.parameters.description = utf8.encode(obj.title);
			request.method = "GET";
			break;
	}

	request.parameters.url = obj.url;

	this.makeRequest(request);
};

serviceWrapper.prototype.getError = function (status) {
	var error;
	switch (status) {
		case 400: //pocket
			error = "Invalid Request";
			break;
		case 401: //pocket and delicious
		case 403: //instapaper
			error = "Username and/or Password incorrect";
			break;
		case 500: //instapaper
			error = "Service encountered an error. Please try again later";
			break;
		case 501: //pocket
			error = "API rate limit exceeded; Try again later";
			break;
		case 503: //pocket
			error = "Pocket's sync server is down for scheduled maintenance.";
			break;
		default:
			error = "Error with Request";
			console.log(status);
			break;
	}
	return error;
};
