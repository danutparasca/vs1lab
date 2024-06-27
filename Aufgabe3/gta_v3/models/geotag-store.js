// File origin: VS1LAB A3

const GeoTag = require("./geotag");
const GeoTagExamples = require("./geotag-examples");

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * A class for in-memory-storage of geotags
 * 
 * Use an array to store a multiset of geotags.
 * - The array must not be accessible from outside the store.
 * 
 * Provide a method 'addGeoTag' to add a geotag to the store.
 * 
 * Provide a method 'removeGeoTag' to delete geo-tags from the store by name.
 * 
 * Provide a method 'getNearbyGeoTags' that returns all geotags in the proximity of a location.
 * - The location is given as a parameter.
 * - The proximity is computed by means of a radius around the location.
 * 
 * Provide a method 'searchNearbyGeoTags' that returns all geotags in the proximity of a location that match a keyword.
 * - The proximity constrained is the same as for 'getNearbyGeoTags'.
 * - Keyword matching should include partial matches from name or hashtag fields. 
 */
class InMemoryGeoTagStore{
    #allAvailableGeoTags = [];
    constructor() {
        for (const element of GeoTagExamples.tagList) {
            const tag = new GeoTag(element[0], element[1], element[2], element[3]);
            this.#allAvailableGeoTags.push(tag);
        }
        console.log(this.#allAvailableGeoTags)
    }

    addGeoTag(geoTag){
        console.log("HIER", geoTag)
        this.#allAvailableGeoTags.push(geoTag);
    }

    removeGeoTag(name){
        this.#allAvailableGeoTags = this.#allAvailableGeoTags.filter(tag => tag.name !== name);
    }

    getNearbyGeoTags(geoTag, radius){
        console.log("Radius:", radius);
        console.log("GeoTag:", geoTag);
        return this.#allAvailableGeoTags.filter(tag => {
            const distance = this._calculateDistance(geoTag.latitude, geoTag.longitude, tag.latitude, tag.longitude);
            console.log("Distance:", distance);
            return distance <= radius;
        });
    }
    
    searchNearbyGeoTags(request, radius){
        console.log("Request:", request)
        const helperTag = new GeoTag;
        helperTag.latitude = request.latitude;
        helperTag.longitude = request.longitude;
        const nerabyTags = this.getNearbyGeoTags(helperTag, radius);
        console.log("nearbyTags:", nerabyTags)
        const matchingTags = nerabyTags.filter(tag => {
            const nameMatches = tag.name.toLowerCase().includes(request.keyword.toLowerCase());
            const hashtagMatches = tag.hashtag.toLowerCase().includes(request.keyword.toLowerCase());
            return nameMatches || hashtagMatches;
        })
        console.log("matchingTags:", matchingTags)
        return matchingTags;
    }

    _calculateDistance(lat1, lon1, lat2, lon2) {
        const dLat = this._deg2rad(lat2 - lat1);
        const dLon = this._deg2rad(lon2 - lon1);
        const a = Math.pow(Math.sin(dLat / 2.0), 2) + Math.pow(Math.sin(dLon / 2.0), 2) * Math.cos(this._deg2rad(lat1)) * Math.cos(this._deg2rad(lat2));
        const dist = 6378.388 * 2.0 * Math.atan2(Math.sqrt(a), Math.sqrt(1.0 - a));
        return dist;
    }

    _deg2rad(deg) {
        return deg * (Math.PI / 180);
    }

}

module.exports = InMemoryGeoTagStore
