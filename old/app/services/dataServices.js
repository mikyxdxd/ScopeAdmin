angular.module('services.data', [])
    .constant('ServiceSettings', {
        serverUrl: 'https://api.scopephotos.com/v1',
        httpServerUrl: 'https://api.scopephotos.com/v1'
    })
    .service('authService', function() {

        this._locationAccessToken = '';
        this._authorizationToken = 'Basic c2V5bW91ci13ZWI6YVJiYXoyOWR2aUIlITpxLTBwMTV0';
        this._guessAuthorizationToken = 'Basic c2V5bW91ci13ZWI6YVJiYXoyOWR2aUIlITpxLTBwMTV0';

    })
    .service('SharedValueService', function() {
        var _value = {};
        var _values = {};
        return {

            getValue: function() {

                return _value;
            },

            setValue: function(value) {

                _value = value;
            },

            getValue: function(values) {

                return _values;
            },

            setValues: function(values) {

                _values = values;
            }
        };
    }).factory('UserRegisterFactory', function($http, ServiceSettings, authService) {


        return {

            registerScope: function(name, email, password) {
                return $http({
                    method: 'POST',
                    url: ServiceSettings.httpServerUrl + '/signuplogin2',
                    data: {
                        'name': name,
                        'email': email,
                        'password': password
                    }
                })

            },

            loginScopeCN: function(userEmail, userPassword) {

                return $http({
                    method: 'POST',
                    url: ServiceSettings.httpServerUrl + '/login',
                    transformResponse: [function(data) {
                        if (data == 'Bad credentials') {
                            return data;
                        } else {

                            return JSON.parse(data);
                        }
                    }],
                    data: $.param(

                        {
                            'grant_type': 'password',
                            'username': userEmail,
                            'password': userPassword
                        }
                    ),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': authService._authorizationToken
                    }
                })

            }

        }
    })

    .factory('UserProfileFactory', function($http, ServiceSettings) {

        return {

            userScope: function(pageNo, pageSize) {

                return $http({
                    method: 'GET',
                    url: ServiceSettings.serverUrl + 'scope?page=' + pageNo + '&size=' + pageSize
                })
            },

            getOneUser: function(userId) {

                return $http.get(ServiceSettings.serverUrl + '/admin/users/' + userId);


            },

            adminGetUser: function(pageNo, pageSize, nickName) {

                return $http.get(ServiceSettings.serverUrl + '/admin/users?page=' + pageNo + '&size=' + pageSize + '&nickname=' + nickName)

            },

            adminMediaList: function(pageNo, pageSize) {


                return $http.get(ServiceSettings.httpServerUrl + '/admin/media/list?sourcetype&page=' + pageNo + '&size=' + pageSize);

            },

            mediaList: function(pageNo, pageSize) {
                return $http.get(ServiceSettings.httpServerUrl + '/users/me/media?page=' + pageNo + '&size=' + pageSize);
            },
            profile: function() {
                return $http.get(ServiceSettings.httpServerUrl + '/users/me');
            },
            updateName: function(name) {
                return $http({
                    method: 'PUT',
                    url: ServiceSettings.httpServerUrl + '/users/me/name',
                    data: {
                        'name': name
                    }
                });
            },
            updateBio: function(bio) {
                return $http({
                    method: 'PUT',
                    url: ServiceSettings.httpServerUrl + '/users/me/bio',
                    data: {
                        'bio': bio
                    }
                });
            },
            changePassword: function(email, oldPassword, newPassword) {
                return $http({
                    method: 'PUT',
                    url: ServiceSettings.httpServerUrl + '/users/me/password',
                    data: {
                        'email': email,
                        'oldPassword': oldPassword,
                        'password': newPassword
                    }
                });
            },

            forgotPassword: function(email, varification_token) {

                return $http({
                    method: "POST",
                    url: ServiceSettings.httpServerUrl + '/passwordreset',
                    data: {
                        'email': email
                        // 'verificationToken':varification_token
                    }
                })

            },

            notificationCount: function() {

                return $http.get(ServiceSettings.httpServerUrl + '/users/me/status?ver=2');

            },
            notificationDetail: function() {

                return $http.get(ServiceSettings.serverUrl + '/users/me/notifications?ver=2.0&page=0&size=1000')
            }

        }
    })
    .factory('MediaFactory', function($http, ServiceSettings) {

        return {


            updateFeature: function(featureCp) {

                return $http({

                    method: 'PUT',
                    url: ServiceSettings.serverUrl + '/admin/features/' + featureCp.id,
                    data: {
                        enabled: featureCp.enabled,
                        featureType: featureCp.featureType,
                        id: featureCp.id,
                        label: featureCp.label,
                        sequence: featureCp.sequence
                    }

                })


            },


            featureScope: function(featureId, scope) {

                return $http({

                    method: 'POST',
                    url: ServiceSettings.serverUrl + '/admin/features/' + featureId + '/items',
                    data: {

                        featureType: "SCOPE",
                        key: scope.id,
                        sequence: scope.sequence

                    }
                })


            },

            addNewFeature: function() {

                return $http({

                    method: 'POST',
                    url: ServiceSettings.serverUrl + '/admin/features',
                    data: {

                        enabled: false,
                        featureType: "SCOPE",
                        label: "New Feature " + new Date(),
                        sequence: "1"
                    }

                })

            },

            delFeature: function(featureId) {

                return $http({

                    method: 'DELETE',
                    url: ServiceSettings.serverUrl + '/admin/features/' + featureId
                })

            },

            deleteItem: function(item, feature) {

                return $http({

                    method: 'DELETE',
                    url: ServiceSettings.serverUrl + '/admin/features/' + feature.id + '/items/' + item.id
                })


            },

            updateItem: function(itemCp, feature) {

                return $http({
                    method: 'PUT',
                    url: ServiceSettings.serverUrl + '/admin/features/' + feature.id + '/items/' + itemCp.id,
                    data: {

                        id: itemCp.id,
                        imagePath: itemCp.imagePath,
                        label: itemCp.label,
                        sequence: itemCp.sequence

                    }


                })
            },

            getItemList: function(feature) {

                return $http.get(ServiceSettings.serverUrl + '/admin/features/' + feature.id);
            },

            getFeatures: function() {

                return $http.get(ServiceSettings.serverUrl + '/admin/features');
            },

            getUsers: function(pageNo, pageSize, timeStamp, userTag) {

                return $http.get(ServiceSettings.serverUrl + '/users?&size=' + pageSize + '&nickname=' + userTag + '&timestamp=' + timeStamp + '&page=' + pageNo);
            },

            updateUser: function(user) {

                console.log('user', user);

                return $http.put(ServiceSettings.serverUrl + '/admin/users/' + user.id, user);


            },

            getImageGUEST: function(pageNo, pageSize, timeStamp, imageTag) {

                return $http.get(ServiceSettings.serverUrl + '/search/images?&size=' + pageSize + '&tag=' + encodeURI(encodeURI(imageTag)) + '&timestamp=' + timeStamp + '&page=' + pageNo);
            },

            getImageGeneral: function(pageNo, pageSize, timeStamp, imageTag) {

                if (userService._userInfoScope.current_user.type == 'GUEST') {

                    return $http.get(ServiceSettings.serverUrl + '/search/images?&size=' + pageSize + '&tag=' + encodeURI(encodeURI(imageTag)) + '&timestamp=' + timeStamp + '&page=' + pageNo);

                } else {

                    return $http.get(ServiceSettings.serverUrl + '/image?&size=' + pageSize + '&tag=' + encodeURI(encodeURI(imageTag)) + '&timestamp=' + timeStamp + '&page=' + pageNo);
                }
            },

            getImage: function(pageNo, pageSize, timeStamp, imageTag) {
                return $http.get(ServiceSettings.serverUrl + '/image?&size=' + pageSize + '&tag=' + encodeURI(encodeURI(imageTag)) + '&timestamp=' + timeStamp + '&page=' + pageNo);
            },

            getMapImageGUEST: function(pageNo, pageSize, timeStamp, radius, longitude, latitude) {

                return $http.get(ServiceSettings.serverUrl + '/search/images?&size=' + pageSize + '&loc_lat=' + latitude + '&loc_lon=' + longitude + '&radius=' + radius + '&timestamp=' + timeStamp + '&page=' + pageNo, {
                    timeout: 5000
                });
            },

            getMapImage: function(pageNo, pageSize, timeStamp, radius, longitude, latitude) {

                return $http.get(ServiceSettings.serverUrl + '/image?&size=' + pageSize + '&loc_lat=' + latitude + '&loc_lon=' + longitude + '&radius=' + radius + '&timestamp=' + timeStamp + '&page=' + pageNo, {
                    timeout: 5000
                });
            },

            getMapScopeGUEST: function(pageNo, pageSize, timeStamp, radius, longitude, latitude) {

                return $http.get(ServiceSettings.serverUrl + '/search/scopes?&size=' + pageSize + '&loc_lat=' + latitude + '&loc_lon=' + longitude + '&radius=' + radius + '&timestamp=' + timeStamp + '&page=' + pageNo);
            },

            getMapScope: function(pageNo, pageSize, timeStamp, radius, longitude, latitude) {

                return $http.get(ServiceSettings.serverUrl + '/scope?&size=' + pageSize + '&loc_lat=' + latitude + '&loc_lon=' + longitude + '&radius=' + radius + '&timestamp=' + timeStamp + '&page=' + pageNo);
            },

            getScopeMedias: function(pageNo, pageSize, shareType) {
                return $http.get(ServiceSettings.httpServerUrl + '/media?page=' + pageNo + '&size=' + pageSize + '&type=' + shareType);
            },

            getScopesGUEST: function(pageNo, pageSize, timeStamp, scopeTag) {
                return $http.get(ServiceSettings.serverUrl + '/search/scopes?&size=' + pageSize + '&name=' + encodeURI(encodeURI(scopeTag)) + '&timestamp=' + timeStamp + '&page=' + pageNo)
            },
            getScopes: function(pageNo, pageSize, timeStamp, scopeTag) {
                return $http.get(ServiceSettings.serverUrl + '/scope?&size=' + pageSize + '&name=' + encodeURI(encodeURI(scopeTag)) + '&timestamp=' + timeStamp + '&page=' + pageNo)
            },

            getScopeInfo: function(scopeId) {
                return $http.get(ServiceSettings.httpServerUrl + '/scope/' + scopeId);
            },

            getScopeInfoGUEST: function(scopeId) {

                return $http.get(ServiceSettings.httpServerUrl + '/search/scopes/' + scopeId);
            },
            getUserScope: function(pageNo, pageSize, timeStamp, userId) {
                return $http.get(ServiceSettings.serverUrl + '/scope?type=PUB&size=' + pageSize + '&userid=' + encodeURI(encodeURI(userId)) + '&timestamp=' + timeStamp + '&page=' + pageNo);
            },

            getScopeGUEST: function(scopeId, pageNo, pageSize, timeStamp) {

                return $http.get(ServiceSettings.httpServerUrl + '/search/scopes/' + scopeId + '/images?page=' + pageNo + '&size=' + pageSize + '&timestamp=' + timeStamp);
            },
            getScope: function(scopeId, pageNo, pageSize, timeStamp) {

                return $http.get(ServiceSettings.httpServerUrl + '/scope/' + scopeId + '/images?page=' + pageNo + '&size=' + pageSize + '&timestamp=' + timeStamp);
            },
            getMedia: function(mediaId) {
                return $http.get(ServiceSettings.httpServerUrl + '/media/' + mediaId);
            },
            get: function(mediaId) {
                return $http.get(ServiceSettings.httpServerUrl + '/media/' + mediaId);
            },
            reportedmediacount: function() {
                return $http.get(ServiceSettings.httpServerUrl + '/admin/reportedmedia/count').then(function(res) {
                    return res.data.total;
                });
            },
            getReportedMedia: function(pageNo, pageSize) {
                return $http.get(ServiceSettings.httpServerUrl + '/media/reported?page=' + pageNo + '&size=' + pageSize);
            },

            countScope:function(){

                return $http.get(ServiceSettings.httpServerUrl + '/admin/scopes/count');

            },

            countUser:function(){

                return $http.get(ServiceSettings.httpServerUrl + '/admin/users/count');
            },

            count: function(userId) {
                if (userId) {
                    return $http.get(ServiceSettings.httpServerUrl + '/admin/media/count?userid=' + escape(userId)).then(function(res) {
                        return res.data.total;
                    });
                } else {

                    return $http.get(ServiceSettings.httpServerUrl + '/admin/media/count');
                }
            },
            getUserMedia: function(userId, pageNo, pageSize) {
                return $http.get(ServiceSettings.httpServerUrl + '/admin/media?userid=' + userId + '&page=' + pageNo + '&size=' + pageSize);
            },
            del: function(mediaId) {
                return $http({
                    method: 'DELETE',
                    url: ServiceSettings.httpServerUrl + '/image/' + mediaId
                });
            },
            updateImage: function(mediaId, imageCp) {
                return $http({
                    method: 'PUT',
                    url: ServiceSettings.httpServerUrl + '/image/' + mediaId,
                    data: imageCp
                });
            },

            updateScope: function(scopeId, scopeCp) {
                return $http({
                    method: 'PUT',
                    url: ServiceSettings.httpServerUrl + '/scope/' + scopeId,
                    data: scopeCp
                });
            },

            search: function(type, tag, pageNo, pageSize) {
                if (tag) {
                    return $http.get(ServiceSettings.httpServerUrl + '/image?type=' + escape(type) + '&tag=' + escape(tag) + '&page=' + pageNo + '&size=' + pageSize);
                } else {
                    return $http.get(ServiceSettings.httpServerUrl + '/image?type=' + escape(type) + '&page=' + pageNo + '&size=' + pageSize);
                }
            },
            public_scope_media: function(scopeId, vt, pageNo, pageSize) {
                if (vt) {
                    return $http.get(ServiceSettings.httpServerUrl + '/pubevents/s/' + scopeId + '?page=' + pageNo + '&size=' + pageSize + '&vt=' + vt);
                } else {
                    return $http.get(ServiceSettings.httpServerUrl + '/pubevents/s/' + scopeId + '?page=' + pageNo + '&size=' + pageSize);
                }
            },
            addComment: function(mediaId, comment) {
                return $http({
                    method: 'POST',
                    url: ServiceSettings.httpServerUrl + '/media/' + mediaId + '/comments',
                    data: {
                        'mediaId': mediaId,
                        'text': comment
                    }
                });
            },
            likeMedia: function(mediaId) {
                return $http({
                    method: 'POST',
                    url: ServiceSettings.httpServerUrl + '/media/' + mediaId + '/likes',
                    data: {
                        'mediaId': mediaId
                    }
                });
            },
            getPublicMedia: function(mediaId, vt) {
                if (vt) {
                    return $http.get(ServiceSettings.httpServerUrl + '/pubevents/m/' + mediaId + '?vt=' + vt);
                } else {
                    return $http.get(ServiceSettings.httpServerUrl + '/pubevents/m/' + mediaId);
                }
            }
        };
    })