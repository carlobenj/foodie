angular.module('foodie.controllers.offers', ['foodie.services', 'foodie.plugins'])

.controller('OffersCtrl', function($scope, $location, $foodieUtils, $ionicLoading, $timeout, Token, Offer, $ionicScrollDelegate) {
  $scope.isLocation = true;
  $scope.kilometerRadius = 50;
  $scope.getAllOffers = function(){
    //geolocate
    navigator.geolocation.getCurrentPosition(
      function(position){
        var origLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude)

        
        if($scope.isLocation)
        {          
          var topCoordinate = google.maps.geometry.spherical.computeOffset(origLatLng, $scope.kilometerRadius * 100, 0).k;
          var bottomCoordinate = google.maps.geometry.spherical.computeOffset(origLatLng, $scope.kilometerRadius * 100, 180).k;
          var rightCoordinate = google.maps.geometry.spherical.computeOffset(origLatLng, $scope.kilometerRadius * 100, 90).D;
          var leftCoordinate = google.maps.geometry.spherical.computeOffset(origLatLng, $scope.kilometerRadius * 100, 270).D;
        }
        else
        {
          var topCoordinate = 0;
          var bottomCoordinate = 0;
          var rightCoordinate = 0;
          var leftCoordinate = 0;
        }

        //api request
        Offer.getOffer({api_key: Token.api_key, foodict_ID: Token.foodict_ID, top: topCoordinate, bottom: bottomCoordinate, left: leftCoordinate, right: rightCoordinate},
          function(successData){
            if(successData.isAuthorized)
            {
              $scope.offers = successData.result;
            }
            else
            {
              $foodieUtils.confirm();
            }
          },
          function(error){
            $foodieUtils.errorCatcher(error.status);
          });

      }, 
      function(error){
        $foodieUtils.warning("Cannot retrieve offers","We're unable to get offers based from your location. Please make sure your location services are enabled. " + error);
      }, { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true });
  }

  $scope.refreshOffers = function(){
    $scope.getAllOffers();
    $ionicScrollDelegate.scrollTop();
    $scope.$broadcast('scroll.refreshComplete');
  }

  $scope.toggleLocation = function(){
    $scope.isLocation = !$scope.isLocation;
    $scope.getAllOffers();
  }


  $scope.waitDone = function(){
    $timeout.cancel(waiter);
    var waiter = $timeout(function(){$scope.getAllOffers();}, 1500);
  }

  //=-=-=-=-=-=-=-ONLOAD-=-=-=-=-=-=-=-=-=
  $scope.getAllOffers();

})

.controller('OffersDetailCtrl', function($scope, $location, $foodieUtils, $ionicLoading, $stateParams, $interval, Token, Offer) {

  $scope.getOffer = function(){
    Offer.getOffer({api_key: Token.api_key, foodict_ID: Token.foodict_ID, offer_ID: $stateParams.offerID},
      function(successData){
        if(successData.isAuthorized)
        {
          $scope.offer = successData.result[0];
        }
        else
        {
            $foodieUtils.confirm("Expired Account","To continue using Foodie, please re-login your accounts. Re-login now?",function(res){
              if (res){
                //true
                window.localStorage.clear();
                $location.path('/login').replace();
              }
            });
        }
      },
      function(error){
        $interval.cancel(roc);
        $location.path('/tab/offers').replace();
        $foodieUtils.alert("Expired Offer","Sorry that offer is already expired.");
      });
  }

  $scope.getOfferUpdates = function(){
    Offer.getUpdates({offer_ID: $stateParams.offerID},
      function(successData){
        $scope.offer.offer_availed = successData.offer_availed;
        $scope.offer.offer_max = successData.offer_max;
        $scope.offer.offer_isAvailable = successData.offer_isAvailable
      },
      function(error){
        $foodieUtils.errorCatcher(error.status);
      });
  }

  $scope.availOffer = function(offer){
    if($scope.offer.offer_isAvailable)
    {
          $foodieUtils.confirm("You're about to avail a coupon","Do you really want to avail this coupon worth ["+$scope.offer.offer_amount+" FP]?",function(res){
          if (res){
            /**/
              $ionicLoading.show();
              Offer.availVoucher(null,{api_key: Token.api_key, foodict_ID: Token.foodict_ID, offer_ID: offer.offer_ID},
                function(successData){
                  $ionicLoading.hide();
                  if(successData.isAuthorized)
                  {
                    if(successData.result.status == 1)
                    {
                      $foodieUtils.alert("Transaction successful!","You have successfully availed a new voucher!");
                    }
                    else if(successData.result.status == 0)
                    {
                      $foodieUtils.warning("Insufficient points", "Sorry, your foodie point(s) ["+successData.result.foodict_foodie_points+" FP] is insufficient to avail the offer worth ["+successData.result.offer_amount+" FP].");
                    }
                    else
                    {
                      $foodieUtils.warning("Expired offer","Sorry, this offer is already expired.", function(){
                        $location.path('/tab/offers').replace();
                      });
                    }
                  }
                  else
                  {
                      $foodieUtils.confirm("Expired Account","To continue using Foodie, please re-login your accounts. Re-login now?",function(res){
                        if (res){
                          //true
                          window.localStorage.clear();
                          $location.path('/login').replace();
                        }
                      });
                  }
                },
                function(error){
                  $ionicLoading.hide();
                  $foodieUtils.errorCatcher(error.status);
                });
            /**/
          }
        });
    }
    

  }
    

  //=-=-=-=-=-=-=-PASSIVE-=-=-=-=-=-=-=-=-=
  var roc = $interval(function(){     
    $scope.getOfferUpdates();
  },3000);

  //=-=-=-=-=-=-=-ONLOAD-=-=-=-=-=-=-=-=-=
  $scope.getOffer();



  //=-=-=-=-=-=-=-ONDESTROY-=-=-=-=-=-=-=-=-=
  $scope.$on('$destroy', function() {
    // Make sure that the interval is destroyed too
    $interval.cancel(roc);
  });

});


