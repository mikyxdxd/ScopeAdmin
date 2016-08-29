angular.module('services.broadcast',[]).service('broadcastService',['$rootScope',function($rootScope){


    this.subscribe = function(event,callback){

        $rootScope.$on(event,callback);
    };

    this.publish = function(event,para){

        $rootScope.$emit(event,para)
    };

    this.unsubscribe = function(event){

        $rootScope.$$listeners[event]=[];
    }


    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {

        console.log('toState',toState,'fromState',fromState)

        if( toState.name.indexOf('detail') < 0 && fromState.name.indexOf('detail') < 0)
            document.body.scrollTop = document.documentElement.scrollTop = 0;
    });


}])
