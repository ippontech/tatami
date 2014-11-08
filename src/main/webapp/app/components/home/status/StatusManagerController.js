/**
 * This controller allows a modal instance to be created
 */

StatusModule.controller('StatusManagerController', ['$scope', '$modal', function($scope, $modal) {
    $scope.open = function() {
        var options = {
            backdropClick: false,
            backdropFade: true,
            templateUrl: '/app/components/home/status/StatusView.html',
            /*
            template: '<div class="modal-header">' +
            '<button type="button" class="close" data-dismiss="modal" aria-hidden="true" ng-click="cancel()">&times;</button>'+
            '<h4 class="modal-title"><fmt:message key="tatami.status.update"/></h4>'+
        '</div>'+
            '<div class="modal-body">'+
                '<a ng-click="current.preview = !current.preview" class="edit-tatam-float-right">'+
                    '<i ng-if="current.preview" class="glyphicon glyphicon-edit close" title="<fmt:message key="tatami.status.editor"/>"></i>'+
                    '<i ng-if="!current.preview" class="glyphicon glyphicon-eye-open close" title="<fmt:message key="tatami.status.preview"/>"></i>'+
                '</a>'+
                '<fieldset ng-if="!current.preview" class="edit-tatam row-fluid">'+
                    '<textarea ng-model="status.content" ng-change="statusChange(status.content)" placeholder="<fmt:message key="tatami.status.update"/>" maxlength="750" rows="5" required="required"></textarea>'+
                    '<em>'+
                        '<fmt:message key="tatami.status.characters.left"/>'+
                        '<span class="countstatus badge">{{750-status.content.length}}</span>'+
                    '</em>'+
                '</fieldset>'+
                '<fieldset ng-if="current.preview" class="preview-tatam row-fluid">'+
                    '<div class="well well-small markdown">{{status.content}}</div>'+
                '</fieldset>'+
                '<fieldset ng-show="current.reply" class="reply row-fluid">'+
                    '<legend>'+
                        '<fmt:message key="tatami.status.reply"/>'+
                    '</legend>'+
                    '<div class="tatam-reply"/>'+
                '</fieldset>'+
                '<fieldset class="row-fluid">'+
                    '<legend>'+
                        '<fmt:message key="tatami.status.options"/>'+
                    '</legend>'+
                    '<div>'+
                        '<label>'+
                            '<input type="checkbox" ng-model="current.geoLoc" ng-change="updateLocation()"><span class="glyphicon glyphicon-map-marker">'+
                            '</span>'+
                                '<fmt:message key="tatami.status.geoLocalization"/>'+
                            '</label>'+
                            '<div ng-if="current.geoLoc">'+
                                '<div id="simpleMap" style="height:250px; width:500px"></div>'+
                                '<div class="geolocMap">'+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                        '<div>'+
                            '<label class="control-label"><fmt:message key="tatami.group.name"/></label>'+
                            '<select ng-model="status.groupId" ng-options="group.groupId as group.name for group in current.groups">'+
                                '<option></option>'+
                            '</select>'+
                        '</div>'+
                        '<div class="controls status-files">'+
                            '<label>'+
                                '<fmt:message key="tatami.menu.files"/>'+
                            '</label>'+
                            '<div class="attachmentBar progress progress-striped active" style="display: none;">'+
                                '<div class="bar progress-bar progress-bar-info" style="width: 0%;"></div>'+
                            '</div>'+
                            '<div class="dropzone well" file-dropzone>'+
                                '<fmt:message key="tatami.status.update.drop.file"/>'+
                            '</div>'+

                            '<input style="display: none;" class="updateStatusFileupload" type="file" name="uploadFile" data-url="/tatami/rest/fileupload" multiple/>'+
                            '<div class="fileUploadResults wrap">'+

                            '</div>'+
                        '</div>'+
                        '<div class="controls status-private">'+
                            '<label class="checkbox">'+
                                '<input ng-model="status.statusPrivate" id="statusPrivate" name="statusPrivate" type="checkbox" value="true">'+
                                    '<span class="glyphicon glyphicon-lock"></span> Private Message'+
                                '</label>'+
                            '</div>'+
                        '</fieldset>'+
                    '</div>'+
                    '<div class="modal-footer">'+
                        '<a class="btn" data-dismiss="modal" aria-hidden="true" ng-click="cancel()">'+
                            'Cancel'+
                        '</a>'+
                        '<span class="hidden-label submit-label"><fmt:message key="tatami.form.save"/></span>'+
                        '<span class="hidden-label tatam-mandatory"><fmt:message key="tatami.tatam.mandatory"/></span>'+
                        '<input ng-click="submit()" type="submit" class="btn btn-primary submit" data-buttonText="">'+
                        '</div>',*/
            controller: 'StatusCreateController'
        }
        var modalInstance = $modal.open(options);
        console.log(modalInstance);
    }
}]);