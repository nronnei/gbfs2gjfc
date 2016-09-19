const request = require("request");



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

const getFeed = (feedUrl, callback) => {
  request(feedUrl, (err, res, body) => {
    if (!err && res.statusCode == 200) {

      let data = JSON.parse(body);
      callback(data)

    } else if (err) {

      return console.error(err);

    }
  });
};

const updateStationStatus = (featureCollection, callback) => {
  // Get Station Status
  getFeed("https://api-core.niceridemn.org/gbfs/en/station_status.json", (statusUpdate) => {

    let updateTime = statusUpdate.last_updated;
    let stationUpdates = statusUpdate.data.stations;

    // For each station update
    for (update of stationUpdates) {

      // Get the station_id
      let id = update.station_id;

      // Match the station_id of the update to one in featureCollection
      for (station of featureCollection.features) {
        if (id == station.station_id) {
          station.last_updated = updateTime;
          station.properties.station_status = update;
        }
      }
      // A Thought: this would be more efficient if it was indexed.

    }
    // Make the updated featureCollection accessible to the callback
    callback(featureCollection)
  });

};

const buildFeatureCollection = (callback) => {
  let featureCollection = undefined;

  // Get System Information
  getFeed("https://api-core.niceridemn.org/gbfs/en/system_information.json", (systemData) => {

    // Build featureCollection using System Information
    let featureCollection = FeatureCollection(systemData.data);

    // Get Station Information
    getFeed("https://api-core.niceridemn.org/gbfs/en/station_information.json", (stationInfo) => {
      let stations = stationInfo.data.stations;
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
module.exports = {
  FeatureCollection: FeatureCollection,
  Feature: Feature,
  getFeed: getFeed,
  updateStationStatus: updateStationStatus,
  buildFeatureCollection: buildFeatureCollection
}
