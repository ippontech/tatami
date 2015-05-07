var os = require('os');
var path = require('path');
var fs = require('fs');
var builder = require('xmlbuilder');


var JenkinsReporter = function(baseReporterDecorator, config, logger, helper, formatError) {
  var log = logger.create('reporter.jenkins');
  var reporterConfig = config.jenkinsReporter || {};
  var pkgName = reporterConfig.suite || '';
  var featurePath = process.env.REPORT_FILE;
  var outputFile = helper.normalizeWinPath(path.resolve(config.basePath, reporterConfig.outputFile
      || 'test-results.xml'));
  if (featurePath != null) {
    outputFile = path.join(process.env.PREFIX || '', featurePath);
  }
  var xml;
  var suites;
  var pendingFileWritings = 0;
  var fileWritingFinished = function() {};
  var allMessages = [];

  baseReporterDecorator(this);

  this.adapters = [function(msg) {
    allMessages.push(msg);
  }];

  var initliazeXmlForBrowser = function(browser) {
    var timestamp = (new Date()).toISOString().substr(0, 19);
    var suite = suites[browser.id] = xml.ele('testsuite', {
      name: browser.name, 
      'package': pkgName, 
      timestamp: timestamp, 
      id: 0, 
      hostname: os.hostname(),
      make_target: process.env.MAKE_TARGET
    });
    suite.ele('properties').ele('property', {name: 'browser.fullName', value: browser.fullName});
  };

  this.onRunStart = function(browsers) {
    suites = Object.create(null);
    xml = builder.create('testsuites');

    // TODO(vojta): remove once we don't care about Karma 0.10
    browsers.forEach(initliazeXmlForBrowser);
  };

  this.onBrowserStart = function(browser) {
    initliazeXmlForBrowser(browser);
  };

  this.onBrowserComplete = function(browser) {
    var suite = suites[browser.id];

    if (!suite) {
      // This browser did not signal `onBrowserStart`. That happens
      // if the browser timed out duging the start phase.
      return;
    }

    var result = browser.lastResult;

    suite.att('tests', result.total);
    suite.att('errors', result.disconnected || result.error ? 1 : 0);
    suite.att('failures', result.failed);
    suite.att('time', (result.netTime || 0) / 1000);

    suite.ele('system-out').dat(allMessages.join() + '\n');
    suite.ele('system-err');
  };

  this.onRunComplete = function() {
    var xmlToOutput = xml;

    pendingFileWritings++;
    helper.mkdirIfNotExists(path.dirname(outputFile), function() {
      fs.writeFile(outputFile, xmlToOutput.end({pretty: true}), function(err) {
        if (err) {
          log.warn('Cannot write xml\n\t' + err.message);
        } else {
          log.debug('Xml results written to "%s".', outputFile);
        }

        if (!--pendingFileWritings) {
          fileWritingFinished();
        }
      });
    });

    suites = xml = null;
    allMessages.length = 0;
  };

  this.specSuccess = this.specSkipped = this.specFailure = function(browser, result) {
    var classnameArray = path.dirname(featurePath).split('/');
    if(reporterConfig.classnameSuffix != null) classnameArray.push(reporterConfig.classnameSuffix);

    var spec = suites[browser.id].ele('testcase', {
      name: result.description, time: ((result.time || 0) / 1000),
      classname: classnameArray.join('.'),
      'package': (pkgName ? pkgName + ' ' : '') + browser.name,
      parentSuites: result.suite.join('|')
    });

    if (result.skipped) {
      spec.ele('skipped');
    }

    if (!result.success) {
      result.log.forEach(function(err) {
        spec.ele('failure', {type: ''}, formatError(err));
      });
    }
  };

  // wait for writing all the xml files, before exiting
  this.onExit = function(done) {
    if (pendingFileWritings) {
      fileWritingFinished = done;
    } else {
      done();
    }
  };
};

JenkinsReporter.$inject = ['baseReporterDecorator', 'config', 'logger', 'helper', 'formatError'];

// PUBLISH DI MODULE
module.exports = {
  'reporter:jenkins': ['type', JenkinsReporter]
};
