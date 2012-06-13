function serviceWrapper (name) {
	this.name = name;
};
serviceWrapper.prototype.urls = {
	"instapaper": {
		"authenticate": "https://www.instapaper.com/api/authenticate",
		"add": "https://www.instapaper.com/api/add",
	},
	"readitlater": {
		"authenticate": "https://readitlaterlist.com/v2/auth",
		"add": "https://readitlaterlist.com/v2/add"
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
	request.open("POST", url, true);

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
		url: this.urls[this.name].authenticate,
		parameters: {},
		headers: [],
		onSuccess: enyo.bind(this, function (response) {
			localStorage.setItem(this.name + "Username", username);
			var passToStore;
				switch (this.name) {
					case "instapaper":
						passToStore = btoa(utf8.encode(username) + ':' + utf8.encode(password));
						break;
					case "readitlater":
						passToStore = password;
						break;
				}
			localStorage.setItem(this.name + "Password", passToStore);
			
			callback({success: true});
		}),
		onFailure: function (response) {
			var error;
			switch (response.status) {
				case 400: //pocket
					error = "Invalid Request";
					break;
				case 401: //pocket
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
			}
			callback({error: error});
		}
	};
	switch (this.name) {
		case "instapaper":
			request.headers.push({title: "Authorization", value: "Basic " + btoa(utf8.encode(username) + ':' + utf8.encode(password))}) 
			break;
		case "readitlater":
			request.parameters.username = username,
			request.parameters.password = password,
			request.parameters.apikey = "9a0T3t7bg2cH7pi2dSd4b92u89pfU8fY";			
			break;
	}
	this.makeRequest(request);
};

serviceWrapper.prototype.logOut = function () {
	localStorage.removeItem(this.name + "Username");
	localStorage.removeItem(this.name + "Password");
};

serviceWrapper.prototype.add = function (obj, callback) {
	var request = {
		url: this.urls[this.name].add,
		parameters: {},
		headers: [],
		onSuccess: enyo.bind(this, function (response) {
			callback({success: true});
		}),
		onFailure: function (response) {
			var error;
			switch (response.status) {
				case 400: //pocket
					error = "Invalid Request";
					break;
				case 401: //pocket
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
			}
			callback({error: error});
		}
	};
	switch (this.name) {
		case "instapaper":
			request.headers.push({title: "Authorization", value: "Basic " + btoa(utf8.encode(username) + ':' + utf8.encode(password))});
			//request.parameters.url = obj.url;
			//request.parameters.title = utf8.encode(obj.title);
			break;
		case "readitlater":
			request.parameters.username = username,
			request.parameters.password = password,
			request.parameters.apikey = "9a0T3t7bg2cH7pi2dSd4b92u89pfU8fY";		
			//request.parameters.url = obj.url;
			//request.parameters.title = utf8.encode(obj.title);	
			break;
	}

	request.parameters.url = obj.url;
	request.parameters.title = utf8.encode(obj.title);

	this.makeRequest(request);
}
