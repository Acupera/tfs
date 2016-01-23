var fileExists   = require('./fileExists'),
    fs           = require('fs'),
    SETTINGS     = {},
    settingsFile = __dirname + '/../../config/settings.json';

function path(path) {
  return path.substr(3).replace(/\\/g, '/');
}

function cwd() {
  return path(process.cwd());
}

var debug = {
  cwd: cwd,

  getBooleanAssert: function(options) {
    var bOptions = {},
    output = '/' + options.b.join(' /');

    options.b.forEach(function(option) {
      bOptions[option] = true;
    });

    return {
      options: bOptions,
      output:  output
    };
  },

  getStringAssert: function(options) {
    var sOptions = {},
    output = '/' + options.s.join(':aString /') + ':aString';

    options.s.forEach(function(option) {
      sOptions[option] = 'aString';
    });

    return {
      options: sOptions,
      output:  output
    };
  },

  is: function() {
    SETTINGS = JSON.parse(fs.readFileSync(settingsFile, 'utf8'));
    return !!SETTINGS.debug;
  },

  itemspec: function() {
    return cwd() + '/..';
  },

  path: path,

  /**
   * Toggle debugging environment mode
   *
   * @param  {Boolean} state
   */
  toggle: function(state) {
    // Switch debug environment to true
    if (fileExists(settingsFile)) {
      SETTINGS = JSON.parse(fs.readFileSync(settingsFile, 'utf8'));
    }

    SETTINGS.debug = state;

    var fileSource = JSON.stringify(SETTINGS, null, 2);
    fs.writeFileSync(settingsFile, fileSource, 'utf8');
  }
};

module.exports = debug;
