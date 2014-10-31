/**
 * .
 */
angular.module('TatamiApp')
    .directive('file-dropzone',function(){
        return{
            restrict: 'A',
            link: function(scope, elem){
                elem.bind('drop', function(e){
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('File dropped here');
                })
            }
        }
    });
