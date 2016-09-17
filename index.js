const request = require("request");
const fs = require("fs");
const feeds = ["./data/station_information.json", "./data/station_status.json", "./data/system_information.json"];

module.exports = {

  FeatureCollection: (system_info) => {
    if (system_info === undefined) {
      return {
        "type": "FeatureCollection",
        "system_info": undefined,
        "features": []
      };
    } else {
      if (typeof(system_info) !== 'object') {
        throw new TypeError("Failed to create Feature, invalid JSON input.");
      }
      if(system_info.hasOwnProperty('length')) {
        throw new TypeError("Failed to create Feature, invalid JSON input.");
      }
      return {
        "type": "FeatureCollection",
        "system_info": system_info,
        "features": []
      };

    }

  },

  Feature: (station_info) => {

    if (typeof(station_info) !== 'object') {
      throw new TypeError("Failed to create Feature, invalid JSON input.");
    }
    if(station_info.hasOwnProperty('length')) {
      throw new TypeError("Failed to create Feature, invalid JSON input.");
    }
    return {
      "type": "Feature",
      "station_id": station_info.station_id,
      "geometry": {
        "type": "Point",
        "coordinates": [station_info.lon, station_info.lat]
      },
      "properties": {
        "station_info": station_info,
        "station_status": undefined
      }
    };

  },

  getCachedStationJson: (path, callback) => {
    fs.readFile(path, (err, stationJson) => {
      let stations = stationJson.data.stations;
      callback(stations)
    });
  },

  getCachedSystemJson: (path, callback) => {
    fs.readFile(path, (err, systemJson) => {
      let systemInfo = systemJson.data;
      callback(systemInfo)
    });
  },

  updateStationStatus: (featureCollection) => {
    exports.getCachedStationJson(feeds[1], (statusUpdate) => {
      for (update of statusUpdate) {
        let id = update.station_id;
        for (station of featureCollection.features) {
          if (id = station.station_id) {
            station.properties.station_status = update;
          }
        }
      }
    })

  },

  buildFeatureCollection: () => {
    // Generate base FeatureCollection
    const fc = undefined;
    exports.getCachedSystemJson(feeds[2], (data) => {
      fc = exports.FeatureCollection(data);
    });
    // Get Station Information
    exports.getCachedStationJson(feeds[0], (stations) => {
      for (station of stations) {
        // Use System Information to create Features and push them to the FC
        fc.features.push(Feature(station));
      }
    });
    // Get Station Status
    exports.updateStationStatus(fc);
  }
};
