var Youtube = require("youtube-api")
  , Http = require("http")
  , Statique = require ("statique")
  , Http = require('http')
  , Request = require("request")
  , credentials = require("./credentials")
  ;

global.ACCESS_TOKEN = undefined;

// credentials
credentials.scope = "https://www.googleapis.com/auth/youtube";
credentials.response_type = "code";
credentials.access_type = "offline";

// statique config
Statique
    .server({root: __dirname + "/public"})
    .setRoutes({
        "/":       "/html/main.html"
    })
  ;

// create server
Http.createServer(function(req, res) {


    if (req.url === "/") {
        var authUrl = "https://accounts.google.com/o/oauth2/auth?";

        for (var key in credentials) {
            console.log(key, credentials[key]);
            if (key === "client_secret") { continue; }

            authUrl += "&" + key + "=" + credentials[key];
        }
        if (typeof ACCESS_TOKEN == "undefined") {
          var html = "Click <a href='" + authUrl + "'>here</a> to get the access token.";
        } else {
          var html = "You can call this REStfull links:";
          html += "<br><ul><li>/yt/activities = All activities limited to 50 results.</li>";
          html += "<li>/yt/activities/15 = All activities limited  to 15 results.</li>";
          html += "<li>/yt/activities/after/YYYY-MM-DDThh:mm:ss.sZ = All activities limited to 50 result that where published after the date expecified.</li>";
          html += "<li>/yt/activities/before/YYYY-MM-DDThh:mm:ss.sZ = All activities limited to 50 result that where published before the date expecified.</li></ul>";
          html += "<br>Click <a href='/yt/activities'>here</a> to see the list of all activities. (/yt/activities)";
        }
        res.setHeader("Content-Type", "text/html");
        res.end(html);
        return;
    }

    if (req.url === "/oauth2callback") {
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

        Request(options, function (err, response, body) {

            if (err) {
                return res.end(err);
            }

            try {
                body = JSON.parse(body);
            } catch (e) {
                return res.end(e.message + " :: " + body);
            }
            if (body.error) {
                return res.end(err || body.error);
            }

            // success
            if (body.access_token) {
                ACCESS_TOKEN = body.access_token;
                var html = "Click <a href='/'>here</a> to go back.</br> Access token: " + ACCESS_TOKEN;
                res.setHeader("Content-Type", "text/html");
                return res.end(html);
            }

            return res.end("Something wrong: \n" + JSON.stringify(body, null, 4));
        });
    }

    Statique.serve (req, res);
}).listen(5000);

// output
console.log("Open: http://localhost:5000");

