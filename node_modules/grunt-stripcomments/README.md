# grunt-stripcomments

> Remove comments from production ready code

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-stripcomments --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-stripcomments');
```

## The "comments" task

### Overview
In your project's Gruntfile, add a section named `comments` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  comments: {
    your_target: {
      // Target-specific file lists and/or options go here.
      options: {
          singleline: true,
          multiline: true
      },
      src: [ 'src/*.js'] // files to remove comments from
    },
  },
});
```

### Options

#### options.singleline
Type: `Boolean`
Default value: `true`

Determines whether or not to remove single line comments

#### options.multiline
Type: `Boolean`
Default value: `true`

Determines whether or not to remove multi line comments

### Usage Examples

```js
grunt.initConfig({
  comments: {
    js: {
      options: {
        singleline: true,
        multiline: false
      },
      src: [ 'src/*.js' ]
    },
    php: {
      options: {
        singleline: true,
        multiline: true
      },
      src: [ 'lib/*.php' ]
    }
  },
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
v 0.1.0 - alpha release
