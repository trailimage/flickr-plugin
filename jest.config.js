const config = require('@toba/test/jest');

config.transformIgnorePatterns = [
   '<rootDir>/node_modules/(?!@(toba|trailimage))'
];

module.exports = config;
