angular.module('app.system', ['ui.bootstrap']).directive('scopesystem', ['UserRegisterFactory', 'UserProfileFactory', '$http', 'toaster', '$state','MediaFactory', function(UserRegisterFactory, UserProfileFactory, $http, toaster, $state, MediaFactory) {

    require('./system.css');

    return {

        restrict: 'AE',
        template: require('./system.html'),
        scope: {},
        link: function(scope, element, attr) {

            scope.mediaCount = null;

            function _getSystemCount(){

                MediaFactory.count().then(function(res){

                    scope.mediaCount = res.data.total;
                })

                MediaFactory.countScope().then(function(res){

                    scope.scopeCount = res.data.total;
                })

                MediaFactory.countUser().then(function(res){

                    scope.userCount = res.data.total;
                })
            }

            _getSystemCount();

        }
    }

}])