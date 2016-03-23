angular.module('foodie.controllers.promotion', ['foodie.services', 'foodie.plugins'])

.controller('FooducerPromotionCtrl', function($scope, $location, $foodieUtils, $ionicLoading, $ionicModal, Token, Promote) {  
  $scope.getMyPromotion = function(isActiveOnly){
    Promote.getMyPromotion({api_key: Token.api_key, fooducer_ID: Token.fooducer_ID, isActive: isActiveOnly},
      function(successData){
        if(successData.isAuthorized)
          {
            $scope.promotions = successData.result;
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
  $scope.endPromotion = function(){
    $foodieUtils.confirm("End Promotion","Do you really want to end this promotion?",function(res){
      if (res){
        Promote.endPromotion(null, {api_key: Token.api_key, fooducer_ID: Token.fooducer_ID},
          function(successData){
            if(successData.isAuthorized)
              {
                if(successData.result){
                  $scope.promotions = null;
                  $foodieUtils.alert("Promotion ended","Your promotion was ended successfully!");
                }
                else
                {
                  $foodieUtils.alert("Something's not right.","We cannot end your promotion right now. Please try again later.");
                }
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
    });
    
  }

  $scope.createPromotion = function(){
    $scope.openPromoteModal();    
  }

  $ionicModal.fromTemplateUrl('templates/modal/modal-promote.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.promoteModal = modal;
  });
  $scope.openPromoteModal = function() {    
    $scope.promoteModal.show();
  };
  $scope.closePromoteModal = function() {
    $scope.promoteModal.hide(); 
    $scope.getMyPromotion(true);   
  };

/*====================== ONLOAD =======================*/
$scope.getMyPromotion(true);
})

.controller('PromoteModalCtrl', function($scope, $location, $ionicLoading, $foodieUtils, $jrCrop, Camera, Token, Promote) {
  
  $scope.image_string = "img/add_image.jpg";

  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--=-=-=-=-=-=-=-=-=-=-=-=-=-=BLOGGING FUNCTIONS=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  $scope.getPhoto = function() {
      $foodieUtils.cameraActionSheet(function(index){
        if(index == 0)
        {
          Camera.takePicture().then(
            function(imageURI) {
              $scope.createImage(imageURI);
            }, 
            function(err) {
              console.err(err);
            }
          );
        }
        else
        {
          Camera.fromLibrary().then(
            function(imageURI) {
              $scope.createImage(imageURI);
            }, 
            function(err) {
              console.err(err);
            }
          );
        }
      });
    };



  $scope.createImage = function(file_uri){
      $jrCrop.crop({
          url: file_uri,
          width: 340,
          height: 340,
          title: 'Crop image'         
      })
      .then(function(canvas) {
          // success!    
          $scope.offer_image = canvas.toDataURL("image/png");
          $scope.image_string = canvas.toDataURL("image/png");
      }, function(err) {
          // User canceled or couldn't load image.
          $foodieUtils.alert("Crop error","Sorry we cannot successfully crop your photo.");
      });
  } 



    $scope.dateCompare = function(a,b) {
        var x = new Date(moment(a, "YYYY-MM-DD").utc());
        var y = new Date(moment(b, "YYYY-MM-DD").utc());
        if(x < y)
        {
          return 1;
        }
        else
        {
          return -1;
        }
    }

    $scope.compareNow = function(a) {
        var x = new Date(moment(a, "YYYY-MM-DD").utc());
        var y = new Date(moment(moment.utc(), "YYYY-MM-DD"));
        if(x > y)
        {
          return true;
        }
        else
        {
          return false;
        }
    }

  $scope.postOffer = function(){

      //adding timezone information
      // var claim_from_zoned = moment($scope.offer_claim_from, "YYYY-MM-DD");
      // alert(claim_from_zoned); 
      //alert(moment($scope.offer_claim_from, "YYYY-MM-DD").format()); 

      if($scope.offer_image == null)
      {
          $foodieUtils.alert("No image", "Please add an image");        
      }
      else if($scope.offer_title == null)
      {        
          $foodieUtils.alert("No title", "Please add a catchy title");
      }
      else if($scope.offer_text == null)
      {        
          $foodieUtils.alert("No description", "Please add a short description.");
      }
      else if($scope.offer_details == null)
      {        
          $foodieUtils.alert("No details", "Please add details such as rules and exemptions of your promo.");
      }
      else if($scope.offer_savings == null)
      {        
          $foodieUtils.alert("No savings", "Please add estimated savings to help you gather more customers.");
      }
      else if($scope.offer_max == null)
      {        
          $foodieUtils.alert("No max coupons defined", "Please specify count of coupons you'll release");
      }
      else if($scope.offer_amount == null)
      {        
          $foodieUtils.alert("No amount", "Please add an Foodie Point amount for your coupon");
      }
      else if($scope.offer_max < 10 || $scope.offer_max > 99 )
      {        
          $foodieUtils.alert("Invalid coupon count", "Number of coupons to be released must not be less than 10 or greater than 99.");
      }
      else if($scope.offer_amount < 25 || $scope.offer_amount > 250)
      {        
          $foodieUtils.alert("Invalid amount", "Cost must not be less than 25 or greater than 250 Foodie points");
      }
      else if(!$scope.compareNow($scope.offer_claim_from))
      {
          $foodieUtils.alert("Invalid claim Start date", "Claim Start date must not be less than or today");
      }
      else if($scope.dateCompare($scope.offer_claim_from,$scope.offer_claim_to) != 1)
      {
          $foodieUtils.alert("Invalid claim End date", "Claim End date must not be less than or same to start date");
      }
      else
      {
          $ionicLoading.show(); //show loader
          var new_item = {api_key: Token.api_key, fooducer_ID: Token.fooducer_ID, offer_image: $scope.offer_image, offer_title: $scope.offer_title,
            offer_text: $scope.offer_text, offer_details: $scope.offer_details, offer_savings: $scope.offer_savings, offer_max: $scope.offer_max,
            offer_amount: $scope.offer_amount, offer_claim_from: moment($scope.offer_claim_from, "YYYY-MM-DD"), offer_claim_to: moment($scope.offer_claim_to, "YYYY-MM-DD")};

          Promote.postPromotion(null,new_item,
          function(successData){
            if(successData.isAuthorized == true)
              {
                  $ionicLoading.hide();
                  if(successData.result)
                  {
                    $foodieUtils.alert("Post Successful", "Congratulations! Your offer was succesfully posted.", function(){
                      $scope.closePromoteModal();
                    });
                  }
                  else
                  {
                    $foodieUtils.alert("Post unsuccessful","Unable to post the new promotion.");
                  }
              }
            else
              {
                $ionicLoading.hide();
                $foodieUtils.confirm("Expired Account","To continue using Foodie, please re-login your account. Re-login now?",function(res){
                  if (res){
                    //true
                    window.localStorage.clear();
                    $location.path('/login').replace();
                  }
                });
                // $scope.comments = null;
              }    
          }, 
          function(error) {
              $ionicLoading.hide();
              $foodieUtils.errorCatcher(error.status);
          });
      }
      
    }

    $scope.checkProceed = function(){
    if($scope.offer_image != null && $scope.offer_title != null && $scope.offer_text != null && $scope.offer_savings != null && isNumber($scope.offer_max) && isNumber($scope.offer_amount))
    {
      return false;
    }
    else
    {
      return true;
    }


  }



    function isNumber(n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    }

//=-=-=-=-=-=-=-=-=-=--=--=-=-=-=-=-=-=  ONLOAD  =-=-=--=--=-=--=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-



});


