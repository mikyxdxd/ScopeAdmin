angular.module('app.detailScopeContainer',[]).directive('detailscopecontainer',['$http', 'MediaFactory','toaster','broadcastService','$stateParams','$window','$state','$location',function($http,MediaFactory,toaster,broadcastService,$stateParams,$window,$state,$location){

    return {

        restrict:'AE',
        template:require('./detailscopecontainer.html'),
        link:function(scope){

            $('body').css('overflow','hidden');
            scope.loadingAnimation = true;
            scope.scopeId = $stateParams.scopeId;
            scope.geocoder = new google.maps.Geocoder();

            scope.$on('$stateChangeStart',function(){
                $('body').css('overflow','auto');
            })


            scope.cancelFeature = function(){


                scope.currentScope.showEditing = false;
                scope.currentScope.showFeature = false;

            }
            function _getScope(scopeId){

                MediaFactory.getScopeInfo(scopeId).then(function(res){

                    scope.currentScope = res.data
                    scope.loadingAnimation = false;
                    scope.currentScope.showEditing = false;
                    scope.currentScope.showFeature = false;
                    toaster.pop("info","Retrive ID" + scope.scopeId);
                })

            }

            scope.showFeature = function(){

                scope.newFeature = {};
                MediaFactory.getFeatures().then(function(res){

                    scope.featureArr = res.data;
                    // scope.newFeature.featureType = scope.featureArr[0].label;
                    scope.newFeature.featureType = 0;
                    toaster.pop('info','Retrive ' + res.data.length + ' features');
                    scope.currentScope.showEditing = false;
                    scope.currentScope.showFeature = true;

                })

            }

            scope.featureScope = function(){

                MediaFactory.featureScope(scope.featureArr[scope.newFeature.featureType].id,scope.currentScope).then(function(res){

                    if(res.data.result == "OK"){

                        toaster.pop('success','Scope ' + scope.currentScope.id +  ' has been featured');
                        scope.currentScope.showEditing = false;
                        scope.currentScope.showFeature = false;
                    }
                })


            }


            scope.showEdit = function(){

                scope.currentScope.currentScopeCp = JSON.parse(JSON.stringify(scope.currentScope));
                scope.currentScope.showEditing = true;


                if(scope.currentScope.location == null){

                    scope.currentScope.currentScopeCp.locationOption = 'hideLocation';

                }else{

                    scope.currentScope.currentScopeCp.locationOption = 'showLocation';

                }

                if(scope.currentScope.startTime == null){

                    scope.currentScope.currentScopeCp.showTimeOption = 'hideTimeRange';
                }else{

                    scope.currentScope.currentScopeCp.showTimeOption = 'showTimeRange';
                    scope.currentScope.currentScopeCp.startTime = new Date(scope.currentScope.currentScopeCp.startTime)
                    scope.currentScope.currentScopeCp.endTime = new Date(scope.currentScope.currentScopeCp.endTime)
                }
            }

            scope.cancelEdit = function(){

                scope.currentScope.showEditing = false;
            }


            scope.getLocation = function(currentScope){


                if(currentScope.location != null && currentScope.location.address.trim().length >= 0){

                    scope.geocoder.geocode({

                        'address':currentScope.location.address.trim()
                    },function(res,err){


                        scope.$apply(function(){

                            if(res.length == 0){

                                toaster.pop('error','Invalid address, please try again.');
                                currentScope.location.latitude = currentScope.location.longitude = null;

                            }else{

                                currentScope.location.latitude = res[0].geometry.location.lat();
                                currentScope.location.longitude = res[0].geometry.location.lng();

                            }


                        })



                    })

                }else{

                    toaster.pop('error','Invalid address, please try again.');
                }


            }

            scope.updateScope = function(currentScope){


                if(currentScope.currentScopeCp.locationOption ==  "showlocation" && currentScope.currentScopeCp.location == null ){

                    toaster.pop('error','Please enter a proper location');
                }
                else if(currentScope.currentScopeCp.locationOption ==  "showlocation" && (currentScope.currentScopeCp.location.latitude == null)){


                    toaster.pop('error','Please use Get Location buton to get the geocode');
                }

                else if(currentScope.currentScopeCp.locationOption ==  "showlocation" && (currentScope.currentScopeCp.radius == null)){

                    toaster.pop('error','Please enter a proper radius');
                }


                else{

                    if(currentScope.location != null && currentScope.currentScopeCp.locationOption == 'hideLocation'){

                        currentScope.currentScopeCp.location = null;
                        currentScope.currentScopeCp.sourceType = "MEMBER";

                    }

                    if(currentScope.startTime != null && currentScope.currentScopeCp.showTimeOption == 'hideTimeRange' ){

                        currentScope.currentScopeCp.startTime = currentScope.currentScopeCp.endTime = null;
                    }



                    if(currentScope.currentScopeCp.showTimeOption == 'showTimeRange' && currentScope.currentScopeCp.startTime > currentScope.currentScopeCp.endTime ){

                        toaster.pop('error','Please enter a proper time range');


                    }else{

                        MediaFactory.updateScope(currentScope.id,currentScope.currentScopeCp).then(function(res){

                            if (res.data.result == 'OK'){

                                toaster.pop('info','Scope ' + currentScope.id + ' has been updated');
                                _getScope(currentScope.id);
                                scope.updated = true;
                            }

                        })
                    }
                }

            }

            scope.back = function(){
                if(scope.updated)
                    $state.transitionTo('scopeManagement',{searchType:$stateParams.searchType,searchContent:$stateParams.searchContent},{reload:true})
                else
                    $window.history.back();
            }

            _getScope(scope.scopeId);
            // // broadcastService.subscribe('event::show_detail_photo',)

        }

    }

}])