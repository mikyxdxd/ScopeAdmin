
angular.module('app.scopeManagement', []).directive('scopemanagement', ['$http', 'UserProfileFactory', 'toaster', '$state', '$location', '$window', 'MediaFactory', 'broadcastService', '$stateParams', '$timeout',
    function($http, UserProfileFactory, toaster, $state, $location, $window, MediaFactory, broadcastService, $stateParams, $timeout) {

        return {

            restrict: 'AE',
            template: require('./scopemanagement.html'),
            link: function(scope, element, attr) {

                scope.scopeCtr = {

                    currentPage: 0,
                    pageSize: 50,
                    tiemStamp: Date.now(),
                    scopeArr: null,
                    searchType: $stateParams.searchType,
                    searchContent: $stateParams.searchContent
                }

                scope.updating = false;

                broadcastService.subscribe("scopeManagement::confirm_delete_scope", function(p, param) {

                })

                scope.$on('$destroy', function() {

                    broadcastService.unsubscribe('scroll:scroll');
                })

                broadcastService.subscribe('scroll:scroll', function() {

                    if ($(document).scrollTop() + $window.innerHeight >= $(document).height() - 500) {

                        if (scope.updating == false) {

                            scope.updating = true;

                            _getScopeList();
                        }
                    }

                })


                scope.showDetailScope = function(scope) {

                    $state.go('scopeManagement.detailScopeView', {
                        scopeId: scope.id
                    });

                }

                function _pushDisplayScope(res) {


                    if (scope.scopeCtr.scopeArr == null) {

                        scope.scopeCtr.scopeArr = res.data.data;


                    } else {

                        Array.prototype.push.apply(scope.scopeCtr.scopeArr, res.data.data);
                    }


                    if (res.data.data.length >= scope.scopeCtr.pageSize) {

                        $timeout(function() {
                            scope.updating = false
                        }, 1000);

                    } else {

                        $('#updating').fadeOut();
                    }
                    toaster.pop('info', 'Retrive ' + res.data.data.length + ' scopes');
                }

                function _getScopeList() {

                    switch (scope.scopeCtr.searchType) {

                        case 'general':


                            MediaFactory.getScopes(scope.scopeCtr.currentPage++, scope.scopeCtr.pageSize, scope.scopeCtr.timeStamp, '').then(function(res) {

                                _pushDisplayScope(res);

                            })


                            break;


                        case 'tag':


                            MediaFactory.getScopes(scope.scopeCtr.currentPage++, scope.scopeCtr.pageSize, scope.scopeCtr.timeStamp, scope.scopeCtr.searchContent).then(function(res) {

                                _pushDisplayScope(res);

                            })


                            break;


                        case 'id':


                            MediaFactory.getScopeInfo(scope.scopeCtr.searchContent).then(function(res) {

                                res.data.data = [];
                                res.data.data.push(res.data);
                                _pushDisplayScope(res);
                            })



                            break;

                        case 'location':

                            var lat = scope.scopeCtr.searchContent.split(',')[0];
                            var lng = scope.scopeCtr.searchContent.split(',')[1];

                            MediaFactory.getMapScope(scope.scopeCtr.currentPage++, scope.scopeCtr.pageSize, scope.scopeCtr.timeStamp, '3500', lng, lat).then(function(res) {

                                _pushDisplayScope(res);

                            })


                            break;

                        case 'userId':

                            MediaFactory.getUserScope(scope.scopeCtr.currentPage++, scope.scopeCtr.pageSize, scope.scopeCtr.timeStamp, scope.scopeCtr.searchContent).then(function(res) {

                                _pushDisplayScope(res);
                            })


                            break;


                    }

                }

                _getScopeList();

            }
        }

    }
]).config(['$stateProvider', function($stateProvider) {

    $stateProvider.state('scopeManagement.detailScopeView', {
        template: "	<div detailscopecontainer></div>",
        url: '/detailScopeView/:scopeId'
    })

}])