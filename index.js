const request = require("request");
const fs = require("fs");


// module.exports = {
//
//   FeatureCollection: (system_info) => {
//     if (system_info === undefined) {
//       return {
//         "type": "FeatureCollection",
//         "system_info": undefined,
//         "features": []
//       };
//     } else {
//       if (typeof(system_info) !== 'object') {
//         throw new TypeError("Failed to create Feature, invalid JSON input.");
//       }
//       if(system_info.hasOwnProperty('length')) {
//         throw new TypeError("Failed to create Feature, invalid JSON input.");
//       }
//       return {
//         "type": "FeatureCollection",
//         "system_info": system_info,
//         "features": []
//       };
//
//     }
//
//   },
//
//   Feature: (station_info) => {
//
//     if (typeof(station_info) !== 'object') {
//       throw new TypeError("Failed to create Feature, invalid JSON input.");
//     }
//     if(station_info.hasOwnProperty('length')) {
//       throw new TypeError("Failed to create Feature, invalid JSON input.");
//     }
//     return {
//       "type": "Feature",
//       "station_id": station_info.station_id,
//       "geometry": {
//         "type": "Point",
//         "coordinates": [station_info.lon, station_info.lat]
//       },
//       "properties": {
//         "station_info": station_info,
//         "station_status": undefined
//       }
//     };
//
//   },
//
//   getCachedStationJson: (path, callback) => {
//     fs.readFile(path, "utf-8", (err, stationJson) => {
//       if (err) {
//         return console.err(err);
//       }
//       let stations = stationJson.data.stations;
//       callback(stations)
//     });
//   },
//
//   getCachedSystemJson: (path, callback) => {
//     fs.readFile(path, "utf-8", (err, systemJson) => {
//       if (err) {
//         return console.err(err);
//       }
//       let systemInfo = systemJson.data;
//       callback(systemInfo);
//     });
//   },
//
//   // updateStationStatus: (featureCollection) => {
//   //   exports.getCachedStationJson(feeds[1], (statusUpdate) => {
//   //     for (update of statusUpdate) {
//   //       let id = update.station_id;
//   //       for (station of featureCollection.features) {
//   //         if (id = station.station_id) {
//   //           station.properties.station_status = update;
//   //         }
//   //       }
//   //     }
//   //   })
//   //
//   // },
//
//
//
//
// // LIVE
//
//   getStationJson: function(url, callback) {
//     request(url, (err, res, body) => {
//       if (!error && res.statusCode == 200) {
//         callback(body.data.stations)
//       } else if (err) {
//         return console.err(err);
//       }
//     });
//   },
//
//   getSystemJson: function(url, callback) {
//     request(url, (err, res, body) => {
//       if (!error && res.statusCode == 200) {
//         callback(body.data)
//       } else if (err) {
//         return console.err(err);
//       }
//     });
//   },
//
//   updateStationStatus: (featureCollection, callback) => {
//     // Get Station Status
//     getStationJson("https://api-core.niceridemn.org/gbfs/en/station_status.json", (stationUpdates) => {
//       // For each Station Status object
//       for (update of stationUpdates) {
//
//         // Get the station_id
//         let id = update.station_id;
//
//         // Match the station_id of the update to one in featureCollection
//         for (station of featureCollection.features) {
//           if (id = station.station_id) {
//             station.properties.station_status = update;
//           }
//         }
//         // A Thought: this would be more efficient if it was indexed.
//
//       }
//       // Make the result accessible to the callback after updating all features
//       callback(featureCollection)
//     });
//
//   },
//
//   buildFeatureCollection: (callback) => {
//     let featureCollection = undefined;
//
//     // Get System Information
//     exports.getSystemJson("https://api-core.niceridemn.org/gbfs/en/system_information.json", (systemData) => {
//
//       // Build featureCollection using System Information
//       featureCollection = FeatureCollection(systemData);
//
//       // Get Station Information
//       exports.getStationJson("https://api-core.niceridemn.org/gbfs/en/station_information.json", (stations) => {
//         // Populate featureCollection.features
//         for (station of stations) {
//           let feature = exports.Feature(station);
//           featureCollection.features.push(feature);
//         }
//         // Get Station Status, update featureCollection
//         exports.updateStationStatus(featureCollection, callback);
//
//       });
//     });
//   }
//
//
//   // buildFeatureCollection: () => {
//   //   // Generate base FeatureCollection
//   //   const fc = undefined;
//   //   exports.getCachedSystemJson(feeds[2], (data) => {
//   //     fc = exports.FeatureCollection(data);
//   //   });
//   //   // Get Station Information
//   //   exports.getCachedStationJson(feeds[0], (stations) => {
//   //     for (station of stations) {
//   //       // Use System Information to create Features and push them to the FC
//   //       fc.features.push(Feature(station));
//   //     }
//   //   });
//   //   // Get Station Status
//   //   exports.updateStationStatus(fc);
//   // }
//
// };


const FeatureCollection = (system_info) => {
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

};

const Feature = (station_info) => {

  if (typeof(station_info) !== 'object') {
    throw new TypeError("Failed to create Feature, invalid JSON input.");
  }
  if(station_info.hasOwnProperty('length')) {
    throw new TypeError("Failed to create Feature, invalid JSON input.");
  }
  return {
    "type": "Feature",
    "station_id": station_info.station_id,
    "last_updated": undefined,
    "geometry": {
      "type": "Point",
      "coordinates": [station_info.lon, station_info.lat]
    },
    "properties": {
      "station_info": station_info,
      "station_status": undefined
    }
  };

};

const getStationJson = (url, callback) => {
  request(url, (err, res, body) => {
    if (!err && res.statusCode == 200) {
      let data = JSON.parse(body);
      callback(data.data.stations)
    } else if (err) {
      return console.error(err);
    }
  });
};

const getSystemJson = (url, callback) => {
  request(url, (err, res, body) => {
    if (!err && res.statusCode == 200) {
      let data = JSON.parse(body);
      callback(data.data)
    } else if (err) {
      return console.error(err);
    }
  });
};

const updateStationStatus = (featureCollection, callback) => {
  // Get Station Status
  getStationJson("https://api-core.niceridemn.org/gbfs/en/station_status.json", (stationUpdates) => {
    // For each Station Status object
    for (update of stationUpdates) {

      // Get the station_id
      let id = update.station_id;

      // Match the station_id of the update to one in featureCollection
      for (station of featureCollection.features) {
        if (id = station.station_id) {
          station.properties.station_status = update;
        }
      }
      // A Thought: this would be more efficient if it was indexed.

    }
    // Make the result accessible to the callback after updating all features
    callback(featureCollection)
  });

};

const buildFeatureCollection = (callback) => {
  let featureCollection = undefined;

  // Get System Information
  getSystemJson("https://api-core.niceridemn.org/gbfs/en/system_information.json", (systemData) => {

    // Build featureCollection using System Information
    let featureCollection = FeatureCollection(systemData);

    // Get Station Information
    getStationJson("https://api-core.niceridemn.org/gbfs/en/station_information.json", (stations) => {
      // Populate featureCollection.features
      for (station of stations) {
        let feature = Feature(station);
        featureCollection.features.push(feature);
      }
      // Get Station Status, update featureCollection
      updateStationStatus(featureCollection, (fc) => {
        callback(fc)
      });

    });
  });
};

// Export all the functions
exports.FeatureCollection = FeatureCollection;
exports.Feature = Feature;
exports.getStationJson = getStationJson;
exports.getSystemJson = getSystemJson;
exports.updateStationStatus = updateStationStatus;
exports.buildFeatureCollection = buildFeatureCollection;
