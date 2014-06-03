# NodeJS Youtube API Test
Test application that tests Youtube API NodeJS module.

## Screenshot
>![](http://i.imgur.com/2B32IcZ.png)

## Before you start

1. You need a [Google Account](https://www.google.com/accounts/NewAccount) to access the Google APIs Console, request an API key, and register your application.

1. [Register your application](https://developers.google.com/youtube/registering_an_application)  with Google so that it can submit API requests.

1. After registering your application, select the YouTube Data API as one of the services that your application uses:
 - Go to the [APIs Console](https://code.google.com/apis/console/) and select the project that you just registered.
 - Click on the Services pane.
 - In the list of APIs, find the **YouTube Data API and change** its status to ON.

1. Familiarize yourself with the core concepts of the JSON (JavaScript Object Notation) data format. JSON is a common, language-independent data format that
provides a simple text representation of arbitrary data structures. For more information, see [json.org](http://json.org/).

[[from documentation]](https://developers.google.com/youtube/v3/getting-started)

## Installation

2. Download this repository using:

 ```
 git clone http://github.com/brilvio/test-youtube-api
 ```

2. Enter in the downloaded directory and run `npm install`:

 ```
 cd test-youtube-api
 npm install
 ```

2. Go to your [Google apps](https://code.google.com/apis/console/b/0/) and select your application.

2. Select **`API Access`** option, like in the screen shot:

 >![](https://raw.github.com/brilvio/test-youtube-api/master/images/1.png)

2. Then create an **OAuth 2.0 client ID**.

 >![](https://raw.github.com/brilvio/test-youtube-api/master/images/2.png)

2. Complete the required fields:

 - Product name: what ever you want (e.g. "Youtube API Test")
 - Product logo is optional
 - Home page is optional

2. Click **Next** button.
2. Select **Web application** option.
2. Set the **site or hostname** as `localhost:5000`, so the redirect uri will be: `http://localhost:5000/oauth2callback`
2. Click **Create client ID** button.
1. Rename `credentials.templ.json` into `credentials.json`.
2. Open `credentials.json` and replace `yourClientId` with the **client id** and `yourSecretKey` with **client secret** generated in the step 10.
2. Now you are ready. Start the script and open `http://localhost:5000`.

 ```
 node index.js
 ```

Then open `localhost:5000` in your browser and start testing the module.
