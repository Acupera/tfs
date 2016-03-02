var format = require('../utils/format'),
    output = require('../utils/output'),
    tfSync = require('../utils/tfSync');

/**
 * Adds files and folders from a local file system to a server for Team Foundation version control.Note   The results of this command are not reflected in the server for Team Foundation version control until you perform a check-in operation. For more information, see Check In Pending Changes.Required PermissionsTo use the add command, you must own the workspace and your Check out permission for the parent folder of the new items must be set to Allow. Your Lock permission must also be set to Allow if you use /lock:checkout or /lock:checkin. For more information, see Team Foundation Server Permissions.
 *
 * @param  {Array}  itemspec File(s) or folder(s) to retrieve.
                             If null/undefined, equals CWD.
 * @param  {Object} options  Command options
 */
var add = function(itemspec, options) {
  var params = format.items(itemspec);
  params = params.concat(format.options(options));

  if (options.verbose) {
    output.verbose('Command: get ' + params.join(' '));
  }

  return tfSync('add', params, function() {
    output.success('Done, without errors.');
  }, !!options.verbose);
};

module.exports = add;
