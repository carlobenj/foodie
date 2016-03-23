angular.module('foodie.controllers.fooducer.validate', ['foodie.services', 'foodie.plugins'])

.controller('FooducerValidateCtrl', function($scope, $location, $foodieUtils, $ionicLoading, Token, Validate) {  
  $scope.getValidateTiles = function(){
    Validate.getValidateTiles({api_key: Token.api_key, fooducer_ID: Token.fooducer_ID},
      function(successData){
        if(successData.isAuthorized)
          {
            $scope.validateTiles = successData.result;
          }
        else
          {
            $foodieUtils.confirm("Expired Account","To continue using Foodie, please re-login your account. Re-login now?",function(res){
              if (res){
                //true
                window.localStorage.clear();
                $location.path('/login').replace();
                Token.destroyToken();
              }
            });
          }
      },
      function(error){
            $foodieUtils.errorCatcher(error.status);
      });
  }

  $scope.goToPromo = function(offer_ID){
    $location.path('/fooducer/validate/promo/' + offer_ID).replace();
  }

  /*========================== ONLOAD ==========================*/
  $scope.getValidateTiles();
})
.controller('FooducerValidatePromoCtrl', function($scope, $location, $foodieUtils, $ionicLoading, $ionicNavBarDelegate, $cordovaBarcodeScanner, $timeout, $stateParams, Token, Validate) {  
  $scope.isValidating = false;
  $scope.status_text = null;
  $scope.isDone = false;
  
  $scope.getValidatePromo = function(){
    Validate.getValidatePromo(null, {api_key: Token.api_key, fooducer_ID: Token.fooducer_ID, offer_ID: $stateParams.promoID},
      function(successData){
        if(successData.isAuthorized)
          {
            $scope.promotion = successData.result;
            $ionicNavBarDelegate.changeTitle(successData.result.offer_title, 'forward');
          }
        else
          {
            $foodieUtils.confirm("Expired Account","To continue using Foodie, please re-login your account. Re-login now?",function(res){
              if (res){
                //true
                window.localStorage.clear();
                $location.path('/login').replace();
                Token.destroyToken();
              }
            });
          }
      },
      function(error){
          $foodieUtils.errorCatcher(error.status);
      });
  }

  $scope.openCouponDetails = function(offer_ID){
    $location.path('/fooducer/validate/promo/details/' + offer_ID).replace();
  }

  $scope.doneValidating = function(){
    $scope.isValidating = false;
    $scope.isDone = false;
    $scope.status_text = null;
  }

  $scope.validateCoupon = function(){
    $cordovaBarcodeScanner.scan()
      .then(function(imageData) {
          Validate.scanCode(null, {api_key: Token.api_key, fooducer_ID: Token.fooducer_ID, offer_ID: $stateParams.promoID, voucher_code: imageData.text},
            function(successData){
              if(successData.isAuthorized)
                {
                  $scope.validating_foodict = successData.result;
                  $scope.isValidating = true;
                  $scope.isDone = false;
                  $scope.status_text = "Validating coupon...";                  
                  $scope.status = successData.result.status;
                  $timeout(function(){                    
                    $scope.isDone = true;
                    if(successData.result.status == 1){
                      $scope.status_text = "Coupon validated!"
                      for(x = 0; x < $scope.promotion.availers.length; x++)
                      {
                        if($scope.promotion.availers[x].foodict_ID == successData.result.foodict_ID && $scope.promotion.availers[x].voucher_code == successData.result.voucher_string)
                        {
                            $scope.promotion.availers[x].isClaimed = true; //mark as claimed on list of availers below
                        }
                      }
                    }
                    else if(successData.result.status == 2){                      
                      $scope.status_text = "Malformed coupon code."
                    }
                    else if(successData.result.status == 3){                      
                      $scope.status_text = "Tampered coupon code."
                    }
                    else if(successData.result.status == 4){                      
                      $scope.status_text = "This coupon is not for this company."
                    }
                    else if(successData.result.status == 5){                      
                      $scope.status_text = "Wrong promotion chosen."
                    }
                    else if(successData.result.status == 6){                      
                      $scope.status_text = "This coupon is already expired."
                    }
                    else if(successData.result.status == 7){                      
                      $scope.status_text = "This coupon is already claimed."
                    }
                    else if(successData.result.status == 8){                      
                      $scope.status_text = "Something's not right. Error unknown."
                    }
                    else
                    {
                      $scope.status_text = "Please revalidate coupons after a few minutes."                      
                    }
                  }, 3000); 
                }
              else
                {
                  $foodieUtils.confirm("Expired Account","To continue using Foodie, please re-login your account. Re-login now?",function(res){
                    if (res){
                      //true
                      window.localStorage.clear();
                      $location.path('/login').replace();
                      Token.destroyToken();
                    }
                  });
                }
            },
            function(error){
                $foodieUtils.errorCatcher(error.status);
            });
      }, 
      function(error) {
        alert(error);
      });
  } 

  /*========================== ONLOAD ==========================*/
  $scope.getValidatePromo();
})
.controller('FooducerValidatePromoDetailsCtrl', function($scope, $location, $foodieUtils, $ionicLoading, $ionicNavBarDelegate, $stateParams, Token, Validate) {  
  $scope.getValidatePromo = function(){
    Validate.getValidatePromo(null, {api_key: Token.api_key, fooducer_ID: Token.fooducer_ID, offer_ID: $stateParams.promoID},
      function(successData){
        if(successData.isAuthorized)
          {
            $scope.promotion = successData.result;
            $ionicNavBarDelegate.changeTitle(successData.result.offer_title, 'forward');
          }
        else
          {
            $foodieUtils.confirm("Expired Account","To continue using Foodie, please re-login your account. Re-login now?",function(res){
              if (res){
                //true
                window.localStorage.clear();
                $location.path('/login').replace();
                Token.destroyToken();
              }
            });
          }
      },
      function(error){
          $foodieUtils.errorCatcher(error.status);
      });
  }  

  /*========================== ONLOAD ==========================*/
  $scope.getValidatePromo();
});


