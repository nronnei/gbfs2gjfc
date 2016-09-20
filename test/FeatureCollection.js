const lib = require('../index.js');
const chai = require('chai');
const expect = chai.expect;


const system_info = {
  "last_updated":1473910327,
  "ttl":60,
  "data": {
    "system_id":"niceridemn",
    "language":"en",
    "name":"Nice Ride Minnesota",
    "short_name":"Nice Ride MN",
    "operator":"Nice Ride Minnesota",
    "url":"http://www.niceridemn.org",
    "purchase_url":"https://www.niceridemn.org",
    "start_date":"2010-06-09",
    "phone_number":"1-877-551-6423",
    "email":"customerservice@niceridemn.org",
    "timezone":"US/Central"
  }
};
const dataKeys = [
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
const dataVals = [
  'niceridemn',
  'en',
  'Nice Ride Minnesota',
  'Nice Ride MN',
  'Nice Ride Minnesota',
  'http://www.niceridemn.org',
  'https://www.niceridemn.org',
  '2010-06-09',
  '1-877-551-6423',
  'customerservice@niceridemn.org',
  'US/Central'
];

describe("The FeatureCollection factory function", () => {
  it("throws an error if the input is not an object" , () => {
    expect(() => {lib.FeatureCollection("test string")}).to.throw(TypeError);
    expect(() => {lib.FeatureCollection(123)}).to.throw(TypeError);
    expect(() => {lib.FeatureCollection(["array", "instead"])}).to.throw(TypeError);
  });
  it("generates an object WITHOUT input", () => {
    console.log("\n")
    let fc = lib.FeatureCollection();
    expect(() => {lib.FeatureCollection()}).not.to.throw(Error);
    expect(fc).to.be.an('object');
  });
  it("that is a valid GeoJSON FeatureCollection", () => {
    let fc = lib.FeatureCollection();
    expect(fc).to.have.property('type', "FeatureCollection")
    expect(fc).to.have.property('features');
  });
  it("with no features and system_info undefined", () => {
    let fc = lib.FeatureCollection();
    expect(fc).to.have.property('features')
      .to.have.lengthOf(0)
    expect(fc).to.have.property('system_information')
      .to.be.undefined;
  });
  it("generates an object WITH input", () => {
    console.log("\n")
    let fc = lib.FeatureCollection(system_info);
    expect(() => {lib.FeatureCollection(system_info)}).not.to.throw(Error);
    expect(fc).to.be.an('object');
  });
  it("that is a valid GeoJSON FeatureCollection", () => {
    let fc = lib.FeatureCollection(system_info);
    expect(fc).to.have.property('type', "FeatureCollection")
    expect(fc).to.have.property('features');
  });
  it("with no features and properly formmatted and defined system_info", () => {
    let fc = lib.FeatureCollection(system_info);
    expect(fc).to.have.property('features')
      .to.have.lengthOf(0)
    for (let i of dataKeys) {
      let prop = fc.system_information.data[dataKeys[i]];
      expect(prop).to.eql(dataVals[i]);
    }
  });
});
