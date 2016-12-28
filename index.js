const request = require("request");

// Set default meta to NiceRide MN (object of my own work)
const meta = {
  feedLanaguage: "en",
  availableLanguages: ["en", "fr"],
  system_information: "https://api-core.niceridemn.org/gbfs/en/system_information.json",
  station_information: "https://api-core.niceridemn.org/gbfs/en/station_information.json",
  station_status: "https://api-core.niceridemn.org/gbfs/en/station_status.json",
  free_bike_status: undefined,
  system_hours: undefined,
  system_calendar: "https://api-core.niceridemn.org/gbfs/en/system_calendar.json",
  system_pricing_plans: "https://api-core.niceridemn.org/gbfs/en/system_pricing_plans.json",
  system_alerts: undefined
}


const FeatureCollection = (system_info) => {
  startTime = new Date();
  if (system_info === undefined) {
    return {
      "type": "FeatureCollection",
      "system_information": undefined,
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
      "system_information": system_info,
      "system_hours": undefined,
      "system_calendar": undefined,
      "system_pricing_plans": undefined,
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
      "station_information": station_info,
      "station_status": undefined,
      "station_alerts": undefined
    }
  };

};


const setGBFS = (url, callback) => {
  request(url, (err, res, body) => {
    // Handle errors
    if (err) {
      return console.error(err);

    // Handle connection problems i.e. 403/404
    } else if (res.statusCode !== 200) {
      console.log("Connection error - could not GET " + url);
      console.log("Status code: " + res.statusCode);

    // Populate meta
    } else {
      let data = JSON.parse(body);

      // Set availableLanguages
      meta.availableLanguages = Object.keys(data.data);

      // Set feed urls in meta
      for (feed of data.data[meta.feedLanaguage].feeds) {
        meta[feed.name] = feed.url;
      }

      callback();
    }
  });
};


const getLanuageOptions = () => {
  return meta.availableLanguages
}


const getFeedLanguage = () => {
  return meta.feedLanaguage;
}


const setFeedLanguage = (language_string) => {
  if (typeof(language_string) !== 'string') {
    throw new TypeError("setFeedLanguage requires a string.")
  }
  if (!meta.availableLanguages.includes(language_string)) {
    throw new Error("The language requested is not provided by this bikeshare system.")
  }
  meta.feedLanaguage = language_string;
}


const getFeed = (feedUrl, callback) => {
  request(feedUrl, (err, res, body) => {
    if (!err && res.statusCode == 200) {

      let data = JSON.parse(body);
      callback(data)

    } else if (res.statusCode !== 200) {
      console.log("Connection error - could not GET " + feedUrl);
      console.log("Status code: " + res.statusCode);

    } else if (err) {

      return console.error(err);

    }
  });
};


const updateStationStatus = (featureCollection, callback) => {
  // Get Station Status
  getFeed(meta.station_status, (statusUpdate) => {

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
    callback();
  });

};


// @TODO Fix this callback hell, there has to be a better way to do this.
const buildFeatureCollection = (callback) => {
  let featureCollection = undefined;

  // Get System Information
  getFeed(meta.system_information, (systemData) => {

    // Build featureCollection using System Information
    let featureCollection = FeatureCollection(systemData.data);

    // Get System Hours
    getFeed(meta.system_hours, (hoursData) => {
      featureCollection.system_hours = hoursData.data;

      // Get System Calendar
      getFeed(meta.system_calendar, (calendarData) => {
        featureCollection.system_calendar = calendarData.data;

        // Get System Pricing
        getFeed(meta.system_pricing_plans, (pricingData) => {
          featureCollection.system_pricing_plans = pricingData.data;

          // Get System Region
          getFeed(meta.system_region, (regionData) => {

            // Get Station Information
            getFeed(meta.station_information, (stationInfo) => {
              let stations = stationInfo.data.stations;

              // Populate featureCollection.features
              for (station of stations) {
                let feature = Feature(station);
                featureCollection.features.push(feature);
              }

              // Get Station Status, update featureCollection
              updateStationStatus(featureCollection, () => {
                callback(featureCollection);
              });
            });
          });
        });
      });
    });
  });
};



// Export all the functions
module.exports = {
  FeatureCollection: FeatureCollection,
  Feature: Feature,
  setGBFS: setGBFS,
  getLanuageOptions: getLanuageOptions,
  getFeedLanguage: getFeedLanguage,
  setFeedLanguage: setFeedLanguage,
  getFeed: getFeed,
  updateStationStatus: updateStationStatus,
  buildFeatureCollection: buildFeatureCollection
}
