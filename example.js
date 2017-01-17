const g2g = require("./index.js");
const moment = require("moment");

////////////////////////
//
// You can run function only once every minute
// otherwise, your requests will 403
//
////////////////////////


// First, let's decalre the variable that will hold our featueCollection
let myFC = undefined;

const startTime = moment();
// Log that time so we can compare it to our other output
console.log("\nCurrent time: " + startTime.format("dddd, MMM Do - h:mm a"));


// Set up the autodiscovery - this is the best way to use the module
// Try a few systems, if you like:
// Citi Bike, NYC - https://gbfs.citibikenyc.com/gbfs/gbfs.json
// The Hubway, Boston - https://gbfs.thehubway.com/gbfs/gbfs.json
// Pronto, Seattle - https://gbfs.prontocycleshare.com/gbfs/gbfs.json
// Bublr, Milwuakee - https://gbfs.bcycle.com/bcycle_bublr/gbfs.json

g2g.setGBFS("https://gbfs.bcycle.com/bcycle_bublr/gbfs.json", () => {

  // Now lets build an actual FeatureCollection!
  // This method would be used to instantiate your GeoJSON Layer
  // Call buildFeatureCollection only for setting up an entirely new layer
  g2g.buildFeatureCollection((fc) => {

    // To demonstrate that the callback is working, set myFC equal to the result
    // of buildFeatureCollection
    myFC = fc;

    // Notice that myFC is now a fully functional GeoJSON Feature Collection
    // Iterate over its features
    for (feature of myFC.features.slice(0, 5)) {
      console.log("\n");

      // Set time vars for convenience
      let updateTime = moment.unix(feature.properties.last_updated);
      let reportTime = moment.unix(parseInt(feature.properties.last_reported));

      // Log last updated
      console.log(
        "Station '"
        + feature.properties.station_id +
        "' last updated at "
        + updateTime.format("dddd, MMM Do - h:mm a")
      );

      // Log last reported
      console.log(
        "Station '"
        + feature.properties.station_id +
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
});



// Now lets simulate an update
// We'll wait 61 seconds, then grab an update and print all the same stuff from before
const delay = 61000;
setTimeout(() => {
  g2g.updateStationStatus(myFC, () => {
    for (feature of myFC.features.slice(0, 5)) {
      console.log("\n");

      // Set time vars for convenience
      let updateTime = moment.unix(feature.properties.last_updated);
      let reportTime = moment.unix(parseInt(feature.properties.last_reported));

      // Log last updated
      console.log(
        "Station '"
        + feature.properties.station_id +
        "' last updated at "
        + updateTime.format("dddd, MMM Do - h:mm a")
      );

      // Log last reported
      console.log(
        "Station '"
        + feature.properties.station_id +
        "' last reported at "
        + reportTime.format("dddd, MMM Do - h:mm a")
      );

    }
    console.log("\n");
  });
}, delay);
