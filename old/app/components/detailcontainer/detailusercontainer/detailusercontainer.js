angular.module('app.detailUserContainer',[]).directive('detailusercontainer',['$http', 'MediaFactory','toaster','broadcastService','$stateParams','$window','$state','$location','UserProfileFactory',function($http,MediaFactory,toaster,broadcastService,$stateParams,$window,$state,$location,UserProfileFactory){

    return {

        restrict:'AE',
        template:require('./detailusercontainer.html'),
        link:function(scope){


            $('body').css('overflow','hidden');
            scope.userId = $stateParams.userId;
            _getUser(scope.userId);

            scope.showEditing = function(currentUser){

                currentUser.currentUserCp = JSON.parse(JSON.stringify(currentUser));
                currentUser.showEditing = true;
            }
            scope.cancelEditing = function(currentUser){

                scope.currentUser.showEditing = false;
            }

            function _getUser(userId){

                UserProfileFactory.getOneUser(userId).then(function(res){

                    scope.currentUser = res.data;
                })


            }

            scope.updateUser = function(currentUser){

                MediaFactory.updateUser(currentUser.currentUserCp).then(function(res){

                    if(res.data.result == "OK"){

                        toaster.pop('success','User ' + currentUser.id + ' has been updated');

                        for(var i in currentUser){

                            if(i != 'currentUserCp' && i != 'showEditing' ){

                                if(currentUser[i] != currentUser.currentUserCp[i]){
                                    currentUser[i] = currentUser.currentUserCp[i]
                                }
                            }
                        }

                        currentUser.showEditing = false;
                        scope.updated = true;
                    }

                })
            }
            scope.$on('$stateChangeStart',function(){

                $('body').css('overflow','auto');
            })
            scope.back = function(){
                if(scope.updated)
                    $state.transitionTo('userManagement',{searchType:$stateParams.searchType,searchContent:$stateParams.searchContent},{reload:true});
                else
                    $window.history.back();
            }
        }

    }
}])