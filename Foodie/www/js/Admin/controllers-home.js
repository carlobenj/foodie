angular.module('foodie.controllers.admin.home', ['foodie.services', 'foodie.plugins'])

.controller('AdminHomeCtrl', function($scope, $location, $foodieUtils, $ionicLoading, $timeout, Token, FooducerProfile) {
	
	$scope.logout = function(){
      $scope.$broadcast('logoutAccount');
      window.localStorage.clear();      
      $location.path('/login').replace();
      Token.destroyToken();
    }
});


