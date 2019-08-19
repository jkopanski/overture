const base = require("./jest.base.js");

module.exports = {
  ...base,
  projects: [
    "<rootDir>/packages/*/jest.config.js"
  ],
  modulePathIgnorePatterns: [ "dist" ],
  coverageDirectory: "<rootDir>/coverage/"
};
