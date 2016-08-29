
angular.module('app.photoManagement', []).directive('photomanagement', ['$http', 'UserProfileFactory', 'toaster', '$state', '$location', '$window', 'MediaFactory', 'broadcastService', '$stateParams', '$timeout',
    function($http, UserProfileFactory, toaster, $state, $location, $window, MediaFactory, broadcastService, $stateParams, $timeout) {

        return {

            restrict: 'AE',
            template: require('./photomanagement.html'),
            link: function(scope, element, attr) {


                scope.imageCtr = {

                    currentPage: 0,
                    pageSize: 50,
                    timeStamp: Date.now(),
                    imageArr: null,
                    searchType: $stateParams.searchType,
                    searchContent: $stateParams.searchContent
                }


                scope.updating = false;
                //Confirm Delete Photo
                broadcastService.subscribe("photoManagement::confirm_delete_photo", function(p, param) {

                    MediaFactory.del(param.imageId).then(function(res) {

                        if (res.data.result == 'OK') {

                            toaster.pop('success', "Photo " + param.imageId + " has been deleted");
                            scope.imageCtr.imageArr.splice(param.index, 1);
                        }
                    })

                })
                //unsubscribe from rootscope
                scope.$on('$destroy', function() {

                    broadcastService.unsubscribe('scroll:scroll');
                })

                broadcastService.subscribe('scroll:scroll', function() {

                    if ($(document).scrollTop() + $window.innerHeight >= $(document).height() - 500) {

                        if (scope.updating == false) {
                            scope.updating = true;
                            _getImageList();
                        }
                    }

                })

                scope.deletePhoto = function(imageId, index) {

                    broadcastService.publish('photoManagement::delete_photo', {
                        imageId: imageId,
                        index: index
                    });
                }

                scope.showDetailPhoto = function(imageId) {

                    $state.go('photoManagement.detailPhotoView', {
                        imageId: imageId
                    });

                }

                function _pushDisplayImage(res) {

                    if (scope.imageCtr.imageArr == null) {

                        scope.imageCtr.imageArr = res.data.data;


                    } else {

                        Array.prototype.push.apply(scope.imageCtr.imageArr, res.data.data);
                    }

                    if (res.data.data.length >= scope.imageCtr.pageSize) {

                        $timeout(function() {
                            scope.updating = false
                        }, 1000);

                    } else {

                        $('#updating').fadeOut();
                    }
                    toaster.pop('info', 'Retrive ' + res.data.data.length + ' images');
                }

                function _getImageList() {

                    scope.updating = true;

                    switch (scope.imageCtr.searchType) {


                        case 'general':

                            UserProfileFactory.adminMediaList(scope.imageCtr.currentPage++, scope.imageCtr.pageSize).then(function(res) {

                                _pushDisplayImage(res);
                            })

                            break;


                        case 'user':

                            MediaFactory.getUserMedia(scope.imageCtr.searchContent, scope.imageCtr.currentPage++, scope.imageCtr.pageSize).then(function(res) {

                                _pushDisplayImage(res)

                            })

                            break;


                        case 'tag':


                            MediaFactory.getImage(scope.imageCtr.currentPage++, scope.imageCtr.pageSize, scope.imageCtr.timeStamp, scope.imageCtr.searchContent).then(function(res) {

                                _pushDisplayImage(res);
                            })
                            break;

                        case 'photoId':


                            MediaFactory.getMedia(scope.imageCtr.searchContent).then(function(res) {

                                res.data.data = [];
                                res.data.data.push(res.data);
                                _pushDisplayImage(res);
                            })

                            break;


                        case 'location':

                            var lat = scope.imageCtr.searchContent.split(',')[0];
                            var lng = scope.imageCtr.searchContent.split(',')[1];
                            MediaFactory.getMapImage(scope.imageCtr.currentPage++, scope.imageCtr.pageSize, scope.imageCtr.timeStamp,'3500',lng,lat).then(function(res){

                                _pushDisplayImage(res);
                            })
                            break;


                        case 'scopeId':


                            MediaFactory.getScope(scope.imageCtr.searchContent, scope.imageCtr.currentPage++, scope.imageCtr.pageSize, scope.imageCtr.timeStamp).then(function(res) {

                                _pushDisplayImage(res);
                            })
                            break;


                    }


                }

                _getImageList();

            }
        }

    }
]).config(['$stateProvider', function($stateProvider) {

    $stateProvider.state('photoManagement.detailPhotoView', {
        template: "<div detailphotocontainer></div>",
        url: '/detailPhotoView/:imageId'
    })

}])