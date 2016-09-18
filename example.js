const data = require("./index.js");
const fs = require("fs");
const request = require("request")

// let test_obj = {};
// data.buildFeatureCollection((fc) => {
//   test_obj = fc;
//   for (station of test_obj.features) {
//     let lastReport = station.last_updated
//     console.log(lastReport);
//   }
// });




// data.getSystemJson(
//   "https://api-core.niceridemn.org/gbfs/en/system_information.json",
//   (info) => {
//   console.log(info);
// });




let cb = () => {
  request("https://api-core.niceridemn.org/gbfs/en/station_status.json", (err, res, body) => {
    if (err) {
      return console.lerror(err);
    }
    let data = JSON.parse(body)
    console.log(data.data.stations[10].last_reported);
  })
}
cb();
setTimeout(cb, 61000)


// fs.readFile("./data/station_status.json", "utf-8", (err, stationJson) => {
//   if (err) {
//     return console.err(err);
//   }
//   // let stations = stationJson.data.stations;
//   // cb(stations)
//   // console.log(Object.keys(stationJson));
//   console.log(stationJson.data.stations);
// });


// request("https://api-core.niceridemn.org/gbfs/en/station_status.json", (err, res, body) => {
//   if (err) {
//     return console.lerror(err);
//   }
//   let data = JSON.parse(body)
//   console.log(data.last_updated);
// })


//
// const ops = {
//
// }
