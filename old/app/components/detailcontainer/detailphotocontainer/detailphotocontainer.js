angular.module('app.detailPhotoContainer',[]).directive('detailphotocontainer',['$http', 'MediaFactory','toaster','broadcastService','$stateParams','$window','$state','$location',function($http,MediaFactory,toaster,broadcastService,$stateParams,$window,$state,$location){

    return {

        restrict:'AE',
        template:require('./detailphotocontainer.html'),
        link:function(scope){

            // $location.path('detailImage/imageId=' + $stateParams.imageId);
            $('body').css('overflow','hidden');
            scope.loadingAnimation = true;
            scope.imageId = $stateParams.imageId;

            scope.$on('$stateChangeStart',function(){
                $('body').css('overflow','auto');
            })

            function _getImage(imageId){

                MediaFactory.get(imageId).then(function(res){

                    scope.image = res.data
                    scope.loadingAnimation = false;
                    toaster.pop("info","Retrive ID" + scope.imageId);
                })
            }

            scope.back = function(){

                // $state.transitionTo('photoManagement',{searchType:$stateParams.searchType,searchContent:$stateParams.searchContent},{reload:false})
                $window.history.back();
            }

            _getImage(scope.imageId);
            // broadcastService.subscribe('event::show_detail_photo',)

        }

    }

}])