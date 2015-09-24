# karma-jenkins-reporter

> Reporter for the JUnit XML format for Jenkins.

This is a fork of [karma-junit-reporter](https://github.com/karma-runner/karma-junit-reporter).

## Installation

The easiest way is to keep `karma-jenkins-reporter` as a devDependency in your `package.json`.
```json
{
  "devDependencies": {
    "karma": "~0.12",
    "karma-jenkins-reporter": "~0.1"
  }
}
```

You can simple do it by:
```bash
npm install karma-jenkins-reporter --save-dev
```

## Configuration
```js
// karma.conf.js
module.exports = function(config) {
  config.set({
    reporters: ['progress', 'jenkins'],

    // example configuration
    jenkinsReporter: {
      outputFile: 'test-results.xml',
      suite: 'foobar',                 // this will be mapped to the package
      classnameSuffix: 'browser-test'
    }
  });
};
```

You can pass list of reporters as a CLI argument too:
```bash
karma start --reporters jenkins,dots
```

# Divergence from original project

## options

`options.classnameSuffix` will be appended the `classname` property

The output xml file will can also be set via an environment variable:
__REPORT_FILE__ its directory name is also used as the `classname` property in the xml file, replaced `/` by a dot.
You can also set a base path for the files via __PREFIX__.

Furthermore there is is passed through the __MAKE_TARGET__ environment varibale as a `make_target` property into each testsuite.

## result

- `classname` property of a __testcase__ have no pacakge and browser information anymore, instead the contain the directory of __REPORT_FILE__, dot seperated
- package and browser information in a __testcase__ is written into the `package` property
- `make_target` of a __testsuite__ is passed by env variable __MAKE_TARGET__
- if you use nested testsuites (for instance nested `describe` functions in mocha), the hierarchy is mapped to a flat array, joind with `|` into the `parentSuites` property of each __testcase__

### example xml

if you have this mocha testsuite
```js
  describe('1', function() {
    describe('1.1', function() {
      it('1.1.1', function() {});
      it('1.1.2', function() {});
    });
    describe('1.2', function() {
      it('1.2.1', function() {});
    });
    describe('1.3', function() {
      it('1.3.1', function() {});
    });
  });
```

the result will look like this xml

```xml
<?xml version="1.0"?>
<testsuites>
  <testsuite name="Chrome 41.0.2272 (Mac OS X 10.10.2)" package="foobar" timestamp="2015-03-24T14:04:24" id="0" hostname="antonsmac.local"  make_target="undefined" tests="12" errors="0" failures="0" time="0.183">
    <properties>
      <property name="browser.fullName" value="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.104 Safari/537.36"/>
    </properties>
    <testcase name="1.1.1" time="0" classname="lib.new-schedulemanager.tree-row.browser-test" package="foobar Chrome 41.0.2272 (Mac OS X 10.10.2)" parentSuites="1|1.1"/>
    <testcase name="1.1.2" time="0" classname="lib.new-schedulemanager.tree-row.browser-test" package="foobar Chrome 41.0.2272 (Mac OS X 10.10.2)" parentSuites="1|1.1"/>
    <testcase name="1.2.1" time="0" classname="lib.new-schedulemanager.tree-row.browser-test" package="foobar Chrome 41.0.2272 (Mac OS X 10.10.2)" parentSuites="1|1.2"/>
    <testcase name="1.3.1" time="0" classname="lib.new-schedulemanager.tree-row.browser-test" package="foobar Chrome 41.0.2272 (Mac OS X 10.10.2)" parentSuites="1|1.3"/>
    <system-out><![CDATA[
]]></system-out>
    <system-err/>
  </testsuite>
</testsuites>

```


----

For more information on Karma see the [homepage].


[homepage]: http://karma-runner.github.com
