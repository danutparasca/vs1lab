// File origin: VS1LAB A3, A4

/**
 * This script defines the main router of the GeoTag server.
 * It's a template for exercises VS1lab/Aufgabe3 and Aufgabe4
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
app.use(express.json());

/**
 * The module "geotag" exports a class GeoTag. 
 * It represents geotags.
 */
// eslint-disable-next-line no-unused-vars
const GeoTag = require('../models/geotag');

/**
 * The module "geotag-store" exports a class GeoTagStore. 
 * It provides an in-memory store for geotag objects.
 */
// eslint-disable-next-line no-unused-vars
const InMemoryGeoTagStore = require('../models/geotag-store');
const geoTagStore = new InMemoryGeoTagStore();

/**
 * The module "location-helper" provides helper functions for geolocation.
 */
const LocationHelper = require('../public/javascripts/location-helper');

/**
 * Route '/' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests carry no parameters
 *
 * As response, the ejs-template is rendered without geotag objects.
 */
router.get('/', (req, res) => {
  res.render('index', { taglist: geoTagStore.getAllGeoTags(), searchInput: "" });
});

/**
 * Route '/tagging' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests carry the fields of the tagging form in the body.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * Based on the form data, a new geotag is created and stored.
 *
 * As response, the ejs-template is rendered with geotag objects.
 * All result objects are located in the proximity of the new geotag.
 * To this end, "GeoTagStore" provides a method to search geotags 
 * by radius around a given location.
 */
router.post('/tagging', (req, res) => {
  const { name, latitude, longitude, hashtag } = req.body;
  const newTag = new GeoTag(name, latitude, longitude, hashtag);
  geoTagStore.addGeoTag(newTag);
  res.render('index', { taglist: geoTagStore.getNearbyGeoTags({ latitude, longitude }, 1000), searchInput: "" });
});

/**
 * Route '/discovery' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests carry the fields of the discovery form in the body.
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
router.post('/discovery', (req, res) => {
  const { latitude, longitude, keyword } = req.body;
  const results = geoTagStore.searchNearbyGeoTags({ latitude, longitude, keyword }, 1000);
  res.render('index', { taglist: results, searchInput: keyword });
});

// API routes (A4)

/**
 * Route '/api/geotags' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the fields of the Discovery form as query.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * As a response, an array with Geo Tag objects is rendered as JSON.
 * If 'searchterm' is present, it will be filtered by search term.
 * If 'latitude' and 'longitude' are available, it will be further filtered based on radius.
 */
router.get('/api/geotags', (req, res) => {
  const { searchterm, latitude, longitude } = req.query;
  let results = geoTagStore.getAllGeoTags();

  if (latitude && longitude) {
    results = geoTagStore.getNearbyGeoTags({ latitude, longitude }, 1000);
  }

  if (searchterm) {
    results = results.filter(tag => 
      tag.name.includes(searchterm) || tag.hashtag.includes(searchterm)
    );
  }

  res.json(results);
});

/**
 * Route '/api/geotags' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * The URL of the new resource is returned in the header as a response.
 * The new resource is rendered as JSON in the response.
 */
router.post('/api/geotags', (req, res) => {
  const { name, latitude, longitude, hashtag } = req.body;
  const newTag = new GeoTag(name, latitude, longitude, hashtag);
  geoTagStore.addGeoTag(newTag);
  res.location(`/api/geotags/${newTag.id}`).status(201).json(newTag);
});

/**
 * Route '/api/geotags/:id' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * The requested tag is rendered as JSON in the response.
 */
router.get('/api/geotags/:id', (req, res) => {
  const geoTag = geoTagStore.getGeoTagById(parseInt(req.params.id));
  if (geoTag) {
      res.json(geoTag);
  } else {
      res.status(404).send("GeoTag not found");
  }
});

/**
 * Route '/api/geotags/:id' for HTTP 'PUT' requests.
 * (http://expressjs.com/de/4x/api.html#app.put.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 * 
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * Changes the tag with the corresponding ID to the sent value.
 * The updated resource is rendered as JSON in the response. 
 */
router.put('/api/geotags/:id', (req, res) => {
  const id = parseFloat(req.params.id);
  const updatedGeoTag = req.body;
  geoTagStore.updateGeoTag(id, updatedGeoTag);
  const geoTag = geoTagStore.getGeoTagById(id);
  if (geoTag) {
      res.json(geoTag);
  } else {
      res.status(404).send("GeoTag not found");
  }
});

/**
 * Route '/api/geotags/:id' for HTTP 'DELETE' requests.
 * (http://expressjs.com/de/4x/api.html#app.delete.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * Deletes the tag with the corresponding ID.
 * The deleted resource is rendered as JSON in the response.
 */
router.delete('/api/geotags/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const geoTag = geoTagStore.getGeoTagById(id);
  if (geoTag) {
      geoTagStore.removeGeoTag(id);
      res.json(geoTag);
  } else {
      res.status(404).send("GeoTag not found");
  }
});

module.exports = router;