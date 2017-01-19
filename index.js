const request = require("request");

// Set default meta to NiceRide MN (object of my own work)
const meta = {
  feedLanaguage: "en",
  availableLanguages: undefined,
  system_information: undefined,
  station_information: undefined,
  station_status: undefined,
  free_bike_status: undefined,
  system_hours: undefined,
  system_calendar: undefined,
  system_pricing_plans: undefined,
  system_regions: undefined,
  system_alerts: undefined
};



const FeatureCollection = (system_info) => {
  startTime = new Date();
  if (system_info === undefined) {
    return {
      "type": "FeatureCollection",
      "system_information": undefined,
      "system_hours": undefined,
      "system_calendar": undefined,
      "system_pricing_plans": undefined,
      "system_regions": undefined,
      "status_ttl": undefined,
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
      "system_regions": undefined,
      "status_ttl": undefined,
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
    "geometry": {
      "type": "Point",
      "coordinates": [station_info.lon, station_info.lat]
    },
    "properties": {
      "last_updated": undefined,
      "station_id": station_info.station_id,
      "name": station_info.name,
      "short_name": station_info.short_name,
      "address": station_info.address,
      "cross_street": station_info.cross_street,
      "region_id": station_info.region_id,
      "post_code": station_info.post_code,
      "rental_methods": station_info.rental_methods,
      "capacity": station_info.capacity,

      "num_bikes_available": undefined,
      "num_bikes_disabled": undefined,
      "num_docks_available": undefined,
      "num_docks_disabled": undefined,
      "pct_available": undefined,
      "total_docks": undefined,
      "style_size": undefined,
      "is_installed": undefined,
      "is_renting": undefined,
      "is_returning": undefined,
      "last_reported": undefined,

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


const getSystemCalendarFeed = (callback) => {
  if (meta.system_calendar != undefined) {
    getFeed(meta.system_calendar, (calendarData) => {
      callback(calendarData.data.calendars);
    });
  } else {
    let calendarData = undefined;
    callback(calendarData);
  }
};


const getSystemHoursFeed = (callback) => {
  if (meta.system_hours != undefined) {
    getFeed(meta.system_hours, (hoursData) => {
      callback(hoursData.data);
    });
  } else {
    let hoursData = undefined;
    callback(hoursData);
  }
};


const getSystemPricingFeed = (callback) => {
  if (meta.system_pricing_plans != undefined) {
    getFeed(meta.system_pricing_plans, (pricingData) => {
      callback(pricingData.data);
    });
  } else {
    let pricingData = undefined;
    callback(pricingData);
  }
};


const getSystemRegionsFeed = (callback) => {
  if (meta.system_regions != undefined) {
    getFeed(meta.system_regions, (regionsData) => {
      callback(regionsData.data);
    });
  } else {
    let regionsData = undefined;
    callback(regionsData);
  }
};


const setAuxiliarySystemInformation = (featureCollection, callback) => {

  // Get system calendar feed, or return "undefined" if meta has no feed URL
  getSystemCalendarFeed((calendarData) => {
    featureCollection.system_calendar = calendarData;

    // Get system pricing feed, or return "undefined" if meta has no feed URL
    getSystemPricingFeed((pricingData) => {
      featureCollection.system_pricing_plans = pricingData;

      // Get system regions feed, or return "undefined" if meta has no feed URL
      getSystemRegionsFeed((regionsData) => {
        featureCollection.system_regions = regionsData;

        // Get system hours feed, or return "undefined" if meta has no feed URL
        getSystemHoursFeed((hoursData) => {
          featureCollection.system_hours = hoursData;

          // Finally, call the callback
          callback();

        });
      });
    });
  });
};


const updateStationStatus = (featureCollection, callback) => {
  // Get Station Status
  getFeed(meta.station_status, (statusUpdate) => {

    featureCollection.status_ttl = statusUpdate.ttl
    let updateTime = statusUpdate.last_updated;
    let stationUpdates = statusUpdate.data.stations;

    // For each station update
    for (update of stationUpdates) {

      // Get the station_id
      let id = update.station_id;
      let totalDocks = update.capacity ? update.capacity : (update.num_bikes_available + update.num_docks_available)

      // Match the station_id of the update to one in featureCollection
      for (station of featureCollection.features) {
        if (id == station.properties.station_id) {
          station.properties.num_bikes_available = update.num_bikes_available;
          station.properties.num_bikes_disabled = update.num_bikes_disabled;
          station.properties.num_docks_available = update.num_docks_available;
          station.properties.num_docks_disabled = update.num_docks_disabled;
          station.properties.pct_available = (update.num_bikes_available / totalDocks);
          station.properties.total_docks = totalDocks;
          station.properties.style_size = Math.log(totalDocks);
          station.properties.is_installed = update.is_installed;
          station.properties.is_renting = update.is_renting;
          station.properties.is_returning = update.is_returning;
          station.properties.last_reported = update.last_reported;
          station.properties.last_updated = updateTime;
        }
      }
      // A Thought: this would be more efficient if it was indexed.

    }

    callback();
  });

};


const buildFeatureCollection = (callback) => {
  let featureCollection = undefined;

  // Get System Information
  getFeed(meta.system_information, (systemData) => {

    // Build featureCollection using System Information
    let featureCollection = FeatureCollection(systemData.data);

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

        // Set addition system information, if available
        setAuxiliarySystemInformation(featureCollection, () => {

          // Finally, call the callback
          callback(featureCollection);

        });
      });
    });
  });
};




// Export all the functions
module.exports = {
  setGBFS: setGBFS,
  Feature: Feature,
  FeatureCollection: FeatureCollection,
  getLanuageOptions: getLanuageOptions,
  getFeedLanguage: getFeedLanguage,
  setFeedLanguage: setFeedLanguage,
  getFeed: getFeed,
  updateStationStatus: updateStationStatus,
  buildFeatureCollection: buildFeatureCollection
}
