angular.module('app.searchTab', []).directive('searchtab', ['UserRegisterFactory', 'UserProfileFactory', '$http', 'toaster', '$state', function(UserRegisterFactory, UserProfileFactory, $http, toaster, $state) {

    require ('./searchtab.css');
    return {

        restrict: 'AE',
        template: require('./searchtab.html'),
        scope: {},
        link: function(scope, element, attr) {


            $('.ui.dropdown')
                .dropdown()
            ;
            scope.optionList = attr.optionlist.split(',');
            scope.searchType = scope.optionList[0];
            scope.sender = attr.sender;
            scope.changeSearchType = function(type) {

                scope.searchType = type;

            }

            scope.geoCoder = new google.maps.Geocoder();



            function _getGeoCode(address, sender) {

                new BMap.Geocoder().getPoint(
                    address,
                    function(results, status) {

                        console.log(results, status);

                        if (results == null) {

                            toaster.pop('error', '找不到此地址，请重新输入');

                        } else {
                            var lat = results.lat;
                            var lng = results.lng;

                            switch (scope.sender) {

                                case 'scopemanagement':


                                    $state.transitionTo('scopeManagement', {
                                        searchType: 'location',
                                        searchContent: lat + ',' + lng
                                    }, {
                                        reload: true
                                    }).then(function() {}, function(err) {

                                        console.log(err);
                                    });

                                    break;


                                case 'photomanagement':


                                    $state.transitionTo('photoManagement', {
                                        searchType: 'location',
                                        searchContent: lat + ',' + lng
                                    }, {
                                        reload: true
                                    }).then(function() {}, function(err) {

                                        console.log(err);
                                    });

                                    break;

                            }

                        }

                    });
            }


            scope.doSearch = function(searchContent) {

                searchContent = searchContent.trim();
                switch (scope.sender) {

                    case 'photomanagement':

                        switch (scope.searchType) {

                            case 'tag':

                                $state.transitionTo('photoManagement', {
                                    searchType: 'tag',
                                    searchContent: searchContent
                                }, {
                                    reload: true
                                }).then(function() {}, function(err) {

                                    console.log(err);
                                });

                                break;

                            case 'scopeId':

                                $state.transitionTo('photoManagement', {
                                    searchType: 'scopeId',
                                    searchContent: searchContent
                                }, {
                                    reload: true
                                }).then(function() {}, function(err) {

                                    console.log(err);
                                });

                                break;

                            case 'photoId':

                                $state.transitionTo('photoManagement', {
                                    searchType: 'photoId',
                                    searchContent: searchContent
                                }, {
                                    reload: true
                                }).then(function() {}, function(err) {

                                    console.log(err);
                                });

                                break;

                            case 'location':

                                _getGeoCode(searchContent);

                                break;
                        }


                        break;


                    case 'usermanagement':

                        switch (scope.searchType) {

                            case 'name':

                                $state.transitionTo('userManagement', {
                                    searchType: 'nikeName',
                                    searchContent: searchContent
                                }, {
                                    reload: true
                                }).then(function() {}, function(err) {

                                    console.log(err);
                                });

                                break;


                            case 'id':

                                $state.transitionTo('userManagement', {
                                    searchType: 'id',
                                    searchContent: searchContent
                                }, {
                                    reload: true
                                }).then(function() {}, function(err) {

                                    console.log(err);
                                });

                                break;
                        }

                        break;


                    case 'scopemanagement':

                        switch (scope.searchType) {

                            case 'tag':

                                $state.transitionTo('scopeManagement', {
                                    searchType: 'tag',
                                    searchContent: searchContent
                                }, {
                                    reload: true
                                }).then(function() {}, function(err) {

                                    console.log(err);
                                });

                                break;


                            case 'id':

                                $state.transitionTo('scopeManagement', {
                                    searchType: 'id',
                                    searchContent: searchContent
                                }, {
                                    reload: true
                                }).then(function() {}, function(err) {

                                    console.log(err);
                                });

                                break;

                            case 'location':

                                _getGeoCode(searchContent);

                                break;

                            case 'userId':

                                $state.transitionTo('scopeManagement', {
                                    searchType: 'userId',
                                    searchContent: searchContent
                                }, {
                                    reload: true
                                }).then(function() {}, function(err) {

                                    console.log(err);
                                })

                                break;

                        }
                        break;
                }
            }
        }
    }
}

])