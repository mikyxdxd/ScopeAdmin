angular.module('app.featureManagement',[]).directive('featuremanagement',['$http', 'UserProfileFactory','toaster','$state','$location','$window','MediaFactory','broadcastService',
    function($http,UserProfileFactory,toaster,$state,$location,$window,MediaFactory,broadcastService){

        return {

            restrict:'AE',
            template:require('./featuremanagement.html'),
            link:function(scope,element,attr){

                scope.featureCtr = {

                    currentPage:0,
                    pageSize:50,
                    timeStamp:Date.now(),
                    featureArr:null
                }

                scope.updating = false;

                scope.deleteItem = function(item,feature,index){

                    MediaFactory.deleteItem(item,feature).then(function(res){

                        if(res.data.result == 'OK'){

                            toaster.pop('success','Item ' + item.id + ' has been deleted');
                            feature.itemList.splice(index,1);
                        }
                    })


                }

                scope.getItemList = function(feature){

                    if(feature.open == true) feature.open = false;

                    else{
                        MediaFactory.getItemList(feature).then(function(res){

                                feature.itemList = res.data.itemList;
                                feature.open = true;
                            }
                        )}
                }


                scope.ableScope = function(feature){

                    feature.featureCp = JSON.parse(JSON.stringify(feature));
                    feature.featureCp.enabled = !feature.featureCp.enabled;
                    MediaFactory.updateFeature(feature.featureCp).then(function(res){

                        if(res.data.result = "OK"){

                            if(feature.enabled == true){
                                toaster.pop('success','Feature ' + feature.id + ' is enabled')}
                            else{
                                toaster.pop('success','Feature ' + feature.id + ' is disabled')
                            }

                            feature.enabled = !feature.enabled
                        }

                    })

                }
                // scope.deletePhoto = function(imageId,index){

                // 	broadcastService.publish('photoManagement::delete_photo',{imageId:imageId,index:index});
                // }

                // scope.showDetailPhoto = function(imageId){

                // 	$state.go('photoManagement.detailPhotoView',{imageId:imageId});

                // }


                broadcastService.subscribe("featureManagement::confirm_delete_feature",function(p,param){

                    MediaFactory.delFeature(param.featureId).then(function(res){

                        if(res.data.result == 'OK'){

                            toaster.pop('success', "Feature " + param.featureId + " has been deleted.");
                            scope.featureCtr.featureArr.splice(param.index,1);
                        }
                    })


                })


                scope.itemEdit = function(item){


                    item.itemCp = JSON.parse(JSON.stringify(item));
                    item.showEditing = true;

                }

                scope.deleteFeature = function(feature,index){

                    broadcastService.publish('featureManagement::delete_feature',{featureId:feature.id,index:index});

                }

                scope.addNewScope = function(){


                    MediaFactory.addNewFeature().then(function(res){

                        if(res.data.result == 'OK'){

                            _getFeatureList();
                            toaster.pop('info','Added one new feature ' + res.data.id);
                        }
                    })
                }


                scope.updateItem = function(item,feature){


                    if(item.sequence != item.itemCp.sequence || item.label != item.itemCp.label || item.imagePath != item.itemCp.imagePath){


                        MediaFactory.updateItem(item.itemCp,feature).then(function(res){

                            if(res.data.result == 'OK'){


                                toaster.pop("success","Item " + item.id + " has been updated");
                                item.sequence = item.itemCp.sequence;
                                item.label = item.itemCp.label;
                                item.imagePath = item.itemCp.imagePath;
                                item.showEditing = false;
                            }


                        },function(err){console.log(err)})

                    }


                }

                scope.updateFeature = function(feature){

                    if(feature.featureCp.sequence != feature.sequence || feature.featureCp.label != feature.label){

                        MediaFactory.updateFeature(feature.featureCp).then(function(res){

                            if(res.data.result = "OK"){

                                feature.label = feature.featureCp.label;
                                feature.sequence = feature.featureCp.sequence;
                                toaster.pop('success','Feature ' + feature.id + ' has been updated');
                                feature.showEditing = false;
                            }
                        })

                    }

                }

                scope.featureEdit = function(feature){


                    feature.featureCp = JSON.parse(JSON.stringify(feature));
                    feature.showEditing = true;
                }

                function _getFeatureList (){

                    MediaFactory.getFeatures().then(function(res){

                        scope.featureCtr.featureArr = res.data;
                        toaster.pop('info','Retrive ' + res.data.length + ' features')

                    })

                }

                _getFeatureList();







            }
        }

    }]).config(['$stateProvider',function($stateProvider){



    // $stateProvider.state('.detailPhotoView',{
    //     	template:"<div detailphotocontainer></div>",
    //     	url:'/detailPhotoView/imageId=:imageId'
    //     // resolve:{

    //     //     store: function($ocLazyLoad){

    //     //         return $ocLazyLoad.load(

    //     //             {name:"photoManagement",files:["components/PhotoManagement/photoManagement.js"]})
    //     //     }
    //     // }
    // })

}])