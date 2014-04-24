var Youtube = require("youtube-api");
for (var i in Youtube) {
    console.log(i);
}

var autenticated = false;

function autenticate() {
  Youtube.authenticate({
			type: "oauth",
			token: ACCESS_TOKEN
  });
  autenticated = true;
}

function getResponseActivities(options,req,res) {
	if (!autenticated) {
		autenticate();
	}

	Youtube.activities.list(options, function (err, data) {
		var response = "";
		response += "Error: " + JSON.stringify(err, null, 4) + "\n";
		response += "Data: " + JSON.stringify(data, null, 4);
		res.end(response);
	});
}

exports.listAllActivities = function(req, res) {     
	if (req.params.maxResults) { 
		var maxResults = req.params.maxResults;
    } else {
		var maxResults = 50;
    } 
    
	getResponseActivities({"part": "snippet,contentDetails", "home":true, "maxResults": maxResults},req,res);	
};

exports.listActivitiesAfter = function(req, res) { 
	getResponseActivities({"part": "snippet,contentDetails", "home":true, "maxResults": 50, "publishedAfter": req.params.date},req,res);	
};

exports.listActivitiesBefore = function(req, res) { 
	getResponseActivities({"part": "snippet,contentDetails", "home":true, "maxResults": 50, "publishedBefore": req.params.date},req,res);	
};