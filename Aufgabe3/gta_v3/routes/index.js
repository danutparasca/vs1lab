// File origin: VS1LAB A3

/**
 * This script defines the main router of the GeoTag server.
 * It's a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * Define module dependencies.
 */

const express = require('express');
const app = express();
const router = express.Router();
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
/**
 * The module "geotag" exports a class GeoTagStore. 
 * It represents geotags.
 * 
 * TODO: implement the module in the file "../models/geotag.js"
 */
// eslint-disable-next-line no-unused-vars
const GeoTag = require('../models/geotag');
const LocationHelper = require('../public/javascripts/location-helper')

/**
 * The module "geotag-store" exports a class GeoTagStore. 
 * It provides an in-memory store for geotag objects.
 * 
 * TODO: implement the module in the file "../models/geotag-store.js"
 */
// eslint-disable-next-line no-unused-vars
const InMemoryGeoTagStore = require('../models/geotag-store');
const geoTagStore = new InMemoryGeoTagStore();



/**
 * Route '/' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests cary no parameters
 *
 * As response, the ejs-template is rendered without geotag objects.
 */

// TODO: extend the following route example if necessary
router.get('/', (req, res) => {
  const helpingTag = new GeoTag;
  //helpingTag.latitude = 48.9374;
  //helpingTag.longitude = 8.4027;
  // TODO: sollte eigentlich die aktuelle Location sein, der LocHelper gönnt aber nichts außer errors EDIT: brauchen wir nicht?
  res.render('index', { taglist: geoTagStore.getNearbyGeoTags(helpingTag, 1000), searchInput: ""})
});

/**
 * Route '/tagging' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests cary the fields of the tagging form in the body.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * Based on the form data, a new geotag is created and stored.
 *
 * As response, the ejs-template is rendered with geotag objects.
 * All result objects are located in the proximity of the new geotag.
 * To this end, "GeoTagStore" provides a method to search geotags 
 * by radius around a given location.
 */

// TODO: ... your code here ...
router.post('/tagging', (req, res) => {
  geoTagStore.addGeoTag(req.body);
  res.render('index', { taglist: geoTagStore.getNearbyGeoTags(req.body, 1000), searchInput: ""})
});

/**
 * Route '/discovery' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests cary the fields of the discovery form in the body.
 * This includes coordinates and an optional search term.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * As response, the ejs-template is rendered with geotag objects.
 * All result objects are located in the proximity of the given coordinates.
 * If a search term is given, the results are further filtered to contain 
 * the term as a part of their names or hashtags. 
 * To this end, "GeoTagStore" provides methods to search geotags 
 * by radius and keyword.
 */

// TODO: ... your code here ...
router.post('/discovery', (req, res) => {
  res.render('index', { taglist: geoTagStore.searchNearbyGeoTags(req.body, 1000), searchInput: req.body.keyword})
});


module.exports = geoTagStore;
module.exports = router;
