angular.module('app.header',[]).directive('scopeheader',['$state','toaster',function($state,toaster){

    require ('./header.css');
    return {

        restrict:'AE',
        template:require('./header.html'),
        replace:true,
        link:function(scope,element,attr){

            scope.showList = function(){

                $('#header_option_list').slideDown();
            }

            scope.toFeatureManagement  = function(){

                $state.transitionTo('featureManagement',{},{reload:true}).then(function(err){


                },function(err){  toaster.pop('error',err); })
            }

            scope.toPhotoManagement = function(){

                $state.transitionTo('photoManagement',{searchType:'general'},{reload:true}).then(function(err){


                },function(err){  toaster.pop('error',err); })
            }

            scope.toScopeManagement = function(){


                $state.transitionTo('scopeManagement',{searchType:'general'},{reload:true}).then(function(err){


                },function(err){  toaster.pop('error',err); })
            }

            scope.toUserManagement = function(){

                $state.transitionTo('userManagement',{searchType:'general'},{reload:true}).then(function(err){


                },function(err){  toaster.pop('error',err); })


            }

            scope.toSystemInfo = function(){


                $state.transitionTo('systemInfo',{},{relaod:true}).then(function(){},function(err){

                    toaster.pop('error',err);
                });
            }

            scope.hideList = function(){

                $('#header_option_list').slideUp();
            }
            // 		  $scope.setPosition = function(event){

            //       console.log('move')
            //       if($(document).scrollTop()  >= $('#result_page_right').position().top - 50){

            //         $('#searchHanger_main').css('transform','translateY('  + $(document).scrollTop() + 50 + 'px)');

            //       }

            // }

        }
    }

}])