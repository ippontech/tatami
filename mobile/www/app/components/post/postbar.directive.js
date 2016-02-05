(function() {
    'use strict';

    angular.module('tatami')
        .directive('tatamiPostBarAttach', tatamiPostBar);

    function tatamiPostBar() {
        var directive = {
            restrict: 'A',
            link: link
        };

        return directive;
    }

    function link(scope, element, attrs) {
        ionic.on('native.keyboardshow', onShow, window);
        ionic.on('native.keyboardhide', onHide, window);

        //deprecated
        ionic.on('native.showkeyboard', onShow, window);
        ionic.on('native.hidekeyboard', onHide, window);


        var scrollCtrl;

        function onShow(e) {
            if (ionic.Platform.isAndroid() && !ionic.Platform.isFullScreen) {
                return;
            }


            if(attrs['tatamiPostBarAttach'] === 'true') {
                var subheaderOffset = 43;
            }
            //for testing
            var keyboardHeight = e.keyboardHeight || e.detail.keyboardHeight;
            element.css('bottom', (keyboardHeight + subheaderOffset) + "px");
            scrollCtrl = element.controller('$ionicScroll');
            if (scrollCtrl) {
                scrollCtrl.scrollView.__container.style.bottom = subheaderOffset + keyboardHeight + keyboardAttachGetClientHeight(element[0]) + "px";
            }
        }

        function onHide() {
            if (ionic.Platform.isAndroid() && !ionic.Platform.isFullScreen) {
                return;
            }

            element.css('bottom', '');
            if (scrollCtrl) {
                scrollCtrl.scrollView.__container.style.bottom = '';
            }
        }

        scope.$on('$destroy', function() {
            ionic.off('native.keyboardshow', onShow, window);
            ionic.off('native.keyboardhide', onHide, window);

            //deprecated
            ionic.off('native.showkeyboard', onShow, window);
            ionic.off('native.hidekeyboard', onHide, window);
        });

        function keyboardAttachGetClientHeight(element) {
            return element.clientHeight;
        }

    }
})();
