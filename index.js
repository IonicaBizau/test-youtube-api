"use strict";

// Dependencies
const Youtube = require("youtube-api")
    , Lien = require("lien")
    , Logger = require("bug-killer")
    , opn = require("opn")
    , readJson = require("r-json")
    , path = require("path")
    , tryAsync = require("try-async")
    ;

const credentials = readJson(`${__dirname}/credentials.json`)

// Set ACCESS_TOKEN global as undefined
const CREDENTIALS = readJson(`${__dirname}/credentials.json`);

// Init lien server
let server = new Lien({
    host: "localhost"
  , port: 5000
  , public: `${__dirname}/public`
});

server.on("load", err => {
    if (err) throw err;
    opn("http://localhost:5000");
});

// Authenticate
// You can access the Youtube resources via OAuth2 only.
// https://developers.google.com/youtube/v3/guides/moving_to_oauth#service_accounts
let oauth = Youtube.authenticate({
    type: "oauth"
  , client_id: CREDENTIALS.web.client_id
  , client_secret: CREDENTIALS.web.client_secret
  , redirect_url: CREDENTIALS.web.redirect_uris[0]
});

let authDone = false;

// Handle oauth2 callback
server.addPage("/oauth2callback", lien => {
    oauth.getToken(lien.query.code, (err, tokens) => {

        if (err) {
            lien.lien(err, 400);
            return Logger.log(err);
        }

        oauth.setCredentials(tokens);
        authDone = true;

        lien.redirect("/");
    });
});

server.addPage("/", lien => {
    if (!authDone) {
        return lien.redirect(oauth.generateAuthUrl({
            access_type: "offline"
          , scope: ["https://www.googleapis.com/auth/youtube"]
        }));
    }

    lien.file("html/index.html");
});

server.addPage("/api/run_code", "post", lien => {

    if (!authDone) {
        return lien.apiError("Please authenticate.", 403);
    }

    global.__api_run_code_callback = function (err, data) {
        if (err) {
            return lien.apiError(err);
        }
        return lien.end(data);
    };

    let formData = lien.data.code.replace(/_CALLBACK/g, "__api_run_code_callback");
    tryAsync(() => {
        eval(formData);
    }, err => {
        if (err) { return lien.end(err, 400); }
    });
});
