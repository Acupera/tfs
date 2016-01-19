var BASE_PATH,
    chalk      = require('chalk'),
    output     = require('./utils/output'),
    fileExists = require('./utils/fileExists'),
    fs         = require('fs');

module.exports = function(basePath) {
  BASE_PATH = basePath;
  return setup;
};

/**
 * Get TFS settings (after starting setting up if they don't exist yet)
 *
 * @return {object} Settings
 */
function setup() {
  if (!fileExists('config/settings.json')) {
    buildSettings();
  }

  var settings = fs.readFileSync(BASE_PATH + '/config/settings.json', 'utf8');
  return JSON.parse(settings);
}

/**
 * Look for TFS command line tool and create settings file
 */
function buildSettings() {
  var pfPath = process.env['ProgramFiles(x86)'];
  var tfPath = '/Common7/IDE/TF.exe';

  switch (true) {
    case fileExists(pfPath + '/Microsoft Visual Studio 14.0' + tfPath):
      var settings = {
        tfPath: pfPath + '/Microsoft Visual Studio 14.0' + tfPath,
        tfVersion: 14
      };
      break;

    case fileExists(pfPath + '/Microsoft Visual Studio 12.0' + tfPath):
      var settings = {
        tfPath: pfPath + '/Microsoft Visual Studio 12.0' + tfPath,
        tfVersion: 12
      };
      break;

    case fileExists(pfPath + '/Microsoft Visual Studio 10.0' + tfPath):
      var settings = {
        tfPath: pfPath + '/Microsoft Visual Studio 10.0' + tfPath,
        tfVersion: 10
      };
      break;

    default:
      output.error('Impossible to find you TF.exe');
      break;
  }

  output.info('Writing ' + BASE_PATH + '/config/settings.json');

  var fileSource = JSON.stringify(settings, null, 2);
  fs.writeFileSync(BASE_PATH + '/config/settings.json', fileSource, 'utf8');
}
