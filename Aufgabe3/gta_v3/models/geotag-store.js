// File origin: VS1LAB A3

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

const GeoTagExamples = require("./geotag-examples");
const GeoTag = require("./geotag");

class InMemoryGeoTagStore{

    // TODO: ... your code here ...
    constructor() {
        this.geoTagArray = [];
    }

    addGeoTag(geoTag) {
        this.geoTagArray.push(geoTag);
    }

    removeGeoTag(name) {
        this.geoTagArray = this.geoTagArray.filter(tag => tag.name !== name);
    }

    getNearbyGeoTags(latitude, longitude, radius = 10.0) {
        let fGeoTag = []; //found geotags
        for (let i = 0; i < this.geoTagArray.length; i++) {
            const currentTag = this.geoTagArray[i];
            const distance = this.calculateDistance(latitude, longitude, currentTag.latitude, currentTag.longitude);
        
            if (distance <= radius) {
                fGeoTag.push(currentTag);
            }
        }
        return fGeoTag;

    }

    searchNearbyGeoTags(keyword, latitude, longitude, radius = 10.0) {
        let nGeoTag = this.getNearbyGeoTags(latitude, longitude, radius); // nearby geotags
        let fGeoTag = []; //found geotags

        for (let i = 0; i < nGeoTag.length; i++) {
            const name = nGeoTag[i].getName();
            const hashtag = nGeoTag[i].getHashtag();
            
            if (name.includes(keyword) || hashtag.includes(keyword)) {
                fGeoTag.push(nGeoTag[i]);
            }
        }

        return fGeoTag;
    }



    /**
     * Calculates the distance between two geographic coordinates in kilometers
     * @param {number} lat1 - The latitude of the first coordinate
     * @param {number} lon1 - The longitude of the first coordinate
     * @param {number} lat2 - The latitude of the second coordinate
     * @param {number} lon2 - The longitude of the second coordinate
     * @returns {number} The distance between the two coordinates in kilometers
     */
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;

        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }

    getAllGeoTags() {
        let allGeoTags = [];
        for (let i = 0; i < this.geoTagArray.length; i++) {
            allGeoTags.push(this.geoTagArray[i]);
        }
        return allGeoTags;
    }

    getExampleGeoTags() {
        const tagList = GeoTagExamples.tagList;
        tagList.forEach((tag) => {
            this.addGeoTag(new GeoTag(tag[0], tag[1], tag[2], tag[3]));
        });
    }

}

module.exports = InMemoryGeoTagStore
