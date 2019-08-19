const base = require("../../jest.base.js");
const package = require("./package.json");

module.exports = {
  ...base,
  name: package.name,
  displayName: "Overture"
};
