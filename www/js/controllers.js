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
        $cordovaFacebook.login(["public_profile", "email", "user_friends"])
            .then(function (success) {
                $cordovaFacebook.api("me?fields=id,name,email", ["public_profile"])
                    .then(function(success) {

                        $scope.test = success;

                        $localstorage.setObject('user', success);
                        $rootScope.user = success;

                        $scope.form.f_b_user_id = success.id;

                        $cordovaFacebook.api(success.id+'/picture?type=large').then(function(success2){
                            console.log(success2);
                            console.log(success2.data);

                            success.image = success2.data.url;

                            $http.post(config.apiURL+'/userLogin', success, config)
                                .then(function(success){
                                    $localstorage.setObject('user', success.data);
                                    $rootScope.user = success.data;
                                });
                        });

                        console.log(success);
                    }, function (error) {
                        $scope.test = error;

                        console.log(error);
                    });

            }, function (error) {
                $scope.test = error;
            });

    });

})

.controller('ChatsCtrl', function($scope, config, $http, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };

    $http.get(config.apiURL+'/offers').then(function(data){
        console.log(data.data);
        $scope.offers = data.data;
    });
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($rootScope, $scope, $localstorage) {

    $rootScope.user = $localstorage.getObject('user');


  $scope.settings = {
    enableFriends: true
  };
});
