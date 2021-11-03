'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "5b0a3e93bdc616aaf86e4b277ac2d0ee",
"assets/assets/icons/download.png": "b838cde319b5a43a360f2d339e9553cd",
"assets/assets/icons/github.png": "4592fbbbdb41ac335f6bd16f246c718e",
"assets/assets/icons/linkedin.png": "bb7da33333c357d8de747c8534cfd4e0",
"assets/assets/icons/mail.png": "57431698fd4ff15bbc47bbcdf20cad9e",
"assets/assets/images/aws.png": "df853f612ce56f8e73cbf528c9d153f8",
"assets/assets/images/block.png": "eedc72ec4385f8ad1a96df86f43ccdb8",
"assets/assets/images/bootstrap.png": "42bd98e1b13f3493b0a6586a59164921",
"assets/assets/images/C.png": "82c9d40a74cd061aeb79913629d80d6b",
"assets/assets/images/css3.png": "982f018bbd06a1d705482d3250779c86",
"assets/assets/images/dart.png": "61eb0be9e5d26fc78558f634d5bd89e7",
"assets/assets/images/deloitte.png": "91cf7931c1a6c5952b96274a29d464f8",
"assets/assets/images/django.png": "372b39ecdd10da9847e19c990c691fa2",
"assets/assets/images/docker.png": "4ea9d619752d466180fc0b10b9d542c3",
"assets/assets/images/firebase.png": "8972ba7d2323ec59f52437545b060c70",
"assets/assets/images/flutter.png": "5b26614dbdbcf4b3ecb80bed00ad3702",
"assets/assets/images/git.png": "35a8e7942a17dded45467100cc9d2589",
"assets/assets/images/heroku.png": "ed8df179419bc56abd330908ac9f2388",
"assets/assets/images/html5.png": "7d3430b5ae2b5df7afc484500be5923e",
"assets/assets/images/java.png": "2f9a11dcc2e4c3b89d8f6016befa0d7e",
"assets/assets/images/javascript.png": "5dfc64a8540882ccfe060ea64954b977",
"assets/assets/images/kubernetes.png": "e95f0b5a5a58a4607223ca0810e4a618",
"assets/assets/images/linux.png": "d0d0de690bb316f62896860b2675784c",
"assets/assets/images/mysql.png": "52255c5944c1c7cce2be81c1573e060d",
"assets/assets/images/nitp.png": "4d0561b4b95dfa93a3590ed7708c7906",
"assets/assets/images/postman.png": "8bf64f65976a0aa603a9a63e32e89a60",
"assets/assets/images/python.png": "692e0e241a52eab20c5518ff0da87821",
"assets/assets/images/sasi.png": "67f1091ac3d137d7045c79ce2ebc4439",
"assets/assets/images/shanmukkha.png": "7b65b1b81b9fdb5e36f63dbbdb736650",
"assets/assets/images/springio.png": "e42def23d1d8832c5345003add0c834b",
"assets/assets/images/sqlite.png": "2cca85dad47077a5421227eee09637c0",
"assets/assets/images/sss.png": "f46de4dddec1177a08d6ea65f28f4c96",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/fonts/MaterialIcons-Regular.otf": "4e6447691c9509f7acdbf8a931a85ca1",
"assets/NOTICES": "8d863c2c38cf1cc0c9444a70893b21a9",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"favicon.png": "ff85486460c620cc8648a1d5b959d0b0",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"index.html": "f29f525301162828f7e02ee5559a1f8d",
"/": "f29f525301162828f7e02ee5559a1f8d",
"main.dart.js": "f5a090f0553c59824f43e7266f00688a",
"manifest.json": "6b7e74f52d4ab907b1455a7d398d0f20",
"README.md": "c53000c238de58bf124f7c4ade23a3bc",
"version.json": "f2879aea34826fc1706a44d54695e173"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
