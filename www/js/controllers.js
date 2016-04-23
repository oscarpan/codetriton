angular.module('starter.controllers', [])

    .controller('DashCtrl', function($scope, $rootScope, $ionicPlatform, $cordovaFacebook, $localstorage, config, $http) {

        $scope.localstorage = $localstorage;

        $rootScope.user = $localstorage.getObject('user');

        $scope.form = {
            f_b_user_id: $rootScope.user.id,
        };

        $scope.host = function(form){
            $http.post(config.apiURL+'/createOffer', form, config)
                .then(function(success){
                    console.log(success);
                    $scope.form = {
                        f_b_user_id: $rootScope.user.id,

                    };
                });
        };

        $ionicPlatform.ready(function() {
            $cordovaFacebook.getLoginStatus()
                .then(function(success){
                    console.log(success);
                    if(success.status != "connected"){


                        $cordovaFacebook.login(["public_profile", "email", "user_friends"])
                            .then(function (success) {
                                $scope.test3 = success;

                                $cordovaFacebook.api("me?fields=id,name,email", ["public_profile"])
                                    .then(function(success) {

                                        $scope.test = success;

                                        $localstorage.setObject('user', success);
                                        $rootScope.user = success;

                                        $scope.form.f_b_user_id = success.id;

                                        $http.post(config.apiURL+'/userLogin', success, config)
                                            .then(function(success){
                                                $localstorage.setObject('user', success.data);
                                                $rootScope.user = success.data;
                                            });

                                        console.log(success);
                                    }, function (error) {
                                        $scope.test = error;

                                        console.log(error);
                                    });

                            }, function (error) {
                                $scope.test = error;
                            });


                    }
                    else{
                        $cordovaFacebook.api("me?fields=id,name,email", ["public_profile"])
                            .then(function(success) {
                                $scope.form.f_b_user_id = success.id;
                                $http.post(config.apiURL + '/userLogin', success, config)
                                    .then(function (success) {
                                        $localstorage.setObject('user', success.data);
                                        $rootScope.user = success.data;
                                        console.log(success.data);
                                    });
                            });
                    }
                }, function(error){
                    alert(error);
                });

        });

    })

    .controller('OffersCtrl', function($scope, config, $http, $localstorage) {
        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //
        $scope.$on('$ionicView.enter', function(e) {
            refreshData();
        });

        $scope.offers = $localstorage.getArray('offers');

        function refreshData(){
            $http.get(config.apiURL+'/offers')
                .then(function(data){
                    console.log(data.data);
                    $scope.offers = data.data;
                    $localstorage.setObject('offers', data.data);
                })
                .finally(function(){
                    $scope.$broadcast('scroll.refreshComplete');
                });
        }
        $scope.doRefresh = refreshData;
    })

    .controller('OfferDetailCtrl', function($scope, $rootScope, config, $http, $stateParams, $localstorage, $filter, $ionicPlatform, $cordovaFacebook) {
        var offerid = $stateParams.offerId;

        var offers = $localstorage.getArray('offers');

        $scope.offer = $filter('filter')(offers, {id: offerid})[0];

        $scope.user = $localstorage.getObject('user');

        //console.log($scope.offer);

        $scope.interested = function(){

            var data = {
                offer_id: offerid,
                host_id: $scope.offer.user.id,
                guest_id: $scope.user.id,
                approval: 0
            };
            $http.post(config.apiURL+'/createMatch', data, config)
                .then(function(success){
                    console.log(success);
                });
        };

        $scope.ratingsObject = {
            iconOn: 'ion-ios-star',    //Optional
            iconOff: 'ion-ios-star-outline',   //Optional
            iconOnColor: 'rgb(200, 200, 100)',  //Optional
            iconOffColor:  'rgb(200, 100, 100)',    //Optional
            rating:  $scope.offer.user.host_rating, //Optional
            readOnly: true, //Optional
            callback: function(rating) {    //Mandatory
                $scope.ratingsCallback(rating);
            }
        };

        $scope.ratingsCallback = function(rating) {
            console.log('Selected rating is : ', rating);
        };

    })

    .controller('AccountCtrl', function($rootScope, $scope, $localstorage, $ionicPlatform, $cordovaFacebook) {

        $rootScope.user = $localstorage.getObject('user');

        //$ionicPlatform.ready(function() {
        //    $cordovaFacebook.logout();
        //});

        $scope.settings = {
            enableFriends: true
        };
    });
