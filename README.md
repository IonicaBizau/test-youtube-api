
# YouTube API Test Application

 [![PayPal](https://img.shields.io/badge/%24-paypal-f39c12.svg)][paypal-donations] [![AMA](https://img.shields.io/badge/ask%20me-anything-1abc9c.svg)](https://github.com/IonicaBizau/ama) [![Version](https://img.shields.io/npm/v/test-youtube-api.svg)](https://www.npmjs.com/package/test-youtube-api) [![Downloads](https://img.shields.io/npm/dt/test-youtube-api.svg)](https://www.npmjs.com/package/test-youtube-api) [![Get help on Codementor](https://cdn.codementor.io/badges/get_help_github.svg)](https://www.codementor.io/johnnyb?utm_source=github&utm_medium=button&utm_term=johnnyb&utm_campaign=github)

> Test Youtube API NodeJS module


This is an example application how to use the [`youtube-api`](https://github.com/IonicaBizau/youtube-api) library and explore the YouTube API resources.

## Before you start

 1. You need a [Google Account](https://www.google.com/accounts/NewAccount) to access the Google APIs Console, request an API key, and register your application.
 2. [Register your application](https://console.developers.google.com/project) with Google so that it can submit API requests:
 3. After registering your application, select **YouTube Data API** as one of the services that your application uses.

     - Go to the [APIs Console](https://console.developers.google.com/project) and select the project that you just registered.
     - Click on *APIs & auth* on the left side. Then a dropdown will be opened.
     - Select *APIs*.
     - Search for *YouTube Data API v3*, click it and click <kbd>Enable API</kbd>



## Installation and usage

 1. Download this repository by running:
    ```sh
    git clone http://github.com/IonicaBizau/test-youtube-api
    ```
 2. Enter in the downloaded directory and run `npm install`:
    ```sh
    cd test-youtube-api
    npm install
    ```
 3. Go back in your Google app and click again on *APIs & auth* and then select *Credentials*.
 4. Click <kbd>Create new Client ID</kbd>. This will create new OAuth 2.0 credentials:

     - Select *Web application*
     - Click <kbd>Configure consent screen</kbd>
     - Complete the required fields:

         - Product name: what ever you want (e.g. "Youtube API Test")
         - Product logo is optional
         - Home page is optional
         - Save the changes

     - Now you will have to set the auth urls. This test application uses the following urls:

         - Authorized JavaScript origins: `http://localhost:5000/` (paste it in the first textarea)
         - Authorized redirect URIs: `http://localhost:5000/oauth2callback` (paste it in the second textarea)

     - Finally, click <kbd>Create Client ID</kbd>


OK, at this step you have the credentials (in your Google app). Now you have to use them in this test application:

 1. Rename `credentials.templ.json` into `credentials.json`.
 2. Open `credentials.json` and replace `yourClientId` with the **client id** and `yourSecretKey` with **client secret** generated previously.
 3. Now you are ready. Start the script (`npm start`) and open `http://localhost:5000`.


## :yum: How to contribute
Have an idea? Found a bug? See [how to contribute][contributing].


## :scroll: License

[MIT][license] © [Ionică Bizău][website]

[paypal-donations]: https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=RVXDDLKKLQRJW
[donate-now]: http://i.imgur.com/6cMbHOC.png

[license]: http://showalicense.com/?fullname=Ionic%C4%83%20Biz%C4%83u%20%3Cbizauionica%40gmail.com%3E%20(http%3A%2F%2Fionicabizau.net)&year=2013#license-mit
[website]: http://ionicabizau.net
[contributing]: /CONTRIBUTING.md
[docs]: /DOCUMENTATION.md
