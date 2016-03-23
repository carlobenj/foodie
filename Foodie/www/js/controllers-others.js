angular.module('foodie.controllers.others', ['foodie.services', 'foodie.plugins'])

.constant('$ionicLoadingConfig', {
  template: 'Loading...'
})

.controller('LoginCtrl', function($scope, $location, $foodieUtils, $ionicLoading, Login, Token, googleMapsFactory, $cordovaFacebook, $ionicModal, $ionicPopup, Suggest, $rootScope) {
  $scope.isLogging = false;    


  // var s = "01/18/2015T00:00:00-13:00";
  // console.log(moment(s).zone(s));
  Token.destroyToken(); // Destroy token when login is loaded
  $scope.login = function(){
      $scope.isLogging = true;
      var new_item = {username: $scope.username, password: $scope.password, publicKey: "$K3uj3R!<@m|(@(h^aj^N3+W0Tw3n+Y14K3u$"};
      Login.LoginMyAccount(null,new_item,
      function(successData){   
        if(successData.isAuthorized == true)
          {
            if(successData.result != null)
            {
              if(successData.result.user_type=="foodict")
              {                
                Token.establishFoodictToken(successData.result.api_key,successData.result.user_ID,successData.result.MyID,"foodict");
                window.localStorage.setItem("username",$scope.username);
                window.localStorage.setItem("password",$scope.password);
                $location.path('/tab/newsfeed').replace();
                $scope.isLogging = false; 
              }
              else if(successData.result.user_type=="fooducer")
              {
                Token.establishFooducerToken(successData.result.api_key,successData.result.user_ID,successData.result.MyID,"fooducer");
                window.localStorage.setItem("username",$scope.username);
                window.localStorage.setItem("password",$scope.password);
                $location.path('/fooducer/dash').replace();                
                $scope.isLogging = false; 
              }
              else if(successData.result.user_type=="admin")
              {
                Token.establishAdministratorToken(successData.result.api_key,successData.result.user_ID,successData.result.MyID,"admin");
                window.localStorage.setItem("username",$scope.username);
                window.localStorage.setItem("password",$scope.password);
                $location.path('/admin/spam').replace();            
                $scope.isLogging = false; 
              }
              else
              {
                $foodieUtils.alert("Not in my recipe book!","An error has occured and this is unexpected! Gotta researched for this. Thanks a lot fella!");            
                $scope.isLogging = false; 
              }
            }
            else
            {
              $foodieUtils.alert("Invalid Account","Please double check the entered email and password.");            
              $scope.isLogging = false; 
            }
            // $ionicLoading.hide();
            // $scope.closeModal();
            // $scope.comments = successData.result;
          }
        else
          {
            $foodieUtils.warning("Unauthorized Access","You are not authorized to access Foodie. Your IP address is sent to server.");
            $scope.isLogging = false; 
          }   
      }, 
      function(error) {
          // $ionicLoading.hide();
          $foodieUtils.errorCatcher(error.status);          
          $scope.isLogging = false; 
      });
  }

  $scope.loginfb = function(){
     $cordovaFacebook.login(["public_profile", "email", "user_friends"])
      .then(function(success) {
        if(success.status == "connected")
        {
          //for normal data
          $cordovaFacebook.api("me", ["public_profile"])
          .then(function(data) {
                //TRY LOGIN WITH FB
                $ionicLoading.show();
                Login.loginViaFB({publicKey: '$K3uj3R!<@m|(@(h^aj^N3+W0Tw3n+Y14K3u$', fbid: data.id},
                  function(successData){  
                    $ionicLoading.hide();
                    if(successData.isAuthorized == true)
                      {
                          if(successData.result.isSignedUp)
                          {
                            //may account na
                            $scope.username = successData.result.username;
                            $scope.password = successData.result.password;
                            $scope.login();
                          }
                          else
                          {
                            //fb signup to
                            $cordovaFacebook.api("me/picture?redirect=0&height=200&type=normal&width=200", ["public_profile"])
                              .then(function(image) {
                                $scope.openSignUpFBmodal(data, image.data.url);
                              }, function (error) {
                                $foodieUtils.alert("Facebook Error",error);
                              });
                          }
                           
                      }
                    else
                      {
                        $foodieUtils.warning("Unauthorized Access","You are not authorized to access Foodie. Your IP address is sent to server.");
                      }   
                  }, 
                  function(error) {
                    $ionicLoading.hide();
                    $foodieUtils.errorCatcher(error.status);   
                  });
               
          }, function (error) {
            $foodieUtils.alert("Facebook Error",error);
          });        
        }
      }, 
      function (error) {
        $foodieUtils.alert("Facebook Error",error);
      });
  }

  $scope.checkCredentials = function(){
    if(window.localStorage.getItem("username") != null && window.localStorage.getItem("password") != null)
    {
      $scope.username = window.localStorage.getItem("username");
      $scope.password = window.localStorage.getItem("password");
      $scope.login();
    }
  }

  $scope.forgotPassword = function(){
    if($scope.username){      //if not null
      $scope.data = {}
      var customPopup = $ionicPopup.show({
       template: '<input type="text" ng-model="data.emailForgot">',
       title: '<b class="foodie-assertive">Forgot Password</b>',
       subTitle: '<p>Please provide your email address registered on your account. Your password will be reset and will be sent to your email.</p>',
       scope: $scope,
       buttons: [
         {
           text: 'Cancel',
           type: 'button-light',
           onTap: function(e) {
              result = null;
           }
         },
         {
           text: 'Done',
           type: 'button-assertive foodie-button-assertive',
           onTap: function(e) {
              if (!$scope.data.emailForgot) {
                e.preventDefault();
              } else {
                $ionicLoading.show();
                Login.forgotPassword({publicKey: '$K3uj3R!<@m|(@(h^aj^N3+W0Tw3n+Y14K3u$', username: $scope.username, user_email: $scope.data.emailForgot},
                  function(successData){ 
                  $ionicLoading.hide(); 
                    if(successData.isAuthorized == true)
                      {
                          if(successData.result == 0)
                          {
                            $foodieUtils.warning("Password reset failed!","Please double check your username or email.");
                          }
                          else if(successData.result == 1)
                          {
                            $foodieUtils.warning("Password reset successful!","Your new password was sent to your email.");
                          }
                          else if(successData.result == 2)
                          {
                            $foodieUtils.warning("Something wasn't right","Sorry for that, please try again later.");
                          }
                           
                      }
                    else
                      {
                        $foodieUtils.warning("Unauthorized Access","You are not authorized to access Foodie. Your IP address is sent to server.");
                      }   
                  }, 
                  function(error) {
                    $ionicLoading.hide(); 
                    $foodieUtils.errorCatcher(error.status);   
                  });
              }
           }
         }
       ]
      });

      // $foodieUtils.inputPopup("Forgot Password","Please provide your email address registered on your account. Your password will be reset and will be sent to your email.", 
      //   function(result){
      //     alert(result);
      //   });
    }
    else
    {
      $foodieUtils.warning("Forgot Password","Please set your username first.");
    }
  }




  $ionicModal.fromTemplateUrl('templates/modal/modal-signupFB.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
      $scope.signUpFBmodal = modal;
  });
  
  $scope.openSignUpFBmodal = function(obj, img) {    
    $scope.signUpFBmodal.show();
    $scope.foodict_first_name = obj.first_name;
    $scope.foodict_middle_name = obj.middle_name;
    $scope.foodict_last_name = obj.last_name;    
    $scope.user_email = obj.email;  
    $scope.foodict_fbid = obj.id;
    $scope.foodict_image = img;
    if(obj.gender == "male")
    {
      $scope.foodict_isMale = true;
    }
    else
    {      
      $scope.foodict_isMale = false;
    }
  };
  
  $scope.closeSignUpFBmodal = function() {
    $scope.signUpFBmodal.hide();     
  };

  $scope.loginSignUpAccount = function(un,pw, isFB) {    
    $scope.signUpFBmodal.hide();     
    $scope.signUpmodal.hide();  
    if(un != null && pw != null)
    {
      $scope.username = un;
      $scope.password = pw;
      $scope.login();
      if(isFB){
         $rootScope.isFB = true;
      }  
      $rootScope.first_time = true;    
    }   

  };

  $ionicModal.fromTemplateUrl('templates/modal/modal-terms.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
      $scope.termsModal = modal;
  });

  $scope.openTermsModal = function() {
    $scope.termsModal.show();    
  };
  $scope.closeTermsModal = function() {
    $scope.termsModal.hide();     
  };



  $ionicModal.fromTemplateUrl('templates/modal/modal-about.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
      $scope.aboutModal = modal;
  });

  $scope.openAboutModal = function() {
    $scope.aboutModal.show();    
  };
  $scope.closeAboutModal = function() {
    $scope.aboutModal.hide();     
  };



  $ionicModal.fromTemplateUrl('templates/modal/modal-signup.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
      $scope.signUpmodal = modal;
  });

  $scope.openSignUpmodal = function() {
    $scope.signUpmodal.show();     
  };
  $scope.closeSignUpmodal = function() {
    $scope.signUpmodal.hide();     
  };












  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.termsModal.remove();
    $scope.aboutModal.remove();
    $scope.signUpmodal.remove();
    $scope.signUpFBmodal.remove();
  });
  
  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    // Execute action
  });
  
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  });



  $scope.checkCredentials();
})


.controller('SignUpFbModalCtrl', function($scope, $location, $foodieUtils, $ionicLoading, $ionicSlideBoxDelegate, Token, Signup, $cordovaFacebook, $ionicLoading) {

  $scope.isAvailable = false;
  $scope.foodict_username = "";
  




  /*========== FUNCTIONS ==========*/

  $scope.checkExist = function(val){
    Signup.checkExistUsername({username: $scope.foodict_username},
      function(successData){     
        $scope.isAvailable = !successData.result;
      }, 
      function(error) {
          $foodieUtils.errorCatcher(error.status);
      });
  }

  $scope.checkProceed = function(){
    if($scope.user_password == $scope.user_password_2 && $scope.isAvailable == true && $scope.user_password.length > 6 && $scope.user_password_2.length > 6)
    {
      return false;
    }
    else
    {
      return true;
    }
  }

  $scope.signUpNow = function(){
    if($scope.user_password == $scope.user_password_2 && $scope.isAvailable == true)
    {
      $ionicLoading.show();
      var signup_item = {publicKey: '$K3uj3R!<@m|(@(h^aj^N3+W0Tw3n+Y14K3u$', foodict_username: $scope.foodict_username, foodict_first_name: $scope.foodict_first_name,
                      foodict_middle_name: $scope.foodict_middle_name, foodict_last_name: $scope.foodict_last_name, foodict_isMale: $scope.foodict_isMale,
                      foodict_image: $scope.foodict_image, foodict_fbid: $scope.foodict_fbid, user_email: $scope.user_email, user_password: $scope.user_password}
      Signup.signItUp(null,signup_item,
        function(successData){ 

          $ionicLoading.hide();      
          if(successData.isAuthorized)
          {
            if(successData.result_code == 1)
            {
              $foodieUtils.alert("Sign up successfully","Congratulations! Your account was successfully created.", function(){                
                $scope.loginSignUpAccount($scope.foodict_username, $scope.user_password, true);
              });
            }
            else if(successData.result_code == 2)
            {
              $foodieUtils.alert("Sign Up Failed","Existing username");
            }
            else if(successData.result_code == 3)
            {
              $foodieUtils.alert("Sign Up Failed","FB account already used");
            }
            else
            {            
              $foodieUtils.alert("Sign Up Failed","Check your credentials thoroughly");
            }
          }
          else
          {
            $foodieUtils.warning("Unauthorized Access","You are not authorized to access Foodie. Your IP address is sent to server.");
          }   
        }, 
        function(error) {
            $ionicLoading.hide();
            $foodieUtils.errorCatcher(error.status);
        });
    }
    
  }

  // $scope.getFriends = function(){
  // alert("pasok");
  //   $cordovaFacebook.api("me/friends?fields=name,picture", ["public_profile", "user_friends"])
  //     .then(function(success) {
  //       alert(success);
  //       $scope.foodict_friends = success.data;
  //     }, function (error) {
  //       $foodieUtils.alert("Facebook Error",error);
  //     }); 

  // }




  // $scope.selectThis = function(num){
  //   $scope.report_type = num;
  //   $scope.gotoSlide(num);
  //   if(num == 3)
  //   {
  //       $scope.sendReport();
  //   }
  // }

  // $scope.sendReport = function(type, id, desc){
  //   Report.reportThis(null,{api_key: Token.api_key, user_ID: Token.user_ID, report_type: type, report_item_ID: id, report_description: desc},
  //     function(successData) {
  //       if(successData.isAuthorized == true)
  //         {
  //             if(successData.result)
  //             {                
  //               $scope.gotoSlide(3);
  //             }
  //             else
  //             {
  //               $foodieUtils.alert("Report Unsuccessful","It seems that there is an error.", function(){
  //                 $scope.finishReport();
  //               });
  //             }
  //         }
  //       else
  //         {
  //           $foodieUtils.confirm("Expired Account","To continue using Foodie, please re-login your account. Re-login now?",function(res){
  //             if (res){
  //               //true
  //               window.localStorage.clear();
  //               $location.path('/login').replace();
  //             }
  //           });
  //         }    
  //     }, 
  //     function(error) {
  //       $foodieUtils.errorCatcher(error.status);
  //     });
  // }

  // $scope.unfollowThis = function(item, text){
  //   $foodieUtils.unfollowActionSheet(item.foodict_username, text, function(){
  //     Follow.unfollowThisFoodict({api_key: Token.api_key, source_foodict_ID: Token.foodict_ID, target_foodict_ID: item.foodict_ID},
  //     function(successData) {
  //       if(successData.isAuthorized == true)
  //         {
  //             if(successData.result)
  //             {
  //               $scope.gotoSlide(4);
  //             }
  //         }
  //       else
  //         {
  //           $foodieUtils.confirm("Expired Account","To continue using Foodie, please re-login your account. Re-login now?",function(res){
  //             if (res){
  //               //true
  //               window.localStorage.clear();
  //               $location.path('/login').replace();
  //             }
  //           });
  //         }    
  //     }, 
  //     function(error) {
  //       $foodieUtils.errorCatcher(error.status);
  //     });
  //   });
  // }

  // /*=============== ONLOAD ===============*/

  // $scope.finishReport = function(){
  // $scope.closeModalReport();
  // $scope.$broadcast('refreshNewsfeed');
  // $scope.gotoSlide(0);
  // }
})

.controller('SignUpModalCtrl', function($scope, $location, $foodieUtils, $ionicLoading, $ionicSlideBoxDelegate, Token, Signup) {

  $scope.isAvailable = false;
  $scope.foodict_username = "";
  $scope.genders = [{id: 0, name: "Male", value: true},{id: 1, name: "Female", value: false}];
  




  /*========== FUNCTIONS ==========*/

  $scope.checkExist = function(val){
    Signup.checkExistUsername({username: $scope.foodict_username},
      function(successData){     
        $scope.isAvailable = !successData.result;
      }, 
      function(error) {
          $foodieUtils.errorCatcher(error.status);
      });
  }

  $scope.checkProceed = function(){
    if($scope.isAvailable == true && $scope.user_password.length > 6)
    {
      return false;
    }
    else
    {
      return true;
    }
  }
  var regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  $scope.signUpNow = function(){
    var default_img = "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";
    if($scope.user_password.length <= 6)
    {
        $foodieUtils.alert("Sign Up Failed","Password must be greater than 6 characters.");
    }
    else if(!($scope.user_email!= null && $scope.user_email!= "" && $scope.user_email.trim().length > 10 && regex.test($scope.user_email)))
    {
        $foodieUtils.alert("Sign Up Failed","Please double check the current email field.");      
    }
    else if($scope.isAvailable)
    { 
      $ionicLoading.show(); 
      var signup_item = {publicKey: '$K3uj3R!<@m|(@(h^aj^N3+W0Tw3n+Y14K3u$', foodict_username: $scope.foodict_username, foodict_first_name: $scope.foodict_first_name,
                      foodict_middle_name: $scope.foodict_middle_name, foodict_last_name: $scope.foodict_last_name, foodict_isMale: $scope.foodict_isMale,
                      foodict_image: default_img, foodict_fbid: "", user_email: $scope.user_email, user_password: $scope.user_password}
      Signup.signItUp(null,signup_item,
        function(successData){    
          $ionicLoading.hide();    
          if(successData.isAuthorized)
          {
            if(successData.result_code == 1)
            {
              $foodieUtils.alert("Sign up successfully","Congratulations! Your account was successfully created.", function(){                
                $scope.loginSignUpAccount($scope.foodict_username, $scope.user_password, false);
              });
            }
            else if(successData.result_code == 2)
            {
              $foodieUtils.alert("Sign Up Failed","Existing username");
            }
            else if(successData.result_code == 3)
            {
              $foodieUtils.alert("Sign Up Failed","FB account already used");
            }
            else
            {            
              $foodieUtils.alert("Sign Up Failed","Check your credentials thoroughly");
            }
          }
          else
          {
            $foodieUtils.warning("Unauthorized Access","You are not authorized to access Foodie. Your IP address is sent to server.");
          }   
        }, 
        function(error) {
            $ionicLoading.hide(); 
            $foodieUtils.errorCatcher(error.status);
        });
    }
    
  }
})


.controller('NavBarCtrl', function($scope, $ionicModal, Token, $ionicScrollDelegate, $location, $rootScope, $foodieUtils, $ionicNavBarDelegate) {

  $rootScope.slideNav = false;
  $rootScope.slideHeaderPrevious = 0;

  $scope.goBack = function() {
    $ionicNavBarDelegate.back();
  };

  $scope.RestrictedFor = function(type)
  {
    if(Token.user_type == type)
      {
        return true;
      }
    else
      {
        return false;
      }
  }

  $scope.logoutThisAcount = function(){
    $foodieUtils.yesno("Loging out","Do you really want to log out?",function(res){
      if (res){
        window.localStorage.clear();  
        $location.path('/login').replace();   
      }
    });
  }


  //Compose Modal
  $ionicModal.fromTemplateUrl('templates/modal/modal-compose.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.composeModal = modal;
  });
  $scope.openComposeModal = function() {    
    $scope.composeModal.show();
  };
  $scope.closeComposeModal = function() {
    $scope.composeModal.hide();    
  };

  $ionicModal.fromTemplateUrl('templates/modal/modal-search.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.searchModal = modal;
  });
  $scope.openSearchModal = function() {    
    $scope.searchModal.show();
  };
  $scope.closeSearchModal = function() {
    $scope.searchModal.hide();        
    $scope.filter = null;     
    $scope.foodict_result = null;
    $scope.offer_result = null;
  };








  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  });
})



.controller('SearchModalCtrl', function($scope, $ionicScrollDelegate, $ionicLoading, $foodieUtils, $ionicPopup, $location, $state, Token, Search) {
  $scope.isFoodictSearch = true;
  $scope.filter = null;
  $scope.filterFoodict = function(val){
    $scope.isFoodictSearch = val;
  }
  $scope.searchIt = function(){
    if($scope.filter.length == 1)
    {
      Search.searchForThis({api_key: Token.api_key, user_ID: Token.user_ID, filter: $scope.filter},
        function(successData){
          if(successData.isAuthorized == true)
            {
              $scope.foodict_result = successData.result.foodict_result;
              $scope.offer_result = successData.result.offer_result;
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
    else if($scope.filter.length == 0 || $scope.filter == null || $scope.filter.trim() == "")
    {
      $scope.foodict_result = null;
      $scope.offer_result = null;
    }
    else
    {
      //do nothing
    }
  }

  $scope.openProfile = function(foodict_ID){
      $scope.closeSearchModal();
      if(Token.foodict_ID == foodict_ID)
      {
        $location.path('/tab/home').replace();
      }
      else
      {        
        $location.path('/tab/newsfeed/otherprofile/' + foodict_ID).replace();
      }
  }

  $scope.openOffer = function(offer_ID){   
    $scope.closeSearchModal();
    $location.path("/tab/newsfeed/sharedoffer/" + offer_ID).replace();
  }
})

.controller('TabsCtrl', function($scope, $interval, Token, Notification) {

  $scope.RestrictedFor = function(type)
  {
    if(Token.user_type == type)
      {
        return true;
      }
    else
      {
        return false;
      }
  }

  $scope.checkForNotification = function(){
    Notification.countMyNotifications({api_key: Token.api_key, user_ID: Token.user_ID, foodict_ID: Token.foodict_ID},
        function(successData){
          if(successData.isAuthorized == true)
            {
              $scope.notificationCount = successData.result;
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

  $scope.$on('resetNotificationCount', function() { 
    $scope.notificationCount = 0;
  });

  $scope.$on('logoutAccount', function() { 
    $interval.cancel(notiInterval);
  });

  $scope.$on('checkNoti', function() { 
    $scope.checkForNotification();
  });
  
  var notiInterval = $interval(function(){     
    $scope.checkForNotification();
  },15000);

})


.controller('ImageFilterModalCtrl', function($scope, $ionicScrollDelegate, $ionicLoading, $foodieUtils, $rootScope, $ionicPopup, $location, $state, Token, Search) {

  $scope.doneEditing = function(){    
    $scope.imagefiltermodal.hide();
  }
  $scope.filterize = function(filterType){       
    $ionicLoading.show();
    switch(filterType)
    {
      case "normal":      
        Caman("#filtercanvas", $scope.post_image, function () {
          this.revert(false);          
          this.resize({
            width: 340,
            height: 340
          });
          $ionicLoading.hide();
          $scope.saveImage(this.canvas.toDataURL("image/png"));
        });
        break;
      case "1977":      
        Caman("#filtercanvas", $scope.post_image, function () {
          this.revert(false);
          this.old7();
          this.resize({
            width: 340,
            height: 340
          });
          this.render(function(){ 
            $ionicLoading.hide();
            $scope.saveImage(this.canvas.toDataURL("image/png"));
          });
        });
        break;
      case "brannan":      
        Caman("#filtercanvas", $scope.post_image, function () {
          this.revert(false);
          this.brannan();
          this.resize({
            width: 340,
            height: 340
          });
          this.render(function(){ 
            $ionicLoading.hide();
            $scope.saveImage(this.canvas.toDataURL("image/png"));
          });
        });
        break;
      case "gotham":      
        Caman("#filtercanvas", $scope.post_image, function () {
          this.revert(false);
          this.gotham();
          this.resize({
            width: 340,
            height: 340
          });
          this.render(function(){ 
            $ionicLoading.hide();
            $scope.saveImage(this.canvas.toDataURL("image/png"));
          });
        });
        break;
      case "hefe":      
        Caman("#filtercanvas", $scope.post_image, function () {
          this.revert(false);
          this.hefe();
          this.resize({
            width: 340,
            height: 340
          });
          this.render(function(){ 
            $ionicLoading.hide();
            $scope.saveImage(this.canvas.toDataURL("image/png"));
          });
        });
        break;
      case "lordkelvin":      
        Caman("#filtercanvas", $scope.post_image, function () {
          this.revert(false);
          this.lordkelvin();
          this.resize({
            width: 340,
            height: 340
          });
          this.render(function(){ 
            $ionicLoading.hide();
            $scope.saveImage(this.canvas.toDataURL("image/png"));
          });
        });
        break;
      case "nashville":      
        Caman("#filtercanvas", $scope.post_image, function () {
          this.revert(false);
          this.nashville();
          this.resize({
            width: 340,
            height: 340
          });
          this.render(function(){ 
            $ionicLoading.hide();
            $scope.saveImage(this.canvas.toDataURL("image/png"));
          });
        });
        break;
      case "xpro":      
        Caman("#filtercanvas", $scope.post_image, function () {
          this.revert(false);
          this.xpro();
          this.resize({
            width: 340,
            height: 340
          });
          this.render(function(){ 
            $ionicLoading.hide();
            $scope.saveImage(this.canvas.toDataURL("image/png"));
          });
        });
        break;
      case "vintage":      
        Caman("#filtercanvas", $scope.post_image, function () {
          this.revert(false);
          this.resize({
            width: 340,
            height: 340
          });
          this.vintage().render(function(){ 
            $ionicLoading.hide();
            $scope.saveImage(this.canvas.toDataURL("image/png"));
          });
        });
        break;
      case "lomo":      
        Caman("#filtercanvas", $scope.post_image, function () {
          this.revert(false);
          this.resize({
            width: 340,
            height: 340
          });
          this.lomo().render(function(){ 
            $ionicLoading.hide();
            $scope.saveImage(this.canvas.toDataURL("image/png"));
          });
        });
        break;
      case "clarity":      
        Caman("#filtercanvas", $scope.post_image, function () {
          this.revert(false);
          this.resize({
            width: 340,
            height: 340
          });
          this.clarity().render(function(){ 
            $ionicLoading.hide();
            $scope.saveImage(this.canvas.toDataURL("image/png"));
          });
        });
        break;
      case "sinCity":      
        Caman("#filtercanvas", $scope.post_image, function () {
          this.revert(false);
          this.resize({
            width: 340,
            height: 340
          });
          this.sinCity().render(function(){ 
            $ionicLoading.hide();
            $scope.saveImage(this.canvas.toDataURL("image/png"));
          });
        });
        break;
      case "sunrise":      
        Caman("#filtercanvas", $scope.post_image, function () {
          this.revert(false);
          this.resize({
            width: 340,
            height: 340
          });
          this.sunrise().render(function(){ 
            $ionicLoading.hide();
            $scope.saveImage(this.canvas.toDataURL("image/png"));
          });
        });
        break;
      case "crossProcess":      
        Caman("#filtercanvas", $scope.post_image, function () {
          this.revert(false);
          this.resize({
            width: 340,
            height: 340
          });
          this.crossProcess().render(function(){ 
            $ionicLoading.hide();
            $scope.saveImage(this.canvas.toDataURL("image/png"));
          });
        });
        break;
      case "orangePeel":      
        Caman("#filtercanvas", $scope.post_image, function () {
          this.revert(false);
          this.resize({
            width: 340,
            height: 340
          });
          this.orangePeel().render(function(){ 
            $ionicLoading.hide();
            $scope.saveImage(this.canvas.toDataURL("image/png"));
          });
        });
        break;
      case "love":      
        Caman("#filtercanvas", $scope.post_image, function () {
          this.revert(false);
          this.resize({
            width: 340,
            height: 340
          });
          this.love().render(function(){ 
            $ionicLoading.hide();
            $scope.saveImage(this.canvas.toDataURL("image/png"));
          });
        });
        break;
      case "grungy":      
        Caman("#filtercanvas", $scope.post_image, function () {
          this.revert(false);
          this.resize({
            width: 340,
            height: 340
          });
          this.grungy().render(function(){ 
            $ionicLoading.hide();
            $scope.saveImage(this.canvas.toDataURL("image/png"));
          });
        });
        break;
      case "jarques":      
        Caman("#filtercanvas", $scope.post_image, function () {
          this.revert(false);
          this.resize({
            width: 340,
            height: 340
          });
          this.jarques().render(function(){ 
            $ionicLoading.hide();
            $scope.saveImage(this.canvas.toDataURL("image/png"));
          });
        });
        break;
      case "pinhole":      
        Caman("#filtercanvas", $scope.post_image, function () {
          this.revert(false);
          this.resize({
            width: 340,
            height: 340
          });
          this.pinhole().render(function(){ 
            $ionicLoading.hide();
            $scope.saveImage(this.canvas.toDataURL("image/png"));
          });
        });
        break;
      case "oldBoot":      
        Caman("#filtercanvas", $scope.post_image, function () {
          this.revert(false);
          this.resize({
            width: 340,
            height: 340
          });
          this.oldBoot().render(function(){ 
            $ionicLoading.hide();
            $scope.saveImage(this.canvas.toDataURL("image/png"));
          });
        });
        break;
      case "glowingSun":      
        Caman("#filtercanvas", $scope.post_image, function () {
          this.revert(false);
          this.resize({
            width: 340,
            height: 340
          });
          this.glowingSun().render(function(){ 
            $ionicLoading.hide();
            $scope.saveImage(this.canvas.toDataURL("image/png"));
          });
        });
        break;
      case "hazyDays":      
        Caman("#filtercanvas", $scope.post_image, function () {
          this.revert(false);
          this.resize({
            width: 340,
            height: 340
          });
          this.hazyDays().render(function(){ 
            $ionicLoading.hide();
            $scope.saveImage(this.canvas.toDataURL("image/png"));
          });
        });
        break;
      case "herMajesty":      
        Caman("#filtercanvas", $scope.post_image, function () {
          this.revert(false);
          this.resize({
            width: 340,
            height: 340
          });
          this.herMajesty().render(function(){ 
            $ionicLoading.hide();
            $scope.saveImage(this.canvas.toDataURL("image/png"));
          });
        });
        break;
      case "nostalgia":      
        Caman("#filtercanvas", $scope.post_image, function () {
          this.revert(false);
          this.resize({
            width: 340,
            height: 340
          });
          this.nostalgia().render(function(){ 
            $ionicLoading.hide();
            $scope.saveImage(this.canvas.toDataURL("image/png"));
          });
        });
        break;
      case "hemingway":      
        Caman("#filtercanvas", $scope.post_image, function () {
          this.revert(false);
          this.resize({
            width: 340,
            height: 340
          });
          this.hemingway().render(function(){ 
            $ionicLoading.hide();
            $scope.saveImage(this.canvas.toDataURL("image/png"));
          });
        });
        break;
      case "concentrate":      
        Caman("#filtercanvas", $scope.post_image, function () {
          this.revert(false);
          this.resize({
            width: 340,
            height: 340
          });
          this.concentrate().render(function(){ 
            $ionicLoading.hide();
            $scope.saveImage(this.canvas.toDataURL("image/png"));
          });
        });
        break;
      default:      
        Caman("#filtercanvas", $scope.post_image, function () {
          this.revert(false);
          this.resize({
            width: 340,
            height: 340
          });
          $ionicLoading.hide();
          $scope.saveImage(this.canvas.toDataURL("image/png"));
        });
        break;      
    }
  }
})

.controller('ComposeModalCtrl', function($scope, $location, $ionicNavBarDelegate, $ionicScrollDelegate, $ionicLoading, $timeout, $foodieUtils, $ionicPopup, $ionicModal, $ionicSlideBoxDelegate, $rootScope, $jrCrop, Camera, Token, Posts) {
  $scope.image_string = "img/add_image.jpg";
  $scope.asdasd = "img/filter_thumbnails/thumb.jpg";
  $scope.qweqwe = "img/add_image.jpg";
  $scope.isChecked = false;
  $scope.toggleText = "Enable";
  $scope.latitude = null;  
  $scope.longitude = null;
  $scope.nearby_establishment = null;
  $scope.rating = 0;
  var map;
  var markers = [];











  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--=-=-=-=-=-=-=-=-=-=-=-=-=-=BLOGGING FUNCTIONS=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  $scope.getPhoto = function() {
      $foodieUtils.cameraActionSheet(function(index){
        if(index == 0)
        {
          Camera.takePicture().then(
            function(imageURI) {
              // $scope.createImage("data:image/jpeg;base64, " + imageURI);
              $scope.createImage(imageURI);
            }, 
            function(err) {
              console.err(err);
              alert(err);
            }
          );
        }
        else
        {
          Camera.fromLibrary().then(
            function(imageURI) {
              // $scope.createImage("data:image/jpeg;base64, " + imageURI);
              $scope.createImage(imageURI);
            }, 
            function(err) {
              console.err(err);
              alert(err);
            }
          );
        }
      });
    };

    $scope.postBlog = function(){
      $ionicLoading.show(); //show loader
      var new_item = {api_key: Token.api_key, foodict_ID: Token.foodict_ID, post_title: $scope.post_title,
      post_text: $scope.post_text, post_image: $scope.post_image, post_location_latitude: $scope.latitude,
      post_location_longitude: $scope.longitude, post_nearby_establishment: $scope.nearby_establishment, 
      post_rating: $scope.rating};

      // console.log(new_item);

      Posts.postNewBlog(null,new_item,
      function(successData){
        if(successData.isAuthorized == true)
          {
              $ionicLoading.hide();

              if(successData.result)
              {
                //clear canvas
                // var canvas = document.getElementById('postPhotoCanvas');
                // var context = canvas.getContext('2d');
                // context.clearRect(0, 0, canvas.width, canvas.height);
                $scope.post_title = null;
                $scope.post_text = null;
                $scope.post_image = null;
                $scope.latitude = null;  
                $scope.longitude = null;
                $scope.image_string = "img/add_image.jpg";
                $scope.isChecked = false;
                $scope.rating = 0;
                $scope.nearby_establishment = null;
                map = null;
                $scope.closeComposeModal();    
                $scope.$broadcast('refreshNewsfeed');            
                //$location.path('/tab/newsfeed').replace();
              }
              else
              {
                $foodieUtils.alert("Post unsuccessful","Unable to post the new blog.");
              }
            
            // $scope.comments = successData.result;
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



  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--=-=-=-=-=-=-=-=-=-=-=-=-=-=GEOLOCATION FUNCTIONS=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

    $scope.toggleLocation = function(){
      $scope.isChecked = !$scope.isChecked;
      if($scope.isChecked)
        {
            $scope.openPlaces();
        }
      else
        {           
            $scope.latitude = null;  
            $scope.longitude = null;
            $scope.nearby_establishment = null;
        }
    }


    $scope.openPlaces = function() {   
      $scope.modal.show();
      $ionicLoading.show(); 
      navigator.geolocation.getCurrentPosition($scope.GeolocationSuccess, $scope.GeolocationError, { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true });
    };

    $scope.GeolocationSuccess = function(position) {  
      $scope.latitude = position.coords.latitude;  
      $scope.longitude = position.coords.longitude;
      $timeout(function(){       
        //first unaltered map
        try
        {
          map = new google.maps.Map(document.getElementById("placesmap"), {
            center: new google.maps.LatLng($scope.latitude, $scope.longitude),
            zoom: 15
          });            
          $timeout(function(){
            $scope.chooseLocation();  
          }, 1000); 
        }
        catch(err)
        {
          $ionicLoading.hide(); 
          $foodieUtils.alert("Location services","Unable to retrieve your location." + error);
        } 

      }, 1000);    
    };

    $scope.GeolocationError = function(error) {
        $ionicLoading.hide();
        $foodieUtils.alert("Location services","Unable to retrieve your location." + error);
    }


    $scope.cancelPlaces = function(){
      $scope.modal.hide();
      $scope.toggleLocation();
    }
    $scope.closePlaces = function() {
      if(markers.length != 0)
      {
        $scope.modal.hide();
      }
      else
      {
        $foodieUtils.warning("No establishment selected","Please choose an establishment first");
      }
    };

    

    $scope.chooseLocation = function(){  
      $ionicLoading.hide();  
      try
      {      
          //request for nearby places
          var request = {
            location: new google.maps.LatLng($scope.latitude, $scope.longitude),
            radius: 500,
            types: ['store', 'bakery', 'bar', 'cafe', 'food', 'restaurant', 'shopping_mall', 'university']
          };
          var service = new google.maps.places.PlacesService(map);
          service.nearbySearch(request, function(results, status){
            if (status == google.maps.places.PlacesServiceStatus.OK) {
              $scope.allNearPlaces = results;
            }
            else{
              $foodieUtils.alert("Location services","We can't retrieve near establishment");
            }
          });
      }
      catch(err)
      {
        $foodieUtils.alert("Location services","We can't retrieve near establishment. " + err);
      }
    }

  
    $scope.chooseThis = function(place) {
      if(place != null)
      {        
        $scope.nearby_establishment = place.name;
        $scope.latitude = place.geometry.location.lat();
        $scope.longitude = place.geometry.location.lng();
        var marker = new google.maps.Marker({position:new google.maps.LatLng($scope.latitude, $scope.longitude)});        
        $scope.addOrReplaceMarker(marker);
      }
      else
      {
        $scope.nearby_establishment = null;
      }
    };  

    $scope.addOrReplaceMarker = function(itm){
      if(markers.length == 0)
      {
        markers.push(itm);
        itm.setMap(map);        
      } 
      else
      {
        markers[markers.length - 1].setMap(null);
        markers.push(itm);
        itm.setMap(map);
      }   
    }

    $scope.getHeight = function(id){      
      console.log(document.getElementById(id).offsetHeight);
      return document.getElementById(id).offsetHeight;
    }

    $scope.rateIt = function(val){
      $scope.rating = val;
    }

    $scope.saveImage = function(imageData){
      $scope.image_string = imageData;
      $scope.post_image = imageData;
    }

    $scope.createImage = function(file_uri){
      var photoCanvas = document.getElementById('postPhotoCanvas');
      $jrCrop.crop({
          url: file_uri,
          width: 320,
          height: 320,
          title: 'Crop image'         
      }).then(function(canvas) {
          // success!
          $scope.image_string = canvas.toDataURL("image/png");
          $scope.post_image = canvas.toDataURL("image/png");
          $("#filtercanvas").removeAttr("data-caman-id");
          $ionicLoading.show();
          $scope.imagefiltermodal.show().then(function(){
            Caman("#filtercanvas", $scope.post_image, function () {
              this.revert(false);              
              this.resize({
                width: 340,
                height: 340
              });
              $ionicLoading.hide();
              $scope.saveImage(this.canvas.toDataURL("image/png"));
            });
          });
      }, function() {
          // User canceled or couldn't load image.
          $foodieUtils.alert("No image uploaded");
      });
    }



    $ionicModal.fromTemplateUrl('templates/modal/modal-places.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });

    $ionicModal.fromTemplateUrl('templates/modal/modal-filters.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.imagefiltermodal = modal;
    });

    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.modal.remove();
      $scope.imagefiltermodal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
      // Execute action
    }); 


    // $scope.searchPlaces = function(){
    //   alert(document.getElementById('searchFilter').value);

    // }
//=-=-=-=-=-=-=-=-=-=--=--=-=-=-=-=-=-=  SLIDEBOX FUNCTIONS  =-=-=--=--=-=--=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
$scope.toggleSlide = function(value){  
  $ionicSlideBoxDelegate.enableSlide(value);
}

$scope.nextSlide = function(){  
  $ionicSlideBoxDelegate.next();
}

$scope.previousSlide = function(){  
  $ionicSlideBoxDelegate.previous();
}

$scope.slideIs = function(num){  
  if($ionicSlideBoxDelegate.currentIndex() == num)
  {
    return true;
  }
  return false;
}

$scope.scrollUp = function(){
  $ionicScrollDelegate.scrollTop();
}





//=-=-=-=-=-=-=-=-=-=--=--=-=-=-=-=-=-=  ONLOAD  =-=-=--=--=-=--=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-



})


















.controller('LoadingCtrl', function($scope, $ionicLoading) {
  $scope.show = function() {
    $ionicLoading.show();
  };
  $scope.hide = function(){
    $ionicLoading.hide();
  };
})

.controller('FooducerTabsCtrl', function($scope, $interval, Token, Notification) {

  $scope.RestrictedFor = function(type)
  {
    if(Token.user_type == type)
      {
        return true;
      }
    else
      {
        return false;
      }
  }
});


