angular.module('foodie.services', ['ngResource'])

.service('FoodieConfig', function($rootScope) {
  this.establishConnection = function(url){
    $rootScope.ApiUrl = url;
  }
})

.service('Token', function($rootScope) {

  //token variables
  this.api_key = null;
  this.user_ID = null;
  this.foodict_ID = null;
  this.fooducer_ID = null;
  this.administrator_ID = null;
  this.user_type = null;
  this.ApiUrl = null;

  //establish a new connection
  this.establishConnection = function(url){
    this.ApiUrl = url;
    $rootScope.ApiUrl = url;    
    $rootScope.domain_url = url.replace(/\\/gi, '');
  }

  //create a new token
  this.establishFoodictToken = function(api_key, user_ID, foodict_ID, user_type) {
    this.api_key = api_key;
    this.user_ID = user_ID;
    this.foodict_ID = foodict_ID;
    this.user_type = user_type;
  }

  this.establishFooducerToken = function(api_key, user_ID, fooducer_ID, user_type) {
    this.api_key = api_key;
    this.user_ID = user_ID;
    this.fooducer_ID = fooducer_ID;
    this.user_type = user_type;
  }

  this.establishAdministratorToken = function(api_key, user_ID, administrator_ID, user_type) {
    this.api_key = api_key;
    this.user_ID = user_ID;
    this.administrator_ID = administrator_ID;
    this.user_type = user_type;
  }

  //clear token values
  this.destroyToken = function(){
    this.api_key = null;
    this.user_ID = null;
    this.foodict_ID = null;
    this.fooducer_ID = null;
    this.user_type = null;
  }

  // this.addNotification = function(){
  //   if(parseInt(window.localStorage.getItem("notifications")) >= 0)
  //   {
  //     window.localStorage.setItem("notifications", (parseInt(window.localStorage.getItem("notifications")) + 1));
  //     alert(window.localStorage.getItem("notifications"));
  //   }
  //   else
  //   {
  //       window.localStorage.setItem("notifications",0);
  //       alert(window.localStorage.getItem("notifications"));
  //   }
  // }

  // this.clearNotification = function(){
  //   window.localStorage.setItem("notifications",0);
  // }

})

.service('CacheImages', function($q){
    return {
        checkCacheStatus : function(src){
            var deferred = $q.defer();
            ImgCache.isCached(src, function(path, success) {
                if (success) {
                    deferred.resolve(path);
                } else {
                    ImgCache.cacheFile(src, function() {
                        ImgCache.isCached(src, function(path, success) {
                            deferred.resolve(path);
                        }, deferred.reject);
                    }, deferred.reject);
                }
            }, deferred.reject);
            return deferred.promise;
        }
    };
})



.factory('$foodieUtils', function($ionicPopup, $ionicActionSheet, $timeout) {
  var $foodieUtils =
  {
    alert : foodieAlert,
    warning : foodieWarning,
    confirm : foodieConfirm,
    inputPopup: foodieInputPopup,
    yesno : foodieYesNo,
    cameraActionSheet : foodieActionSheet,    
    unfollowActionSheet : foodieUnfollowActionSheet,
    profileActionSheet : foodieProfileActionSheet,
    fooducerProfileActionSheet : fooducerActionSheet,
    profilePicAlert : foodieProfilePicAlert,
    errorCatcher : foodieErrorCatcher 
  }

  return $foodieUtils;

  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=FUNCTIONS=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

  function foodieAlert(foodiePopupTitle,foodiePopupText, callbackFunction) {

      var customPopup = $ionicPopup.show({
       template: '<center>'+foodiePopupText+'</center>',
       title: '<b class="popup-dark">'+foodiePopupTitle+'</b>',
       buttons: [
         {
           text: 'Close',
           type: 'button-light',
           onTap: function(e) {
           }
         }
       ]
      });
      customPopup.then(callbackFunction);
  }

  function foodieWarning(foodiePopupTitle,foodiePopupText, callbackFunction) {

      var customPopup = $ionicPopup.show({
       template: '<center>'+foodiePopupText+'</center>',
       title: '<b class="popup-assertive">'+foodiePopupTitle+'</b>',
       buttons: [
         {
           text: 'Close',
           type: 'button-light',
           onTap: function(e) {
           }
         }
       ]
      });
      customPopup.then(callbackFunction);
  }
 

 function foodieInputPopup(foodiePopupTitle, foodiePopupSubtitle, callbackFunction) {

      var result;
      var customPopup = $ionicPopup.show({
       template: '<input type="text" ng-model="data.input">',
       title: '<b class="foodie-assertive">'+foodiePopupTitle+'</b>',
       subTitle: '<p>' + foodiePopupSubtitle + '</p>',
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
              if (!$scope.data.input) {
                e.preventDefault();
              } else {
                result =  $scope.data.input;
              }
           }
         }
       ]
      });

      customPopup.then(function(){
        callbackFunction(result);
      });
  }

  function foodieConfirm(foodiePopupTitle,foodiePopupText, callbackFunction) {

      var result;
      var customPopup = $ionicPopup.show({
       template: '<center>'+foodiePopupText+'</center>',
       title: '<b>'+foodiePopupTitle+'</b>',
       buttons: [
         {
           text: 'Cancel',
           type: 'button-light',
           onTap: function(e) {
              result = false;
           }
         },
         {
           text: 'OK',
           type: 'button-assertive foodie-button-assertive',
           onTap: function(e) {
              result = true;
           }
         }
       ]
      });
      customPopup.then(function(){
        callbackFunction(result);
      });
  }

  function foodieYesNo(foodiePopupTitle,foodiePopupText, callbackFunction) {

      var result;
      var customPopup = $ionicPopup.show({
       template: '<center>'+foodiePopupText+'</center>',
       title: '<b>'+foodiePopupTitle+'</b>',
       buttons: [
         {
           text: 'No',
           type: 'button-light',
           onTap: function(e) {
              result = false;
           }
         },
         {
           text: 'Yes',
           type: 'button-assertive foodie-button-assertive',
           onTap: function(e) {
              result = true;
           }
         }
       ]
      });
      customPopup.then(function(){
        callbackFunction(result);
      });
  }

  function foodieProfilePicAlert(callbackFunction) {

      var result;
      var customPopup = $ionicPopup.show({
       template: '<center><canvas id="profPicCanvas" width="160" height="160" class="profpic-canvas"></canvas> </center>',
       title: '<b>Use this as your profile picture?</b>',
       buttons: [
         {
           text: 'No',
           type: 'button-light',
           onTap: function(e) {
              result = false;
           }
         },
         {
           text: 'Yes',
           type: 'button-assertive foodie-button-assertive',
           onTap: function(e) {
              result = true;
           }
         }
       ]
      });
      customPopup.then(function(){
        callbackFunction(result);
      });
  }

  

  function foodieErrorCatcher(errorCode) {
      if(errorCode >= 300 && errorCode <= 499)
      {
          this.warning("Spoiled Food!","Sorry for this error. Don't Ya worry coz the bug report is sent to the administrator. We'll be working for this!",function(){
            //irereport sa server ung bug
          });
      }
      else if(errorCode >= 500 && errorCode <= 599)
      {
          this.warning("Bad plating!","An error has occured. We'll be fixing this bug soon! Thanks for using Foodie!",function(){
            //irereport sa server ung bug
          });
      }      
      else if(errorCode == 0)
      {
          this.warning("Food still uncooked!","Foodie cannot connect to the service.",function(){
            //irereport sa server ung bug
          });
      }
      else
      {
          this.warning("Not in my recipe book!","An error has occured and this is unexpected! Gotta research for it. Thanks fella!",function(){
              //irereport sa server ung bug
          });
      }
  }

  function foodieActionSheet(callbackFunction) {

    var hideSheet = $ionicActionSheet.show({
      buttons: [
        { text: '<span class="foodie-assertive"><i class="icon ion-camera"></i> Take a photo</span>' },
        { text: '<span class="foodie-assertive"><i class="icon ion-images"></i> Photo Gallery</span>' }
      ],    
      titleText: 'Choose photo source',
      cancelText: '<span class="foodie-dark">Cancel</span>',
      cancel: function() {
        return true;
      },
      buttonClicked: function(index) {
        callbackFunction(index);
        return true;
      }
    });

    $timeout(function() {
      hideSheet();
    }, 10000);
  }

  function foodieUnfollowActionSheet(foodictName, text, actionFunction) {
    var unfollowSheet = $ionicActionSheet.show({
      buttons: [
        { text: '<span class="foodie-assertive">'+text+'</span>' }
      ],    
      titleText: foodictName,
      cancelText: '<span class="foodie-dark">Cancel</span>',
      cancel: function() {
        return true;
      },
      buttonClicked: function(index) {
        actionFunction();
        return true;
      }
    });

    $timeout(function() {
      unfollowSheet();
    }, 10000);
  }

  function foodieProfileActionSheet(actionFunction) {
    var profileSheet = $ionicActionSheet.show({
      buttons: [
        { text: '<span>Edit Profile</span>' },
        { text: '<span>My Coupons</span>' },
        { text: '<span>Account Settings</span>' },
        { text: '<span class="foodie-assertive">Logout</span>' }
      ],    
      cancelText: '<span class="foodie-dark">Cancel</span>',
      cancel: function() {
        return true;
      },
      buttonClicked: function(index) {
        actionFunction(index);
        return true;
      }
    });

    $timeout(function() {
      profileSheet();
    }, 10000);
  }



  function fooducerActionSheet(actionFunction) {
    var fooducerProfileSheet = $ionicActionSheet.show({
      buttons: [
        { text: '<span>Edit Profile</span>' },
        { text: '<span>Account Settings</span>' },
        { text: '<span class="foodie-assertive">Logout</span>' }
      ],    
      cancelText: '<span class="foodie-dark">Cancel</span>',
      cancel: function() {
        return true;
      },
      buttonClicked: function(index) {
        actionFunction(index);
        return true;
      }
    });

    $timeout(function() {
      fooducerProfileSheet();
    }, 10000);
  }
})

.service('Login', function($resource, $rootScope) {
  return $resource($rootScope.ApiUrl + 'login', null,
  {
    'loginViaFB' : {method: 'GET'},
    'LoginMyAccount' : {method: 'POST'},    
    'forgotPassword' : {method: 'PUT'}
  });
})
.service('Posts', function($resource, $rootScope) {
  return $resource($rootScope.ApiUrl + 'post', null,
  {
    'postNewBlog' : {method: 'POST'}
  });
})
.service('Newsfeed', function($resource, $rootScope) {
  return $resource($rootScope.ApiUrl + 'newsfeed', null,
  {
    'viewMyNewsfeed' : {method: 'GET'},
    'viewThisPost' : {method: 'POST'},
    'biteThisPost' : {method: 'PUT'},
    'deleteThisPost' : {method: 'DELETE'}
  });
})
.service('Comments', function($resource, $rootScope) {
  return $resource($rootScope.ApiUrl + 'comment', null,
  {
    'viewCommentsForThisPost' : {method: 'GET'},
    'addNewComment' : {method: 'POST'},
    'deleteThisComment' : {method: 'DELETE'}
  });
})
.service('Profile', function($resource, $rootScope) {
  return $resource($rootScope.ApiUrl + 'profile', null,
  {
    'getMyProfileDetails' : {method: 'GET'},  
    'getGridPosts' : {method: 'POST'},
    'editMyProfileDetails' : {method: 'PUT'}
  });
})
.service('Follow', function($resource, $rootScope) {
  return $resource($rootScope.ApiUrl + 'follow', null,
  {   
    'followThisFoodict' : {method: 'POST'},  
    'unfollowThisFoodict' : {method: 'DELETE'},
    'actionOnThisRequest' : {method: 'PUT'}
  });
})
.service('Follower', function($resource, $rootScope) {
  return $resource($rootScope.ApiUrl + 'follower', null,
  {
    'getMyFollower' : {method: 'GET'}
  });
})
.service('Following', function($resource, $rootScope) {
  return $resource($rootScope.ApiUrl + 'following', null,
  {
    'getMyFollowing' : {method: 'GET'}
  });
})
.service('Account', function($resource, $rootScope) {
  return $resource($rootScope.ApiUrl + 'account', null,
  {
    'getAccountDetails' : {method: 'POST'},
    'updateAccountDetails' : {method: 'PUT'}
  });
})
.service('OtherProfile', function($resource, $rootScope) {
  return $resource($rootScope.ApiUrl + 'otherprofile', null,
  {
    'Details' : {method: 'GET'}
  });
})
.service('OtherFollower', function($resource, $rootScope) {
  return $resource($rootScope.ApiUrl + 'otherfollower', null,
  {
    'getMyFollower' : {method: 'GET'}
  });
})
.service('OtherFollowing', function($resource, $rootScope) {
  return $resource($rootScope.ApiUrl + 'otherfollowing', null,
  {
    'getMyFollowing' : {method: 'GET'}
  });
})
.service('Notification', function($resource, $rootScope) {
  return $resource($rootScope.ApiUrl + 'notification', null,
  {
    'countMyNotifications' : {method: 'GET'},  
    'getMyNotifications' : {method: 'POST'},   
    'markDone' : {method: 'PUT'},   
    'deleteThis' : {method: 'DELETE'}
  });
})
.service('Offer', function($resource, $rootScope) {
  return $resource($rootScope.ApiUrl + 'offer', null,
  {
    'getOffer' : {method: 'GET'},    
    'getUpdates' : {method: 'GET'},    
    'availVoucher' : {method: 'POST'}
  });
})
.service('Voucher', function($resource, $rootScope) {
  return $resource($rootScope.ApiUrl + 'voucher', null,
  {
    'getMyVouchers' : {method: 'GET'},
    'deleteVoucher' : {method: 'DELETE'}
  });
})
.service('Dashboard', function($resource, $rootScope) {
  return $resource($rootScope.ApiUrl + 'dashboard', null,
  {
    'getMyDashboard' : {method: 'GET'}
  });
})
.service('Search', function($resource, $rootScope) {
  return $resource($rootScope.ApiUrl + 'search', null,
  {
    'searchForThis' : {method: 'GET'}
  });
})
.service('Report', function($resource, $rootScope) {
  return $resource($rootScope.ApiUrl + 'report', null,
  {
    'reportThis' : {method: 'POST'},
    'deleteReport' : {method: 'DELETE'}
  });
})
.service('Signup', function($resource, $rootScope) {
  return $resource($rootScope.ApiUrl + 'signup', null,
  {
    'checkExistUsername' : {method: 'GET'},    
    'signItUp' : {method: 'POST'}
  });
})
.service('Suggest', function($resource, $rootScope) {
  return $resource($rootScope.ApiUrl + 'suggest', null,
  {
    'suggestFollow' : {method: 'POST'}
  });
})
.service('PostDetail', function($resource, $rootScope) {
  return $resource($rootScope.ApiUrl + 'postdetail', null,
  {
    'getFoodicts' : {method: 'GET'}
  });
})
.service('Promote', function($resource, $rootScope) {
  return $resource($rootScope.ApiUrl + 'promote', null,
  {
    'getMyPromotion' : {method: 'GET'},    
    'postPromotion' : {method: 'POST'},    
    'endPromotion' : {method: 'PUT'}

  });
})
.service('FooducerProfile', function($resource, $rootScope) {
  return $resource($rootScope.ApiUrl + 'fooducerprofile', null,
  {
    'getProfile' : {method: 'GET'},    
    'editProfile' : {method: 'PUT'}
  });
})
.service('FooducerAccount', function($resource, $rootScope) {
  return $resource($rootScope.ApiUrl + 'fooduceraccount', null,
  {
    'getAccountDetails' : {method: 'POST'},
    'updateAccountDetails' : {method: 'PUT'}
  });
})
.service('Validate', function($resource, $rootScope) {
  return $resource($rootScope.ApiUrl + 'validate', null,
  {
    'getValidateTiles' : {method: 'GET'},
    'getValidatePromo' : {method: 'POST'},
    'scanCode' : {method: 'PUT'}
  });
})
.service('Archive', function($resource, $rootScope) {
  return $resource($rootScope.ApiUrl + 'archive', null,
  {
    'getMyArchives' : {method: 'GET'},
    'getArchiveDetails' : {method: 'POST'}
  });
})
.service('Spam', function($resource, $rootScope) {
  return $resource($rootScope.ApiUrl + 'spam', null,
  {
    'getSpams' : {method: 'GET'},
    'getSpamDetails' : {method: 'POST'},
    'penalize' : {method: 'PUT'},
    'deleteThis' : {method: 'DELETE'}
  });
})
.service('Inappropriate', function($resource, $rootScope) {
  return $resource($rootScope.ApiUrl + 'inappropriate', null,
  {
    'getInappropriate' : {method: 'GET'},
    'getInappropriateDetails' : {method: 'POST'},
    'penalize' : {method: 'PUT'},
    'deleteThis' : {method: 'DELETE'}
  });
})
.service('Offensive', function($resource, $rootScope) {
  return $resource($rootScope.ApiUrl + 'offensive', null,
  {
    'getOffensive' : {method: 'GET'},
    'getOffensiveDetails' : {method: 'POST'},
    'penalize' : {method: 'PUT'},
    'deleteThis' : {method: 'DELETE'}
  });
});



































//var posts = [{"post_ID":2,"post_text":"Very sumptuous!","post_image":"f7010f66fc3a441cb1e8bafcc2846f83.jpg","user_ID":1,"user_name":"Carlo Colubio","user_pic":"1623743_729576150396168_1398607722_n.jpg"},{"post_ID":3,"post_text":"Thanks for this Foodie!","post_image":"6084140452814e5f923cd740af2a1b3e.jpg","user_ID":1,"user_name":"Carlo Colubio","user_pic":"1623743_729576150396168_1398607722_n.jpg"},{"post_ID":4,"post_text":"Savory food! :)","post_image":"25196c77eb1445a6b549a6a3c1ea9ec2.jpg","user_ID":1,"user_name":"Carlo Colubio","user_pic":"1623743_729576150396168_1398607722_n.jpg"},{"post_ID":5,"post_text":"I love this job!","post_image":"bb35fbd69dec4e0fa8bc56fb9ac6e0da.jpg","user_ID":1,"user_name":"Carlo Colubio","user_pic":"1623743_729576150396168_1398607722_n.jpg"}]
  //var posts = [];
  //posts = [{"post_ID":2,"post_text":"Very sumptuous!","post_image":"f7010f66fc3a441cb1e8bafcc2846f83.jpg","user_ID":1,"user_name":"Carlo Colubio","user_pic":"1623743_729576150396168_1398607722_n.jpg"},{"post_ID":3,"post_text":"Thanks for this Foodie!","post_image":"6084140452814e5f923cd740af2a1b3e.jpg","user_ID":1,"user_name":"Carlo Colubio","user_pic":"1623743_729576150396168_1398607722_n.jpg"},{"post_ID":4,"post_text":"Savory food! :)","post_image":"25196c77eb1445a6b549a6a3c1ea9ec2.jpg","user_ID":1,"user_name":"Carlo Colubio","user_pic":"1623743_729576150396168_1398607722_n.jpg"},{"post_ID":5,"post_text":"I love this job!","post_image":"bb35fbd69dec4e0fa8bc56fb9ac6e0da.jpg","user_ID":1,"user_name":"Carlo Colubio","user_pic":"1623743_729576150396168_1398607722_n.jpg"}];
  //posts.push({"post_ID":2,"post_text":"Very sumptuous!","post_image":"f7010f66fc3a441cb1e8bafcc2846f83.jpg","user_ID":1,"user_name":"Carlo Colubio","user_pic":"1623743_729576150396168_1398607722_n.jpg"});
  /*
  $http.get('http://10.0.3.2:11897/JSON/ViewPosts')
    .success(function(data){
      posts = data;
    })
    .error(function(data, status, headers, config) {
      alert("Please connect to the internet;");
      posts = null;
    });

  return {
    all: function() {
      return posts;
    },
    get: function(post_ID) {
      // Simple index lookup
      return posts[post_ID];
    }
  }*/

  //10.0.3.2
  //192.168.56.1
