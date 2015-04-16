# Angular Poller
[![Build Status](https://travis-ci.org/emmaguo/angular-poller.svg)](https://travis-ci.org/emmaguo/angular-poller)
[![Coverage Status](https://img.shields.io/coveralls/emmaguo/angular-poller.svg)](https://coveralls.io/r/emmaguo/angular-poller?branch=master)
[![devDependency Status](https://david-dm.org/emmaguo/angular-poller/dev-status.svg?theme=shields.io)](https://david-dm.org/emmaguo/angular-poller#info=devDependencies)

Lightweight [AngularJS](http://angularjs.org/) poller service which can be easily injected into controllers. It uses a timer and sends requests every few seconds to keep the client synced with the server. Angular Poller supports `$resource`, `$http` and `Restangular`.

Demo site: http://emmaguo.github.io/angular-poller/

## Table of contents
- [Install](#install)
- [Quick configuration](#quick-configuration)
- [Advanced usage](#advanced-usage)
	- [Customize $resource poller](#customize-resource-poller)
    - [Customize $http poller](#customize-http-poller)
    - [Customize Restangular poller](#customize-restangular-poller)
	- [Error handling](#error-handling)
	- [Multiple pollers](#multiple-pollers)
	- [Multiple controllers](#multiple-controllers)
	- [Only send new request if the previous one is resolved](#only-send-new-request-if-the-previous-one-is-resolved)
	- [Always create new poller on calling poller.get](#always-create-new-poller-on-calling-pollerget)
    - [Automatically stop all pollers when navigating between views](#automatically-stop-all-pollers-when-navigating-between-views)
    - [Automatically reset all pollers when navigating between views](#automatically-reset-all-pollers-when-navigating-between-views)
- [Supported Angular versions](#supported-angular-versions)
- [License](#license)

## Install

Install with `bower`:

```shell
bower install angular-poller
```

Add a `<script>` to your `index.html`:

```html
<script src="/bower_components/angular-poller/angular-poller.js"></script>
```

Or use [cdnjs](https://cdnjs.com/libraries/angular-poller) files:
```html
<script src="http://cdnjs.cloudflare.com/ajax/libs/angular-poller/0.3.1/angular-poller.js"></script>
```

## Quick configuration
```javascript
// Inject angular poller service.
var myModule = angular.module('myApp', ['emguo.poller']);

myModule.controller('myController', function($scope, $resource, poller) {

    // Define your resource object.
    var myResource = $resource(url[, paramDefaults]);

    // Get poller. This also starts/restarts poller.
    var myPoller = poller.get(myResource);

    // Update view. Since a promise can only be resolved or rejected once but we want
    // to keep track of all requests, poller service uses the notifyCallback. By default
    // poller only gets notified of success responses.
    myPoller.promise.then(null, null, callback);

    // Stop poller.
    myPoller.stop();

    // Restart poller.
    myPoller.restart();
});
```

## Advanced usage

### Customize $resource poller
```javascript
// Inject angular poller service.
var myModule = angular.module('myApp', ['emguo.poller']);

myModule.controller('myController', function($scope, $resource, poller) {

    // Define your resource object.
    var myResource = $resource(url[, paramDefaults], {
        myQuery: {
            method: 'GET',
            isArray: true,
            headers: ...
        },
        ...
    });

    // Get poller.
    var myPoller = poller.get(myResource, {
        action: 'myQuery',
        delay: 6000,
        argumentsArray: [
            {
                verb: 'greet',
                salutation: 'Hello'
            }
        ]
    });

    myPoller.promise.then(null, null, callback);
});
```
Similar to how you invoke action methods on the class object or instance object directly ([$resource](https://docs.angularjs.org/api/ngResource/service/$resource)), the format of `argumentsArray` is:
- HTTP GET "class" actions: `[parameters]`
- non-GET "class" actions: `[parameters], postData`
- non-GET instance actions: `[parameters]`

### Customize $http poller
```javascript
myModule.controller('myController', function($scope, poller) {

    // Get poller.
    var myPoller = poller.get('api/test/123', {
        action: 'jsonp',
        delay: 6000,
        argumentsArray: [
            {
                params: {
                    param1: 1,
                    param2: 2
                },
                headers: {
                    header1: 1
                }
            }
        ]
    });

    myPoller.promise.then(null, null, callback);
});
```
The format of `argumentsArray` is:
- `GET`, `DELETE`, `HEAD` and `JSONP` requests: `[config]`
- `POST`, `PUT`, `PATCH` requests: `data, [config]`

`config` is the object describing the request to be made and how it should be processed. It may contain `params`, `headers`, `xsrfHeaderName` etc. Please see `$http` [documentation](https://docs.angularjs.org/api/ng/service/$http) for more information.

### Customize Restangular poller
```javascript
myModule.controller('myController', function($scope, Restangular, poller) {

    // Get poller.
    var myPoller = poller.get(Restangular.one('test', 123), {
        action: 'get',
        delay: 6000,
        argumentsArray: [
            {
                param1: 1,
                param2: 2
            },
            {
                header1: 1
            }
        ]
    });

    myPoller.promise.then(null, null, callback);
});
```
Angular Poller supports all [Restangular action methods](https://github.com/mgonto/restangular#methods-description). Here `argumentsArray` is exactly the same as the input arguments for the original method function. For instance the `argumentsArray` for element method `getList(subElement, [queryParams, headers])` would be `subElement, [queryParams, headers]`, and the `argumentsArray` for collection method `getList([queryParams, headers])` would be `[queryParams, headers]`, etc.

### Error handling
One way to capture error responses is to use the `catchError` option. It indicates whether poller should get notified of error responses.
```javascript
var myPoller = poller.get(myTarget, {
    catchError: true
});

myPoller.promise.then(null, null, function (result) {

    // If catchError is set to true, this notifyCallback can contain either
    // a success or an error response.
    if (result.$resolved) {

        // Success handler ...
    } else {

        // Error handler: (data, status, headers, config)
        if (result.status === 503) {
            // Stop poller or provide visual feedback to the user etc
            poller.stopAll();
        }
    }
});
```

Alternatively you can use AngularJS `interceptors` for global error handling like so:
```javascript
angular.module('myApp', ['emguo.poller'])
    .config(function ($httpProvider) {
        $httpProvider.interceptors.push(function ($q, poller) {
            return {
                'responseError': function (rejection) {
                    if (rejection.status === 503) {
                        // Stop poller or provide visual feedback to the user etc
                        poller.stopAll();
                    }
                    return $q.reject(rejection);
                }
            };
        });
    });
```

You may also use `setErrorInterceptor` if you are using Restangular.

### Multiple pollers
```javascript
// Inject angular poller service.
var myModule = angular.module('myApp', ['emguo.poller']);

myModule.controller('myController', function($scope, poller) {

    var poller1 = poller.get(target1),
        poller2 = poller.get(target2);

    poller1.promise.then(null, null, callback);
    poller2.promise.then(null, null, callback);

    // Total number of pollers
    console.log(poller.size());

    // Stop all pollers.
    poller.stopAll();

    // Restart all pollers.
    poller.restartAll();

    // Stop and remove all pollers.
    poller.reset();
});
```

### Multiple controllers
```javascript
// Inject angular poller service.
var myModule = angular.module('myApp', ['emguo.poller']);

myModule.factory('myTarget', function () {
    // return $resource object, Restangular object or $http url.
    return ...;
});

myModule.controller('controller1', function($scope, poller, myTarget) {
    // Register and start poller.
    var myPoller = poller.get(myTarget);
    myPoller.promise.then(null, null, callback);
});

myModule.controller('controller2', function($scope, poller, myTarget) {
    // Get existing poller and restart it.
    var myPoller = poller.get(myTarget);
    myPoller.promise.then(null, null, callback);
});

myModule.controller('controller3', function($scope, poller, myTarget) {
    poller.get(myTarget).stop();
});
```

### Only send new request if the previous one is resolved
Use the `smart` option to make sure poller only sends new request after the previous one is resolved. It is set to `false` by default.
```javascript
var myPoller = poller.get(myTarget, {
    action: 'query',
    delay: 6000,
    argumentsArray: [
        {
            verb: 'greet',
            salutation: 'Hello'
        }
    ],
    smart: true
});
```

### Always create new poller on calling `poller.get`
By default `poller.get(target, ...)` looks for any existing poller by `target` in poller registry. If found, it overwrites
existing poller with new parameters such as `action`, `delay`, `argumentsArray` etc if specified, and then restarts the poller.
If not found, it creates and starts a new poller. It means you will never have two pollers running against the same target.

But if you do want to have more than one poller running against the same target, you can force poller to always create new
poller on calling `poller.get` like so:

```javascript
var myModule = angular.module('myApp', ['emguo.poller']);

myModule.config(function (pollerConfig) {
    pollerConfig.neverOverwrite = true;
});
```

### Automatically stop all pollers when navigating between views
In order to automatically stop all pollers when navigating between views with multiple controllers, you can use `pollerConfig`.
```javascript
var myModule = angular.module('myApp', ['emguo.poller']);

myModule.config(function (pollerConfig) {
    pollerConfig.stopOnStateChange = true; // If you use $stateProvider from ui-router.
    pollerConfig.stopOnRouteChange = true; // If you use $routeProvider from ngRoute.
});
```

### Automatically reset all pollers when navigating between views
You can also use `pollerConfig` to automatically reset all pollers when navigating between views with multiple controllers.
It empties poller registry in addition to stopping all pollers. It means `poller.get` will always create a new poller.
```javascript
var myModule = angular.module('myApp', ['emguo.poller']);

myModule.config(function (pollerConfig) {
    pollerConfig.resetOnStateChange = true; // If you use $stateProvider from ui-router.
    pollerConfig.resetOnRouteChange = true; // If you use $routeProvider from ngRoute.
});
```

## Supported Angular versions

Angular Poller supports Angular 1.2.0 - 1.3.x.

## License

The MIT License (MIT)

Copyright (c) 2013-2014 Emma Guo

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.