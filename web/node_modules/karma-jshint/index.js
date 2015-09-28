(function() {
    'use strict';

    // TODO (feature) get fs and conditionally load .jshintrc file

    // TODO (feature) implement test group definition similar to grunt-contrib-jshint

    var JSHintErrorCounter = function() {
      var totalCount, errorCounter, errorDescriptions;

      function init() {
         totalCount = 0;
         errorCounter = {};
         errorDescriptions = {"{?}": '{unknown}'};
      }

      function countError(error) {
        ++totalCount;

        if (error.code === undefined && error.raw === undefined) {
          if (errorCounter["{?}"] === undefined) {
            errorCounter = {"{?}": 0};
          }
          return ++errorCounter["{?}"];
        }

        if (errorCounter[error.code] === undefined) {
          errorDescriptions[error.code] = error.raw;
          return errorCounter[error.code] = 1;
        }

        return ++errorCounter[error.code];
      }

      function toString() {
        var errorCode,
            returnString = '',
            footer = '---------------------- '+ totalCount +' total nag nags --------------------------';

            returnString = '\n------------------------ JSHint Summary ------------------------\n';


        if (totalCount === 0) {
            returnString += COLOR.LIGHT_GREEN + '                      .....nnnnice !   :)'+COLOR.RESET+'\n';
            footer = '-------------- Pretty Clean Code you got there -----------------';
        }

        for (errorCode in errorCounter) {
          returnString += errorCounter[errorCode] + ' x "'
              + errorDescriptions[errorCode] + '" \n';
        }
        return returnString + footer;
      }

      init();
      return {
        add: countError,
        reset: init,
        toString: toString,
        get length() {
            return totalCount;
        }
      };
    };

    var _ = '\x1b[';
    var COLOR = {
        RED: _ + '91m',
        LIGHT_RED: _ + '31m',
        DARK_BLUE: _ + '34m',
        BLUE: _ + '94m',
        LIGHT_GREEN: _ + '92m',
        GREEN: _ + '32m',
        WHITE: _ + '37m',
        DARK_GREY: _ + '31m;1m',
        RESET: _ + '0m'
    };

    var KarmaJshintReporter = function( karmaConfig, loggerFactory ) {
        var jshint,
            log;

        jshint = require('jshint').JSHINT;
        log = loggerFactory.create('preprocessor.jshint');

        /**
         *
         * @param {string} content
         * @param {Object} file
         * @param {Function} done
         * @returns {unresolved}
         */
        return function( content, file, done ) {
            var i,
                errors,
                errorCount,
                ErrorSummary = new JSHintErrorCounter(),
                logMessage = 0,
                options = {};

            log.debug('Processing "%s".', file.originalPath);

            if (karmaConfig.jshint !== undefined && typeof karmaConfig.jshint.options === 'object') {
                options = karmaConfig.jshint.options;
            }

            if (!jshint(content, options)) {
                errors = jshint.data().errors;
                errorCount = errors.length;
                logMessage = 'in ' + file.originalPath + ':\n';

                for (i = 0; i < errorCount; i++) {
                    var error = errors[i];
                    ErrorSummary.add(error);
                    logMessage += 'line ' + COLOR.RED + error.line + COLOR.RESET +
                        ', col ' + error.character + ': ' + error.reason + ' \n' +
                        COLOR.DARK_BLUE + '    `' + error.evidence + '`' +
                        COLOR.RESET + '\n';
                }

                logMessage += '\n' + COLOR.LIGHT_RED +
                    file.originalPath.replace(karmaConfig.basePath, '') + COLOR.BLUE +  '    ' +
                    errorCount + ' JSHint complaints.'+ COLOR.RESET +'\n';

                log.warn(logMessage);
            }

            if (karmaConfig.jshint !== undefined && karmaConfig.jshint.summary === true) {
                var message = ErrorSummary.toString();
                if (ErrorSummary.length > 0) {
                    log.warn(message);
                } else {
                    log.info(message);
                }
            }

            return done(content);
        };

    };

    KarmaJshintReporter.$inject = [ 'config', 'logger' ];

    module.exports = {
        'preprocessor:jshint': [ 'factory', KarmaJshintReporter ]
    };
}).call(this);
