# angular-bootstrap-tour
[![Bower Version][bower-image]][bower-url]

## About

This is a simple Angular wrapper around [Bootstrap Tour](http://www.bootstraptour.com).
Simply add the "tour" directive anywhere, and add the "tour-step" directive to any element within "tour" that needs a tip.

All [options](http://bootstraptour.com/api/) are available by adding the corresponding attributes to the directive element.

There is also a "skip" option that if evaluates to true, will skip over the step.

This repository was scaffolded with [generator-microjs](https://github.com/daniellmb/generator-microjs).

## Getting Started
Get the package:

    bower install angular-bootstrap-tour

Add the script tags:

    <script src="bower_components/jquery/dist/jquery.js"></script>
    <script src="bower_components/angular/angular.js"></script>
    <script src="bower_components/bootstrap/dist/js/bootstrap.js"></script>
    <script src="bower_components/bootstrap-tour/build/js/bootstrap-tour.js"></script>
    <script src="bower_components/angular-bootstrap-tour/dist/angular-bootstrap-tour.js"></script>

And the Bootstrap Tour CSS (or create your own):

    <link rel="stylesheet" href="bower_components/bootstrap-tour/build/css/bootstrap-tour.css" />

Then add the module to your app:

    angular.module('myApp', ['bm.bsTour']);
    
## Configuration
    
The TourConfigProvider allows you to set a couple options:
- `prefixOptions` {boolean, default: false} if set to true will require directive options to be prefixed to avoid conflicts
- `prefix` {string, default: 'bsTour'} the prefix to use if `prefixOptions` is set to `true`

Use `TourConfigProvider.set(<option>, <value>)` in your app's config block to change the settings

You can use either `tour` and `tourStep` or `bsTour` and `bsTourStep` as directive names without changing config.

## Examples

    <div tour placement="top" on-end="onTourEnd(tour)" after-get-state="afterGetStateFunction" template-url="tour_template.html">
        <div id="mainMenu" tour-step title="Main Menu" content="{{mainMenuDescription}}" order="0" skip="pageName !== 'home'">
            ...
        </div>

        ...

    </div>


### Tour Directive

The tour directive creates a wrapper that contains all tour steps, and adds the tour object to the scope. If no options are specified, they all default to Bootstrap Tour's defaults.
Values of event handler options will be evaluated against the tour's scope. For the afterGetState, afterSetState, and afterRemoveState, the value should
evaluate to a function that takes 2 arguments, key and value. The container option should be a CSS selector, and defaults to "body".
You can also pass an object to the tour-options attribute that will override any other attribute options.

### TourStep Directive

The tour-step directive takes all the options available in Bootstrap Tour, with a few alterations. Instead of next and prev options, just use the "order" option.
Order is used as a weighting (0 is first) and the plugin will dynamically determine which ones come before and after. If order is ommitted, it will default to 0.
Multiple steps can have the same order, and those will display in the order that they are linked (usually the order in which they appear in the DOM.)
If order is omitted from all tour-steps, the order will be whatever order in which they are linked. Steps can be skipped by passing the "skip" option an expression that evaluates to a boolean.
The expression is evaluated before each step, so it can be a dynamic expression. This is useful if you have steps in a global layout, but only want to show them on the home page.
Steps that are on hidden elements will not be shown. (Hidden means truly hidden, not obscured.)
The title and contents options are watched, so an interpolated value can be passed.

## Compatibility

I have tested it and found it working in the following browsers:

- IE8, 9, 10, 11
- Firefox 32
- Chrome 37
- Safari 7


## TODO's

- Write some tests!! (Come on Ben, stop being lazy ;p)

## Build It Yourself

Assuming you have Node, grunt, and bower installed:

    npm install

    bower install

    grunt
    
## Demo
    
I have set up a simple demo using the Bootswatch Cerulean demo page (one of my favorite themes.) To run the demo run `grunt demo` and open demo/index.html in the browser.


## Notes

I am using this in a personal project, but I haven't needed to use all the Bootstrap Tour options. This means that some of them might not be working
due to the option values either not being passed correctly, or not being passed as interpolated values.
If you run across any issues please report them with an example and I will fix them ASAP, or fork me and create a PR.
You can now pass a template URL to either the tour or tour-step directives, and the template will be linked to whichever scope the template is specified on.
(ie. if you add the template URL to the tour directive, it will always use the tour directive's scope, if you add it to a step, it will use the step's scope.)
Alternatively, you can specify an expression that evaluates to a string that will be used as the template (using the "template" attribute.)

Thanks and enjoy!

## License

(The MIT License)

Copyright (c) 2014  

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.



[build-url]: https://travis-ci.org/benmarch/angular-bootstrap-tour
[build-image]: http://img.shields.io/travis/benmarch/angular-bootstrap-tour.png

[gpa-url]: https://codeclimate.com/github/benmarch/angular-bootstrap-tour
[gpa-image]: https://codeclimate.com/github/benmarch/angular-bootstrap-tour.png

[coverage-url]: https://codeclimate.com/github/benmarch/angular-bootstrap-tour/code?sort=covered_percent&sort_direction=desc
[coverage-image]: https://codeclimate.com/github/benmarch/angular-bootstrap-tour/coverage.png

[depstat-url]: https://david-dm.org/benmarch/angular-bootstrap-tour
[depstat-image]: https://david-dm.org/benmarch/angular-bootstrap-tour.png?theme=shields.io

[issues-url]: https://github.com/benmarch/angular-bootstrap-tour/issues
[issues-image]: http://img.shields.io/github/issues/benmarch/angular-bootstrap-tour.png

[bower-url]: http://bower.io/search/?q=angular-bootstrap-tour
[bower-image]: https://badge.fury.io/bo/angular-bootstrap-tour.png

[downloads-url]: https://www.npmjs.org/package/angular-bootstrap-tour
[downloads-image]: http://img.shields.io/npm/dm/angular-bootstrap-tour.png

[npm-url]: https://www.npmjs.org/package/angular-bootstrap-tour
[npm-image]: https://badge.fury.io/js/angular-bootstrap-tour.png

[irc-url]: http://webchat.freenode.net/?channels=angular-bootstrap-tour
[irc-image]: http://img.shields.io/badge/irc-%23angular-bootstrap-tour-brightgreen.png

[gitter-url]: https://gitter.im/benmarch/angular-bootstrap-tour
[gitter-image]: http://img.shields.io/badge/gitter-benmarch/angular-bootstrap-tour-brightgreen.png

[tip-url]: https://www.gittip.com/benmarch
[tip-image]: http://img.shields.io/gittip/benmarch.png
