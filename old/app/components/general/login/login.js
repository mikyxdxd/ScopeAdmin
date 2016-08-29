angular.module('app.login',[]).directive('login',['UserRegisterFactory','UserProfileFactory','$http','toaster','$state',function(UserRegisterFactory,UserProfileFactory,$http,toaster,$state){

    require ('./login.css');
    return {

        restrict:'AE',
        template:require('./login.html'),
        link:function(scope,element,attr){

            scope.needRedirect = false;

            scope.loginScope = function(userEmail,userPassword){


                UserRegisterFactory.loginScopeCN(userEmail,userPassword).then(function(res){

                    if(res.data){

                        localStorage._scopeAccessToken = res.data.token_type + ' ' + res.data.access_token;
                        $http.defaults.headers.common.Authorization = localStorage._scopeAccessToken;
                        scope.getUserType();
                        scope.needRedirect = true;
                    }
                },function(err){

                    toaster.pop('error','Invalid Password/Email');
                })
            }

            scope.getUserType = function(){

                UserProfileFactory.profile().then(function(res){


                    if(res.data.role == "ADMIN"){
                        toaster.pop('Success', "Login As Admin");
                        scope.adminLogin = true;
                        if(scope.needRedirect){
                            $state.transitionTo('photoManagement',{searchType:'general'},{reload:true}).then(function(){},function(err){

                                console.log(err);
                            });
                        }
                    }else{

                        toaster.pop('error',"Must Be an Admin")
                        localStorage._scopeAccessToken = '';
                        scope.adminLogin = false;

                    }

                },function(err){if(err) localStorage._scopeAccessToken = ''; scope.adminLogin = false})
            }


            scope.adminLogin = true;

            if(localStorage._scopeAccessToken != null && localStorage._scopeAccessToken.length != 0){

                $http.defaults.headers.common.Authorization = localStorage._scopeAccessToken;
                scope.getUserType();

            }else{

                scope.adminLogin = false;
            }
        }
    }}

])