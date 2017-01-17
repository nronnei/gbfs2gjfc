const g2g = require("./index.js");

let myFC;

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
    myFC = fc;
    console.log(myFC.features[0].properties);
  });
});

// Simulate AJAX using setTimeout @ 10 seconds.
let to = 10001;
setTimeout(() => {
  g2g.updateStationStatus(myFC, () => {
    console.log(myFC.features[0].properties);
  });
}, to);
