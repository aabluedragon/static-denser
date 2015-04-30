# static-denser

A [Node](https://nodejs.org) Express middleware for serving pixel density named files, meant to work with the express static middleware.

`npm install static-denser`

Adding this middleware will add the following logic for file serving:

1. file.jpg is requested by some html file running on a device with DPR (window.devicePixelRatio) of 2 for example (requested by AppCache, html img tag or anything else).
2. The middleware reads the "2" DPR value from the URL (see how in the example below).
3. The middleware will ask the express.static middleware to serve file@2x.jpg if it exists, or file.jpg if it does not.

By the way, it works with all types of files, not only images!

##### How does it receive the DPR value?
The middlewhere takes the DPR param one path after the attached url,
e.g if you attach it to /myfiles, the middleware will take it from /myfiles/:dpr.
no need to type the ":dpr" param, just attach normally by calling `.use(...)`.

```javascript
var staticDenser = require('/static-denser');
var assetsFolderDir = "public";
app.use("/myapp", staticDenser(assetsFolderDir), express.static(assetsFolderDir,{}));
```

In this case, opening the url "/myapp/2/main.jpg",
will actually try to open the url "/myapp/main@2x.jpg" (In the file system: /public/main@2x.jpg).
If it's not there it will open "/myapp/main.jpg" (In the file system: /public/main.jpg).

"Normal" URLs without the DPR param will also work: /myapp/main.jpg (that will always serve main.jpg).

##### Syntax & Optional Parameters:
```javascript
staticDenser("public", {dpiPrefix:"@", dpiSuffix:"x"});
```
The "@" prefix and "x" suffix are the default, no need to pass them, however you can use your own values.
The "public" is the recommended file system path to put your resources.

##### Why use this middleware and not media queries?
Because we want to use appcache, and not cache all pixel density files for our client,
If we connect using a device with a DPR of 1, we don't want to cache the @2x images as well, we want to save space.
See appcache limitations: http://www.html5rocks.com/en/tutorials/offline/quota-research/

##### Why create virtual URL paths and not use cookies?
Cordova does not support cookies.

##### Recommended flow for SPA web apps
Create an "index.html" file that will serve as a "redirector" page, the sole purpose of this html file
is to determine the `window.devicePixelRatio` value and redirect to the corresponding url (e.g main.html), attaching this value as part of the url path.
See a working example of this flow in the demo below.

##### A full working example
[static-denser-demo](https://github.com/aabluedragon/static-denser-demo)
