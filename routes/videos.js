var Youtube = require("youtube-api");
for (var i in Youtube) {
    console.log(i);
}

exports.listAllActivities = function(req, res) { 
     Youtube.authenticate({
			type: "oauth",
			token: ACCESS_TOKEN
		});

		Youtube.activities.list({"part": "snippet,contentDetails", "home":true, "maxResults": 50}, function (err, data) {
			var response = "";
			response += "Error: " + JSON.stringify(err, null, 4) + "\n";
			response += "Data: " + JSON.stringify(data, null, 4);
			res.end(response);
		});
};