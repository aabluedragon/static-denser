# static-denser

An express middleware for serving pixel density named files, meant to work with the express static middleware.

Adding this middleware will add the following logic for file serving:
1. If file.jpg is requested by a device with a DPR (devicePixelRatio) of 2,
then express will first see if file@2x.jpg exists, if it doesn't exist, it will server file.jpg,
if it exists, it will serve file@2x.jpg even though "file.jpg" was requested.

By the way, it works with all types of files, not only images!

##### How does it know the DPR value?
The middlewhere takes the DPR param one path after the attached url,
e.g if you attach it to /myfiles, the middleware will take it from /myfiles/:dpr.
no need to type the ":dpr" param, just attach normally.

```javascript
var staticDenser = require('./static_denser/static-denser');
var assetsFolderDir = "public";
app.use("/myapp", staticDenser(assetsFolderDir), express.static(assetsFolderDir,{}));
```

In this case, opening the url "/myapp/2/main.jpg",
will actually try to open the url "/myapp/main@2x.jpg" (In the file system: /public/main@2x.jpg).
If it's not there it will open "/myapp/main.jpg" (In the file system: /public/main.jpg).

"Normal" URLs without the DPR param will also work: /myapp/main.jpg (that will always serve main.jpg).

##### Why use this middleware and not media queries?
Because we want to use appcache, and not cache all pixel density files for our client,
If we connect using a device with a DPR of 1, we don't want to cache the @2x images as well, we want to save space.
See Appcache space limitations: http://www.html5rocks.com/en/tutorials/offline/quota-research/
