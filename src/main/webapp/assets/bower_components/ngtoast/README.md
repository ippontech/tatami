ngToast [![Code Climate](http://img.shields.io/codeclimate/github/tameraydin/ngToast.svg?style=flat)](https://codeclimate.com/github/tameraydin/ngToast/dist/ngToast.js) [![Build Status](http://img.shields.io/travis/tameraydin/ngToast/master.svg?style=flat)](https://travis-ci.org/tameraydin/ngToast)
=======

ngToast is a simple Angular provider for toast notifications.

**[Demo](http://tameraydin.github.io/ngToast)**

## Usage

1. Download:
  ```console
  bower install ngtoast
  ```
  or manually from [dist](https://github.com/tameraydin/ngToast/tree/master/dist).

2. Include ngToast source files and dependencies ([ngAnimate](http://docs.angularjs.org/api/ngAnimate), [ngSanitize](http://docs.angularjs.org/api/ngSanitize), [Bootstrap CSS](http://getbootstrap.com/)):
  ```html
  <link rel="stylesheet" href="bower/bootstrap/dist/css/bootstrap.min.css">
  <link rel="stylesheet" href="bower/ngtoast/dist/ngToast.min.css">
  
  <script src="bower/angular-animate/angular-animate.min.js"></script>
  <script src="bower/angular-sanitize/angular-sanitize.min.js"></script>
  <script src="bower/ngtoast/dist/ngToast.min.js"></script>
  ```
 *Note: only the [Alerts](http://getbootstrap.com/components/#alerts) component is used as style base, so you don't have to include complete CSS*

3. Include ngToast as a dependency in your application module:
  ```javascript
  var app = angular.module('myApp', ['ngToast']);
  ```

4. Place `toast` element into your HTML:
  ```html
  <body>
    <toast></toast>
    ...
  </body>
  ```

5. Inject ngToast provider in your controller:
  ```javascript
  app.controller('myCtrl', function(ngToast) {
    ngToast.create('a toast message...');
  });
  ```

## Settings & API

Please find at the [project website](http://tameraydin.github.io/ngToast/#api).

## Development

* Install dependencies: `npm install`
* Play on **/src**
* Run `grunt`

## License

MIT [http://tameraydin.mit-license.org/](http://tameraydin.mit-license.org/)

## TODO
- Add unit & e2e tests
- Improve API documentation
