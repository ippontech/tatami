/**
 * Created by emilyklein on 7/22/16.
 */
(function() {
    'use strict';

    angular.module('tatami.services')
        .factory('ToastService', ToastService);

    ToastService.$inject = ['$window', '$translate', 'ionicToast'];
    function ToastService($window, $translate, ionicToast) {

        var service = {
            display: displayToast
        };

        return service;

        setFromLocalStorage.$inject = ['toastMessage'];
        function displayToast(toastMessage){
            $translate(toastMessage).then(function(msg){
                if (ionic.Platform.isIOS()){
                    ionicToast.show(msg, 'top', false, 2000);
                }
                else{
                    ionicToast.show(msg, 'bottom', false, 2000);
                }
            });
        }

    }
})();
