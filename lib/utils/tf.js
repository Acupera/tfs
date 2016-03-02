var output   = require('./output'),
    SETTINGS = require('../setup')();

/**
 * Run asynchronously a TFS command via the TFS command line tool
 *
 * @todo Manage stderr and exceptions
 * @todo Manage stdout data in status command instead of here
 * @todo A 1.4 version with a full async spawn management based on callbacks
 *
 * @version 1.3.0
 *
 * @param  {String}   command   TFS command
 * @param  {Array}    args      TFS command arguments
 * @param  {Function} callback  Callback function
 * @param  {Boolean}  isVerbose Verbose mode
 *
 * @return {Object} Response: { message: [String], isError: [Boolean] }
 */
var tf = function(command, args, callback, isVerbose) {
  if (!args) {
    args = [];
  }

  args.unshift(command);

  if (!callback) {
    callback = function(response) {
      if (response.isError) {
        output.error('Aborted due to errors.');
      } else {
        output.success('Done, without error.');
      }
    };
  }

  if (isVerbose) {
    output.verbose('Command: TF.exe ' + args.join(' '));
  }

  if (SETTINGS.debug) {
    if (isVerbose) {
      output.debug('"' + SETTINGS.tfPath + '" ' + args.join(' '));
    }

    return;
  }

  var stderr = '',
      stdout = '';

  try {
    var batch = require('child_process').spawn(SETTINGS.tfPath, args);

    batch.stdout.on('data', function(data) {
      stdout += data.toString();
    });

    batch.stderr.on('data', function(data) {
      stderr += data.toString();
    });

    batch.on('close', function() {
      var line,
          lineRegexp = /(.+)\r\n/g,
          lineStatus,
          lineStatusRegexp = /(.*)(add|delete|edit|rename)(.*)/,
          summaryRegexp = /change\(s\)/,
          status = {
            detectedChanges: [],
            includedChanges: []
          },
          statusProperty = 'includedChanges';

      while ((line = lineRegexp.exec(stdout)) !== null) {
        if (line[1][0] !== '-' && line[1].substr(0, 9) !== 'File name' && line[1][0] !== '$' && !summaryRegexp.test(line[1])) {
          if (line[1] === 'Detected Changes:') {
            statusProperty = 'detectedChanges';
          } else {
            lineStatus = lineStatusRegexp.exec(line[1]);
            status[statusProperty].push({
              fileName: lineStatus[1].trim(),
              action: lineStatus[2].trim(),
              filePath: lineStatus[3].trim()
            });
          }
        }
      }

      if (callback) {
        var response = output.response('OK', {
          command: args.join(' '),
          status:  status
        });

        callback(null, response);
      }
    });
  }
  catch (error) {
    callback(output.responseError(error));
  }
};

module.exports = tf;
