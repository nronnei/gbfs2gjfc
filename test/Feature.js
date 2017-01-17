const lib = require('../index.js');
const chai = require('chai');
const expect = chai.expect;

const station_info = {
  "station_id":"2",
  "name":"100 Main Street SE",
  "short_name":"30000",
  "lat":44.984892,
  "lon":-93.256551,
  "rental_methods":["KEY","CREDITCARD"],
  "capacity":27,
  "eightd_has_key_dispenser":true
};
const station_status = {
  "station_id":"2",
  "num_bikes_available":12,
  "num_bikes_disabled":0,
  "num_docks_available":15,
  "num_docks_disabled":0,
  "is_installed":1,
  "is_renting":1,
  "is_returning":1,
  "last_reported":"1473818455",
  "eightd_has_available_keys":true
};
const stationInfoKeys = ['station_id', 'name', 'short_name','lat','lon', 'rental_methods', 'capacity', 'eightd_has_key_dispenser'];
const stationInfoValues = [ '2', '100 Main Street SE', '30000',  44.984892, -93.256551, [ 'KEY', 'CREDITCARD' ], 27,  true ];

describe("The Feature factory function", () => {
  it("throws an error if the input is not an object" , () => {
    expect(() => {lib.Feature("test string")}).to.throw(TypeError);
    expect(() => {lib.Feature(123)}).to.throw(TypeError);
    expect(() => {lib.Feature(["array", "instead"])}).to.throw(TypeError);
  });
  const feature = lib.Feature(station_info);
  it("produces a Feature object", () => {
    expect(feature).to.be.an('object');
  });
  it("that is a properly formatted GeoJSON Feature", () => {
    expect(feature).to.have.property('type', 'Feature');
    expect(feature).to.have.property('geometry');
    expect(feature).to.have.property('properties');
  });
  it("that has a valid GeoJSON Point geometry object", () => {
    expect(feature).has.property('geometry');
    expect(feature).has.deep.property('geometry.type', "Point");
    expect(feature).has.deep.property('geometry.coordinates[0]', -93.256551);
    expect(feature).has.deep.property('geometry.coordinates[1]', 44.984892);
  });
  it("with properties properly formatted and populated", () => {
    for (let i in stationInfoKeys) {
      let prop = feature.properties[stationInfoKeys[i]]
      expect(prop).to.eql(stationInfoValues[i]);
    }
  });
  it("with properties.station_status undefined", () => {
    expect(feature).to.have.deep.property('properties.short_name')
      .to.be.undefined;
  });
});
