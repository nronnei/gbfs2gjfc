const g2g = require("./index.js");
const request = require("request");
const moment = require("moment");

// First, let's decalre the variable that will hold our featueCollection
let myFC = undefined;

// Next, let's use time to show how the module works
// Start by setting our current time for comparison
const startTime = moment();
// Log that time so we can compare it to our other output
console.log("\nCurrent time: " + startTime.format("dddd, MMM Do - h:mm a"));


// Now lets build an actual FeatureCollection!
// This method would be used to instantiate your GeoJSON Layer
// Call buildFeatureCollection only for setting up an entirely new layer
g2g.buildFeatureCollection((fc) => {

  // To demonstrate that the callback is working, set myFC equal to the result
  // of buildFeatureCollection
  myFC = fc;

  // Notice that myFC is now a fully functional GeoJSON Feature Collection
  // Iterate over its features
  for (feature of myFC.features.slice(100, 105)) {
    console.log("\n");

    // Set time vars for convenience
    let updateTime = moment.unix(feature.last_updated);
    let reportTime = moment.unix(parseInt(feature.properties.station_status.last_reported));

    // Log last updated
    console.log(
      "Station '"
      + feature.station_id +
      "' last updated at "
      + updateTime.format("dddd, MMM Do - h:mm a")
    );

    // Log last reported
    console.log(
      "Station '"
      + feature.station_id +
      "' last reported at "
      + reportTime.format("dddd, MMM Do - h:mm a")
    );

  }

  // Formatting, you can ignore this
  console.log("\n\n");
  console.log("There are currently " + myFC.features.length + " features in myFC");
  console.log("waiting for update...");
  console.log("\n");

});


// Now lets simulate an update!
// We'll wait 60 seconds, then grab an update.
// Then, we'll print all the same stuff from before
const delay = 60000;
setTimeout(() => {
  g2g.updateStationStatus(myFC, (updatedFeatureClass) => {
    for (feature of updatedFeatureClass.features.slice(100, 105)) {
      console.log("\n");

      // Set time vars for convenience
      let updateTime = moment.unix(feature.last_updated);
      let reportTime = moment.unix(parseInt(feature.properties.station_status.last_reported));

      // Log last updated
      console.log(
        "Station '"
        + feature.station_id +
        "' last updated at "
        + updateTime.format("dddd, MMM Do - h:mm a")
      );

      // Log last reported
      console.log(
        "Station '"
        + feature.station_id +
        "' last reported at "
        + reportTime.format("dddd, MMM Do - h:mm a")
      );

    }
    console.log("\n");
  });
}, delay);
