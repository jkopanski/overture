const { pathsToModuleNameMapper } = require('ts-jest/utils');

const base = require("../../jest.base.js");
const package = require("./package.json");
const { compilerOptions } = require('./tsconfig');

module.exports = {
  ...base,
  name: package.name,
  displayName: "Doable",
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths)
};
