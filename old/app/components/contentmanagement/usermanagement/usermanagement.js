angular.module('app.userManagement', []).directive('usermanagement', ['$http', 'UserProfileFactory', 'toaster', '$state', '$location', '$window', 'MediaFactory', 'broadcastService', '$stateParams', '$timeout',
    function($http, UserProfileFactory, toaster, $state, $location, $window, MediaFactory, broadcastService, $stateParams, $timeout) {

        return {

            restrict: 'AE',
            template: require('./usermanagement.html'),
            link: function(scope, element, attr) {


                scope.userCtr = {

                    currentPage: 0,
                    pageSize: 57,
                    timeStamp: Date.now(),
                    userArr: null,
                    searchType: $stateParams.searchType,
                    searchContent: $stateParams.searchContent
                }

                scope.toUserMedia = function(user) {

                    $state.transitionTo('photoManagement', {
                        searchType: 'user',
                        searchContent: user.id
                    });
                }


                scope.showDetailUser = function(user) {

                    $state.go('userManagement.detailUserView', {
                        userId: user.id
                    });
                }

                scope.updating = false;

                scope.$on('$destroy', function() {

                    broadcastService.unsubscribe('scroll:scroll');
                })

                broadcastService.subscribe('scroll:scroll', function() {

                    if ($(document).scrollTop() + $window.innerHeight >= $(document).height() - 500) {

                        if (scope.updating == false) {

                            scope.updating = true;

                            _getUserList();
                        }
                    }

                })

                function _pushDisplayUser(res) {


                    if (scope.userCtr.userArr == null) {

                        scope.userCtr.userArr = res.data.data;


                    } else {

                        Array.prototype.push.apply(scope.userCtr.userArr, res.data.data);
                    }


                    if (res.data.data.length >= scope.userCtr.pageSize) {

                        $timeout(function() {
                            scope.updating = false
                        }, 1000);

                    } else {

                        $('#updating').fadeOut();
                    }
                    toaster.pop('info', 'Retrive ' + res.data.data.length + ' users');
                }

                function _getUserList() {

                    switch (scope.userCtr.searchType) {

                        case 'general':

                            UserProfileFactory.adminGetUser(scope.userCtr.currentPage++, scope.userCtr.pageSize, '').then(function(res) {

                                _pushDisplayUser(res);

                            })


                            break;


                        case 'id':

                            MediaFactory.getUserScope(0, 1, Date.now(), scope.userCtr.searchContent).then(function(res) {

                                res.data.data = [];
                                res.data.data.push(res.data.pageOwner);
                                _pushDisplayUser(res);

                            })


                            break;

                        case 'nikeName':

                            UserProfileFactory.adminGetUser(scope.userCtr.currentPage++, scope.userCtr.pageSize, scope.userCtr.searchContent).then(function(res) {

                                _pushDisplayUser(res);
                            })
                            break;


                    }


                }

                _getUserList();

            }
        }

    }
]).config(['$stateProvider', function($stateProvider) {



    $stateProvider.state('userManagement.detailUserView', {
        template: "<div detailusercontainer></div>",
        url: '/detailPhotoView/:userId'
        // resolve:{

        //     store: function($ocLazyLoad){

        //         return $ocLazyLoad.load(

        //             {name:"photoManagement",files:["components/PhotoManagement/photoManagement.js"]})
        //     }
        // }
    })

}])