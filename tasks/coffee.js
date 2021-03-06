/*
 *
 * Task: coffee
 * Description: Compile CoffeeScript files into JavaScript
 * Dependencies: coffee-script
 * Contributor(s): @errcw
 *
 */

module.exports = function(grunt) {

  var file = grunt.file,
       log = grunt.log,
         _ = grunt.utils._,
     async = grunt.utils.async;

  grunt.registerMultiTask("coffee",
    "Compile CoffeeScript files into JavaScript", function () {

    var options = grunt.helper("options", this),
          files = this.data.files,
           done = this.async();

    async.forEach(Object.keys(files), function(dest, callback) {
      var src = files[dest];
      async.concat(file.expand(src), function(filename, callback) {
        var opts = _.extend(options, {filename: filename});
        var javascript = grunt.helper("coffee", file.read(filename), opts);
        callback(!javascript, javascript);
      }, function(err, javascript) {
        if (!err) {
          file.write(dest, javascript.join("\n"));
          log.writeln("File '" + dest + "' created.");
        }
        callback(err);
      });
    }, function(err) {
      done(!err);
    });
  });

  grunt.registerHelper("coffee", function(coffeescript, options) {
    var coffee = require("coffee-script");
    try {
      var javascript = coffee.compile(coffeescript, options);
      return javascript;
    } catch (e) {
      log.error(e);
      return null;
    }
  });

};
