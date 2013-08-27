var Youtube = require("youtube-api");
var http = require("http");
// You have to provide the credentials, first (in credentials.json file: rename .templ.json into json)
var credentials = require("./credentials");
var request = require("request");

credentials.scope = "https://www.googleapis.com/auth/youtube";
credentials.response_type = "code";
credentials.access_type = "offline";

http.createServer(function (req, res) {

    if (req.url === "/") {
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
                       "&client_secret" + credentials.client_secret +
                       "&redirect_uri" + credentials.redirect_uri +
                       "&grant_type=authorization_code";

        var options = {
            url: "https://accounts.google.com/o/oauth2/token",
            method: "POST",
            form: formData,
            multipart: [
                {
                    "content-type": 'application/x-www-form-urlencoded',
                    body: formData
                }
            ]
        };

        request(options, function (err, res, body) {
            if (err) {
                return res.end(err);
            }
            if (res.code === 200) {
                return res.end(body);
            }

            return res.end("Something wrong...");
        });

        return;
    }

    res.end("404 - Not found.");
}).listen(3000);

console.log("Open: http://localhost:3000");
