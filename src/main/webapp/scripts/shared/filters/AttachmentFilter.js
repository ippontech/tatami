tatamiJHipsterApp
    .filter('attachedType', function () {
        return function (input) {

            var pics = [];
            var other = [];

            angular.forEach(input, function(attachment) {
               if (attachment.filename.endsWith('jpeg') || attachment.filename.endsWith('gif')
                   || attachment.filename.endsWith('png') || attachment.filename.endsWith('jpg') ) {
                   pics.push(attachment);
               } else {
                   other.push(attachment);
               }
            });

            return pics.concat(other);
        };
    });
