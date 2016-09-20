const lib = require('../index.js');
const chai = require('chai');
const expect = chai.expect;

// Data for test
const statusKeys = [
  'station_id',
  'num_bikes_available',
  'num_bikes_disabled',
  'num_docks_available',
  'num_docks_disabled',
  'is_installed',
  'is_renting',
  'is_returning',
  'last_reported',
  'eightd_has_available_keys'
];
const stationInfoKeys = [
  'station_id',
  'name',
  'short_name',
  'lat',
  'lon',
  'rental_methods',
  'capacity',
  'eightd_has_key_dispenser'
];
const sysInfoKeys = [
  'system_id',
  'language',
  'name',
  'short_name',
  'operator',
  'url',
  'purchase_url',
  'start_date',
  'phone_number',
  'email',
  'timezone'
];
const feeds = [
  "../data/station_information.json",
  "../data/station_status.json",
  "../data/system_information.json"
];

describe("The getCachedInfo functions:  ", () => {

  // START - Properly read JSON from file
  for (let i in feeds) {

    let reqPath = feeds[i];

    // Write feed-specific tests
    if (reqPath.endsWith("system_information.json")) {
      // do something SYSTEM_INFO
      it("system_information properly reads the JSON file from ../data/", () => {
        expect(() => {
          lib.getCachedSystemJson(reqPath, (data) => {
            let info = data.data;
            expect(info).to.have.ownProperty('system_id', 'niceridemn');
          });
        }).not.to.throw(Error);
      });

    } else if (reqPath.endsWith("station_information.json")) {
      // do something STATION_INFO
      it("station_information properly reads the JSON file from ../data/", () => {
        expect(() => {
          lib.getCachedStationJson(reqPath, (data) => {
            let station = data[0];
            expect(station).to.have.ownProperty('station_id', '2');
          });
        }).not.to.throw(Error);
      });

    } else if (reqPath.endsWith("station_status.json")) {
      // do something STATION_STATUS
      it("station_status properly reads the JSON file from ../data/", () => {
        expect(() => {
          lib.getCachedStationJson(reqPath, (data) => {
            let station = data[0];
            expect(station).to.have.ownProperty('station_id', '2');
          });
        }).not.to.throw(Error);
      });
    }
  }
  // END - Properly read JSON from file

  // START - Throw Errors on bad input, improper format
  for (let i in feeds) {

    let reqPath = feeds[i];

    // Write feed-specific tests
    if (reqPath.endsWith("system_information.json")) {
      // do something SYSTEM_INFO
      it("system_information throws errors if it recieves bad input", () => {
        expect(() => {
          lib.getCachedSystemJson('./data/star-trek-enterprise.json', (data) => {
            expect(info).to.have.ownProperty('system_id', 'niceridemn');
          });
        }).to.throw(Error);
      });

    } else if (reqPath.endsWith("station_information.json")) {
      // do something STATION_INFO
      it("station_information throws errors if it recieves bad input", () => {
        expect(() => {
          lib.getCachedStationJson('./data/star-trek-enterprise.json', (data) => {
            let station = info[0]
            expect(station).to.have.ownProperty('station_id', '2');
          });
        }).to.throw(Error);
      });

    } else if (reqPath.endsWith("station_status.json")) {
      // do something STATION_STATUS
      it("station_status throws errors if it recieves bad input", () => {
        expect(() => {
          lib.getCachedStationJson('./data/star-trek-enterprise.json', (data) => {
            let station = info[0]
            expect(station).to.have.ownProperty('station_id', '2');
          });
        }).not.to.throw(Error);
      });
    }
  }
  // END - Throws Errors on bad input, improper format

  // START - Give the callback access to a list of JSON objects
  for (let i in feeds) {

    let reqPath = feeds[i];

    // Write feed-specific tests
    if (reqPath.endsWith("station_information.json")) {
      // do something STATION_INFO
      it("station_information gives the callback access to a list of JSON objects", () => {
        let info = lib.getCachedStationJson(reqPath, (data) => {
          expect(info).to.have.ownProperty('length');
          expect(info).to.have.length.above(50);
          expect(info[0]).to.be.an('object');
        });
      });

    } else if (reqPath.endsWith("station_status.json")) {
      // do something STATION_STATUS
      it("station_status gives the callback access to a list of JSON objects", () => {
        let info = lib.getCachedStationJson(reqPath, (data) => {
          expect(info).to.have.ownProperty('length');
          expect(info).to.have.length.above(50);
          expect(info[0]).to.be.an('object');
        });
      });
    }
  }
  // END - Give the callback access to a list of JSON objects

  // Test if objects follow GBFS Spec
  for (let i in feeds) {

    let reqPath = feeds[i];

    // Write feed-specific tests
    if (reqPath.endsWith("system_information.json")) {
      // do something SYSTEM_INFO
      it("the JSON objects follow the GBFS specification for system_information", () => {
        let info = lib.getCachedSystemJson(reqPath, (data) => {
          expect(info).to.have.all.keys(sysInfoKeys);
        });
      });

    } else if (reqPath.endsWith("station_information.json")) {
      // do something STATION_INFO
      it("the JSON objects follow the GBFS specification for station_information", () => {
        let info = lib.getCachedStationJson(reqPath, (data) => {
          expect(info).to.have.all.keys(stationInfoKeys);
        });
      });

    } else if (reqPath.endsWith("station_status.json")) {
      // do something STATION_STATUS
      it("the JSON objects follow the GBFS specification for station_status", () => {
        let info = lib.getCachedStationJson(reqPath, (data) => {
          expect(info).to.have.all.keys(statusKeys);
        });
      });
    }
  }

});
