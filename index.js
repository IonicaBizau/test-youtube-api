var Youtube = require("youtube-api");
for (var i in Youtube) {
    console.log(i);
}
var http = require("http");
// You have to provide the credentials, first (in credentials.json file: rename .templ.json into json)
var credentials = require("./credentials");
var request = require("request");

credentials.scope = "https://www.googleapis.com/auth/youtube";
credentials.response_type = "code";
credentials.access_type = "offline";

http.createServer(function (req, res) {

    if (req.url === "/") {
        if (typeof ACCESS_TOKEN !== "undefined") {
            Youtube.authenticate({
                type: "oauth",
                token: ACCESS_TOKEN
            });

            Youtube.channels.list({"part": "id", "mySubscribers": true, "maxResults": 50}, function (err, data) {
                var response = "";
                response += "Error: " + JSON.stringify(err, null, 4) + "\n";
                response += "Data: " + JSON.stringify(data, null, 4);
                res.end(response);
            });

            return;
        }

        var authUrl = "https://accounts.google.com/o/oauth2/auth?";

        for (var key in credentials) {
            console.log(key, credentials[key]);
            if (key === "client_secret") { continue; }

            authUrl += "&" + key + "=" + credentials[key];
        }

        var html = "Click <a href='" + authUrl + "'>here</a> to get the access token.";
        res.setHeader("Content-Type", "text/html");
        res.end(html);
        return;
    }

    if (req.url.indexOf("oauth2callback") !== -1) {

        var url = req.url;

        if (url.indexOf("error") !== -1) {
            return res.end("Error.");
        }

        if (url.indexOf("?code=") === -1) {
            return res.end("Invalid request.");
        }

        var code = url;
        code = code.substring(code.indexOf("?code=") + 6);

        if (!code) {
            return res.end("Code is missing.");
        }

        var formData = "code=" + code +
                       "&client_id=" + credentials.client_id +
                       "&client_secret=" + credentials.client_secret +
                       "&redirect_uri=" + credentials.redirect_uri +
                       "&grant_type=authorization_code";

        var options = {
            url: "https://accounts.google.com/o/oauth2/token",
            headers: {'content-type' : 'application/x-www-form-urlencoded'},
            method: "POST",
            body: formData
        };

        request(options, function (err, response, body) {

            if (err) {
                return res.end(err);
            }

            try {
                body = JSON.parse(body);
            } catch (e) {
                return res.end(e.message + " :: " + body);
            }
            if (body.error) {
                return res.end(err);
            }

            // success
            if (body.access_token) {
                ACCESS_TOKEN = body.access_token;
                return res.end("Access token: " + ACCESS_TOKEN);
            }

            return res.end("Something wrong: \n" + JSON.stringify(body, null, 4));
        });

        return;
    }

    res.end("404 - Not found.");
}).listen(3000);

console.log("Open: http://localhost:3000");
