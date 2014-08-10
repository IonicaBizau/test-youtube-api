var Youtube = require("youtube-api")
  , Http = require("http")
  , Statique = require ("statique")
  , Http = require('http')
  , Request = require("request")
  , credentials = require("./credentials")
  , path = require("path")
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
        "/": function rootPage(req, res) {

            var authType = credentials.auth_uri ? "oauth" : "jwt";
            if (authType === "jwt" && !ACCESS_TOKEN) {
                ACCESS_TOKEN = true;
                return Youtube.authenticate({
                    type: "jwt"
                  , email: credentials.email
                  , keyFile: path.normalize(credentials.keyFile)
                  , key: credentials.key
                  , subject: credentials.subject
                  , scopes: [credentials.scope]
                }).authorize(function (err, data) {
                    if (err) { return Statique.error(req, res, 500, err.toString()); }
                    console.log(err, data);
                    rootPage(req, res);
                });
            }

            if (ACCESS_TOKEN) {
                return Statique.readFile("/html/index.html", function (err, content) {
                    Statique.sendRes(res, 400, "text/html", content);
                });
            }

            var authUrl = "https://accounts.google.com/o/oauth2/auth?";

            for (var key in credentials) {
                console.log(key, credentials[key]);
                if (key === "client_secret") { continue; }

                authUrl += "&" + key + "=" + credentials[key];
            }

            res.writeHead(302, {
                "Location": authUrl
            });
            res.end();
            return;
        }
      , "/api/run_code": function (req, res) {

            var formData = ""
              , error = ""
              ;

            req.on("data", function (data) {
                formData += data;
            });

            req.on("error", function (data) {
                error += data;
            });

            req.on("end", function (data) {

                if (error) {
                    return Statique.sendRes(res, 400, "text/html", error);
                }

                global.__api_run_code_callback = function (err, data) {
                    if (err) {
                        return Statique.sendRes(res, 400, "text", JSON.stringify(err));
                    }
                    return Statique.sendRes(res, 200, "text/json", JSON.stringify(data, null, 2));
                };

                formData = formData.replace("_CALLBACK", "__api_run_code_callback");
                try {
                    eval(formData);
                } catch (e) {
                    return Statique.sendRes(res, 400, "text", e.message);
                }
            });
        }
      , "/oauth2callback": function (req, res) {
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
                    Youtube.authenticate({
                        type: "oauth",
                        token: ACCESS_TOKEN
                    });

                    res.writeHead(302, {
                        "Location": "/"
                    });
                    res.end();
                }

                return res.end("Something wrong: \n" + JSON.stringify(body, null, 4));
            });
        }
    })
  ;

// create server
Http.createServer(function(req, res) {
    Statique.serve (req, res);
}).listen(5000);

// output
console.log("Open: http://localhost:5000");

