export default ngModule => {

    ngModule.config(function($stateProvider,$urlRouterProvider){

        $urlRouterProvider.otherwise("/photoManagement?searchType=general");

        $stateProvider.state('photoManagement',{

            template:"<div photomanagement></div>",
            url:'/photoManagement?:searchType&:searchContent'
        }).state('scopeManagement',{

            template:"<div scopemanagement></div>",
            url:'/scopeManagement?:searchType&:searchContent'
        }).state('featureManagement',{

            template:"<div featuremanagement></div>",
            url:'/featureManagement'
        }).state('userManagement',{

            template:"<div usermanagement></div>",
            url:'/userManagement?:searchType&:searchContent'

        }).state('systemInfo',{

            template:"<div scopesystem></div>",
            url:'/system'
        })


    }).directive('scroll',['broadcastService','$window',function(broadcastService,$window){

        return{

            restrict:'AE',
            link:function(scope, element, attrs){

                angular.element($window).on('scroll',function(){

                    broadcastService.publish('scroll:scroll');

                })
            }
        }

    }])




}