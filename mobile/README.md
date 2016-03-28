Tatami Mobile Beta
==================

If interested in the mobile beta, follow these steps:

Prepare Project
---------------

- Clone, fork or download the source code from this Github page
- Install [Maven](http://maven.apache.org/)
- Install [Ionic](http://ionicframework.com/)
    - `npm install -g cordova ionic`
- Point your terminal to the directory you cloned Tatami to.
    - `cd mobile`
- Run Maven : `mvn -Pmobile-prod install`

Deploy to Device
----------------

### iOS
- Open Xcode
- Open `tatami/mobile/platforms/ios/Tatami.xcodeproj`
- Connect device
- Click play on top left


### Android

- Connect device
- Run the following command
    - `ionic build android && ionic run android`

