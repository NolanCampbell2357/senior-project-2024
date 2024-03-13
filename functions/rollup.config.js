const commonjs = require("@rollup/plugin-commonjs");
const json = require("@rollup/plugin-json");
const nodeResolve = require("@rollup/plugin-terser");
const packageJson = require("./package.json");

module.exports = {
  external: Object.keys(packageJson.dependencies),
  output: {
    format: "cjs"
  },
  plugins: [nodeResolve(), commonjs({ transformMixedESModules: true }), json()]
};
