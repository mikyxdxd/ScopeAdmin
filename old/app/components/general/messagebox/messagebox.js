angular.module('app.messageBox',[]).directive('messagebox',['UserRegisterFactory','UserProfileFactory','$http','toaster','broadcastService',function(UserRegisterFactory,UserProfileFactory,$http, toaster,broadcastService){

    require('./messagebox.css');
    return {

        restrict:'AE',
        template:require('./messagebox.html'),
        link:function(scope,element,attr){

            scope.displayBox = false;
            scope.message = "Do you wish to delete this image ?"

            broadcastService.subscribe('photoManagement::delete_photo',function(params1,params2){

                scope.sender = 'photoManagement';
                scope.contentId = params2.imageId;
                scope.contentIndex = params2.index;
                // scope.params = params;
                scope.message = "Do you wish to delete this image ?"
                scope.displayBox = true;

            })

            broadcastService.subscribe('featureManagement::delete_feature',function(params1,params2){

                scope.sender = 'featureManagement';
                scope.contentId = params2.featureId;
                scope.contentIndex = params2.index;
                // scope.params = params;
                scope.message = "Do you wish to delete this feature ?"
                scope.displayBox = true;

            })



            scope.confirm = function(){

                switch (scope.sender){

                    case 'photoManagement':
                        broadcastService.publish('photoManagement::confirm_delete_photo',{imageId:scope.contentId , index:scope.contentIndex});
                        break;

                    case 'featureManagement':
                        broadcastService.publish('featureManagement::confirm_delete_feature',{featureId:scope.contentId , index:scope.contentIndex});
                        break;
                }

                scope.displayBox = false;

            }

            scope.cancel = function(){

                scope.displayBox = false;

            }

        }
    }}

])