angular.module('foodie.controllers.newsfeed', ['foodie.services', 'foodie.plugins'])

.controller('NewsfeedCtrl', function($scope, $rootScope, $location, $ionicScrollDelegate, $ionicLoading, $foodieUtils, $ionicPopover, $ionicModal, Newsfeed, Token, $cordovaFacebook, $rootScope, Suggest) {
  $scope.canLoadMore = true;
  $scope.newsfeedPosts = null;
  //Broadcasted Refresh
  $scope.$on('refreshNewsfeed', function() { 
    $scope.refreshPlates();
  });

  $scope.foodiePostWidth = $rootScope.foodiePostHeight;
  $scope.foodiePostHeight = $rootScope.foodiePostHeight;
  $scope.getNewsfeed = function() {
    $scope.isLoading = true;
    Newsfeed.viewMyNewsfeed({api_key: Token.api_key},
    function(successData){        
        $scope.isLoading = false;
        if(successData.isAuthorized == true)
          {
            $scope.newsfeedPosts = successData.result;
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
      function(error) {
          $ionicLoading.hide();
          $foodieUtils.errorCatcher(error.status);
      });  
  }


  $scope.biteThisPost = function(p){
    if(!p.isBitten)
    {
      //pwedeng iBITE
      p.isBitten = true;
      Newsfeed.biteThisPost(null,{api_key: Token.api_key, post_ID: p.post_ID, bite_source_foodict_ID: Token.foodict_ID, foodict_ID: p.foodict_ID},
      function(successData){
        if(successData.isAuthorized == true)
            {
              p.isBitten = successData.result;
            }
          else
            {
              $foodieUtils.confirm("Expired Account","To continue using Foodie, please re-login your account. Re-login now?",function(res){
                if (res){
                  //true
                  window.localStorage.clear();
                $location.path('/login').replace();
                }
              });
            }
      },
      function(error){
          $foodieUtils.errorCatcher(error.status);
      });
    }    
  }

  $scope.loadMore = function(lastPostID){    
    $scope.isLoading = true;
    Newsfeed.viewMyNewsfeed({api_key: Token.api_key, last_post_ID: lastPostID},
    function(successData){
        $scope.isLoading = false;
        if(successData.isAuthorized == true)
          { 
            $scope.newsfeedPosts = $scope.newsfeedPosts.concat(successData.result);
            $scope.$broadcast('scroll.infiniteScrollComplete');
            if(successData.result.length < 10)
            {
              $scope.canLoadMore = false;
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
      function(error) {
        $scope.isLoading = false;
        $foodieUtils.errorCatcher(error.status);
      });
  }

  $scope.refreshPlates = function(){
    $scope.getNewsfeed();
    $ionicScrollDelegate.scrollTop();
    $scope.$broadcast('scroll.refreshComplete');
  }

  $scope.openProfile = function(foodict_ID){
      if(Token.foodict_ID == foodict_ID)
      {
        $location.path('/tab/newsfeed/home/profile').replace();
      }
      else
      {        
        $location.path('/tab/newsfeed/otherprofile/' + foodict_ID).replace();
      }
  }

  $scope.isMyPost = function(item){
    if(Token.foodict_ID == item.foodict_ID)
    {
        return true;
    }
    else
    {
        return false;
    }
  }




  //POPOVER

  $ionicPopover.fromTemplateUrl('templates/popover/popover-newsfeed.html', {
    scope: $scope,
  }).then(function(popover) {
    $scope.popover = popover;
  });
  $scope.openPopover = function($event, post) {
    $scope.focusedItem = post;    
    $scope.focusedItemIndex = $scope.newsfeedPosts.indexOf(post);
    $scope.popover.show($event);
  };
  $scope.closePopover = function() {
    $scope.popover.hide();
  };
  //Cleanup the popover when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.popover.remove();
  });
  // Execute action on hide popover
  $scope.$on('popover.hidden', function() {
    // Execute action
  });
  // Execute action on remove popover
  $scope.$on('popover.removed', function() {
    // Execute action
  });

  //Retrieve newsfeed if the data is null
  if($scope.newsfeedPosts == null || $scope.newsfeedPosts == [])
  {
    $scope.getNewsfeed();
  }


  //Modal
    $ionicModal.fromTemplateUrl('templates/modal/modal-report.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modalReport = modal;
    });
    $scope.openModalReport = function() {    
      $scope.modalReport.show();
    };
    $scope.closeModalReport = function() {
      $scope.modalReport.hide();    
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.modalReport.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
      // Execute action
    });

    $ionicModal.fromTemplateUrl('templates/modal/modal-map.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modalMap = modal;
    });
    $scope.openModalMap = function(latitude, longitude) {    
      $scope.modalMap.show();
      $scope.initializeMap(latitude, longitude);
    };
    $scope.closeModalMap = function() {
      $scope.modalMap.hide();    
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.modalMap.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
      // Execute action
    });

    $scope.initializeMap = function(latitude, longitude) {
      // latitude = parseFloat(latitude);
      // longitude = parseFloat(longitude);
      // alert(latitude +" - "+ longitude);

      $ionicLoading.show(); 
      try
      {
        var modalmapvar = new google.maps.Map(document.getElementById("mapmodal"), {
          center: new google.maps.LatLng(latitude, longitude),
          zoom: 15
        }); 
        var modalmarkervar = new google.maps.Marker({position:new google.maps.LatLng(latitude, longitude)});
        modalmarkervar.setMap(modalmapvar);
        // var detectedLocation = new google.maps.LatLng(latitude, longitude);
        // var mapOptions = {
        //     center: detectedLocation,
        //     zoom: 15,
        //     mapTypeId: google.maps.MapTypeId.ROADMAP
        // };
        // var modalMapVar = new google.maps.Map(document.getElementById("map"), mapOptions);
        // var modalMarkerVar = new google.maps.Marker({position:new google.maps.LatLng(latitude, longitude)});
        // marker.setMap(map); 
      }
      catch(err)
      {        
        $foodieUtils.alert("Unsuccessful request","Unable to fetch map data from the internet",function(){
          $scope.isMapShown = false;
        });
      }    
      $ionicLoading.hide();    
    }


  // $scope.openSuggestedModal = function() {  
  //   $scope.getFriends();    
  // };
  $ionicModal.fromTemplateUrl('templates/modal/modal-suggested.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
      $scope.suggestedmodal = modal;
  });

  

  $scope.closeSuggestedModal = function() {
    $scope.suggestedmodal.hide();     
  };

  $scope.getFriends = function(){
          if($rootScope.isFB)
          {
            $rootScope.isFB = false;
            $cordovaFacebook.api("me/friends?fields=name,picture", ["public_profile", "user_friends"])
            .then(function(success) {

                  //fb_object
                  var fbobj = [];
                  for(x = 0; x < success.data.length; x++)
                  {
                    fbobj.push({fbid: success.data[x].id, full_name: success.data[x].name});
                  }

                  Suggest.suggestFollow(null, {api_key: Token.api_key, foodict_ID: Token.foodict_ID, fbobjects: fbobj},
                    function(successData){      

                        if(successData.isAuthorized)
                          {
                            $scope.fb_friends = successData.result.fb_friends;
                            $scope.suggested = successData.result.suggested;

                            $scope.suggestedmodal.show();
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
                      function(error) {
                        alert(error.status);
                        $foodieUtils.errorCatcher(error.status);
                      });  
            }, 
            function (error) {
              $foodieUtils.alert("Facebook Error",error);
            }); 
          }
          else
          {
            var fbobj = [];
            Suggest.suggestFollow(null, {api_key: Token.api_key, foodict_ID: Token.foodict_ID, fbobjects: fbobj},
              function(successData){     
                  if(successData.isAuthorized)
                  {
                    $scope.fb_friends = successData.result.fb_friends;
                    $scope.suggested = successData.result.suggested;
                    $scope.suggestedmodal.show();
                  }
                  else
                  {
                    $foodieUtils.confirm("Expired Account","To continue using Foodie, please re-login your accounts. Re-login now?",function(res){
                    if (res){
                        //true
                        window.localStorage.clear();
                        $location.path('/login').replace();
                    }});
                  }    
              }, 
              function(error) {
                  alert(error.status);
                  $foodieUtils.errorCatcher(error.status);
              });  
          }          
  }

  $scope.intro = function(){
    if($rootScope.first_time == true){ 
        $rootScope.first_time = false;
        $scope.getFriends(); 
    }
  }

/*===================================== ONLOAD =====================================*/
//tutorials and intro
  
  $scope.intro();

  $scope.$broadcast('checkNoti');
   
})

.controller('NewsfeedPopoverCtrl', function($scope, $location, $foodieUtils, Newsfeed, Token) {
  $scope.reportEnabled = function(foodict_ID){
    if(parseInt(Token.foodict_ID) != parseInt(foodict_ID))
    {
      return true;
    }
    return false
  }
  $scope.deleteEnabled = function(foodict_ID){
    if(parseInt(Token.foodict_ID) == parseInt(foodict_ID))
    {
      return true;
    }
    return false
  }


  //ACTIONS
  $scope.reportThis = function(post){
    $scope.openModalReport();
    $scope.closePopover();  
  }
  $scope.deleteThis = function(post){
    $foodieUtils.confirm("Delete post","Do you really want to delete this post?",function(res){
      if (res){
          Newsfeed.deleteThisPost({api_key: Token.api_key, foodict_ID: Token.foodict_ID, post_ID: post.post_ID},
          function(successData){
            if(successData.isAuthorized == true)
              {
                if(successData.result)
                {
                  //deletion on UI
                  $foodieUtils.warning("Post Deleted","Your post was successfully deleted",function(){
                      $scope.newsfeedPosts.splice($scope.focusedItemIndex, 1);
                  });
                }
                else
                {
                  $foodieUtils.warning("Delete Unsuccessful","Deletion of Post failed.",function(){
                  });
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
          function(error) {
              $foodieUtils.errorCatcher(error.status);
          });
      }
    });    
    $scope.closePopover();
  }
  


  
})

.controller('PostDetailPopoverCtrl', function($scope, $location, $foodieUtils, $ionicModal, Newsfeed, Token) {
  $scope.reportEnabled = function(foodict_ID){
    if(parseInt(Token.foodict_ID) != parseInt(foodict_ID))
    {
      return true;
    }
    return false
  }
  $scope.deleteEnabled = function(foodict_ID){
    if(parseInt(Token.foodict_ID) == parseInt(foodict_ID))
    {
      return true;
    }
    return false
  }


  //ACTIONS
  $scope.reportThis = function(post){
    $scope.openModalReport();
    $scope.closePopover();  
  }
  $scope.deleteThis = function(post){
    $foodieUtils.confirm("Delete post","Do you really want to delete this post?",function(res){
      if (res){
          Newsfeed.deleteThisPost({api_key: Token.api_key, foodict_ID: Token.foodict_ID, post_ID: post.post_ID},
          function(successData){
            if(successData.isAuthorized == true)
              {
                if(successData.result)
                {
                  //deletion on UI
                  $foodieUtils.warning("Post Deleted","Your post was successfully deleted",function(){
                      $location.path('/tab/newsfeed').replace();
                  });
                }
                else
                {
                  $foodieUtils.warning("Delete Unsuccessful","Deletion of Post failed.",function(){
                  });
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
          function(error) {
              $foodieUtils.errorCatcher(error.status);
          });
      }
    });    
    $scope.closePopover();
  }

   $ionicModal.fromTemplateUrl('templates/modal/modal-report.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modalReport = modal;
    });
    $scope.openModalReport = function() {    
      $scope.modalReport.show();
    };
    $scope.closeModalReport = function() {
      $scope.modalReport.hide();    
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.modalReport.remove();
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
.controller('SuggestedModalCtrl', function($scope, $location, $foodieUtils, $ionicLoading, $ionicSlideBoxDelegate, Token, Follow, $cordovaFacebook) {
  $scope.followThis = function(foodict, isFB){
    Follow.followThisFoodict({api_key: Token.api_key, source_foodict_ID: Token.foodict_ID, target_foodict_ID: foodict.foodict_ID},
    function(successData) {
      if(successData.isAuthorized == true)
        {
          if(isFB)
          {
            $scope.fb_friends.splice($scope.fb_friends.indexOf(foodict), 1);
          }
          else
          {
            $scope.suggested.splice($scope.suggested.indexOf(foodict), 1);            
          }

          //close modal
          if($scope.fb_friends.length == 0 && $scope.suggested.length == 0)
          {
            $foodieUtils.warning("You're all set!","You can now start your food adventure!",function(){
              $scope.closeSuggestedModal();              
            });
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
    function(error) {
      $foodieUtils.errorCatcher(error.status);
    });
  }
})


.controller('PostDetailCtrl', function($scope, $location, $stateParams, $foodieUtils, $ionicScrollDelegate, $ionicPopover, $ionicModal, $timeout, Newsfeed, Token) {

    $scope.isMapShown = false;
    $scope.newsfeedPosts = [];
    $scope.isBlogDetail = true;
    var postLocationMap = null;

    Newsfeed.viewThisPost(null,{api_key: Token.api_key, foodict_ID: Token.foodict_ID , post_ID: $stateParams.post_ID},
    function(successData){
        if(successData.isAuthorized == true)
          {
            $scope.newsfeedPosts = successData.result;

            //replace YOU
            for (x = 0; x <= $scope.newsfeedPosts.bites.length; x++)
            {
              if($scope.newsfeedPosts.bites[x].foodict_ID == Token.foodict_ID)
              {
                var me = {foodict_ID: Token.foodict_ID, foodict_username: "You"};
                $scope.newsfeedPosts.bites.splice(x, 1);
                $scope.newsfeedPosts.bites.splice(0, 0, me);
              }
            }
            $scope.hasLocation = successData.hasLocation;
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
      function(error) {
          $foodieUtils.errorCatcher(error.status);
      });

    // $scope.initializeMap = function(latitude, longitude) {
    //   alert(latitude +"  -  "+ longitude);
    //   try
    //   {
    //     var detectedLocation = new google.maps.LatLng(latitude, longitude);
    //     var mapOptions = {
    //         center: detectedLocation,
    //         zoom: 15,
    //         mapTypeId: google.maps.MapTypeId.ROADMAP
    //     };
    //     var map = new google.maps.Map(document.getElementById("postdetailmap"), mapOptions);
    //     var marker = new google.maps.Marker({position:new google.maps.LatLng(latitude, longitude)});
    //     marker.setMap(map); 
    //   }
    //   catch(err)
    //   {
    //     $foodieUtils.alert("Unsuccessful request","Unable to fetch map data from the internet" + err,function(){
    //       $scope.isMapShown = false;
    //     });
    //   }     
    // }

     $scope.initializeMap = function(latitude, longitude) {
      // latitude = parseFloat(latitude);
      // longitude = parseFloat(longitude);
      try
      {
        postLocationMap = new google.maps.Map(document.getElementById("postdetailmap"), {
          center: new google.maps.LatLng(latitude, longitude),
          zoom: 16
        }); 
        var pin = new google.maps.Marker({position:new google.maps.LatLng(latitude, longitude)});
        pin.setMap(postLocationMap);
        // var detectedLocation = new google.maps.LatLng(latitude, longitude);
        // var mapOptions = {
        //     center: detectedLocation,
        //     zoom: 15,
        //     mapTypeId: google.maps.MapTypeId.ROADMAP
        // };
        // var modalMapVar = new google.maps.Map(document.getElementById("map"), mapOptions);
        // var modalMarkerVar = new google.maps.Marker({position:new google.maps.LatLng(latitude, longitude)});
        // marker.setMap(map); 
      }
      catch(err)
      {        
        $foodieUtils.alert("Unsuccessful request","Unable to fetch map data from the internet" + err,function(){
          $scope.isMapShown = false;
        });
      }    
      $ionicLoading.hide();    
    }

    $scope.addMarker = function(location){
      var marker = new google.maps.Marker({
        position: location,
        map: map,
      });
    }

    $scope.loadMap = function(){
      if(postLocationMap == null){        
        $timeout(function(){$scope.showLocation();}, 1000);        
      }
    }

    $scope.showLocation = function(){
      $scope.initializeMap($scope.newsfeedPosts.post_location_latitude,$scope.newsfeedPosts.post_location_longitude);   
    }

    $scope.biteThisPost = function(p){
      if(!p.isBitten)
      {
        //pwedeng iBITE
        p.isBitten = true;
        Newsfeed.biteThisPost(null,{api_key: Token.api_key, post_ID: p.post_ID, bite_source_foodict_ID: Token.foodict_ID, foodict_ID: p.foodict_ID},
        function(successData){
          if(successData.isAuthorized == true)
              {
                p.isBitten = successData.result;
                if(successData.result){
                  var me = {foodict_ID: Token.foodict_ID, foodict_username: "You"};
                  $scope.newsfeedPosts.bites.splice(0, 0, me);
                }
              }
            else
              {
                $foodieUtils.confirm("Expired Account","To continue using Foodie, please re-login your account. Re-login now?",function(res){
                  if (res){
                    //true
                    window.localStorage.clear();
                  $location.path('/login').replace();
                  }
                });
              }
        },
        function(error){
            $foodieUtils.errorCatcher(error.status);
        });
      }    
    }

    $scope.gotoState = function(val){
      $location.path(val).replace();
    }

    $scope.changeTab = function(val){
      $scope.isBlogDetail = val;
    }

    //POPOVER

    $ionicPopover.fromTemplateUrl('templates/popover/popover-postdetail.html', {
      scope: $scope,
    }).then(function(popover) {
      $scope.popover = popover;
    });
    $scope.openPopover = function($event, post) {
      $scope.focusedItem = post;    
      $scope.popover.show($event);
    };
    $scope.closePopover = function() {
      $scope.popover.hide();
    };
    //Cleanup the popover when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.popover.remove();
    });
    // Execute action on hide popover
    $scope.$on('popover.hidden', function() {
      // Execute action
    });
    // Execute action on remove popover
    $scope.$on('popover.removed', function() {
      // Execute action
    });

    $scope.toggleMap = function(){
      $scope.isMapShown = !$scope.isMapShown;
      if($scope.isMapShown == true)
      {
          $scope.showLocation();
      }
    }

    $scope.openImage = function(){

    }
    $scope.isMyPost = function(item){
    if(Token.foodict_ID == item.foodict_ID)
    {
        return true;
    }
    else
    {
        return false;
    }
  }


    /*======================= MODALS =========================*/

    $ionicModal.fromTemplateUrl('templates/modal/modal-image.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modalImage = modal;
    });
    $scope.openModalImage = function() {    
      $scope.modalImage.show();
    };
    $scope.closeModalImage = function() {
      $scope.modalImage.hide();    
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.modalImage.remove();
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

.controller('BitersCtrl', function($scope, $location, $ionicScrollDelegate, $stateParams, $ionicModal, $foodieUtils, PostDetail, Token) {
  $scope.getAllBiters = function(){
    PostDetail.getFoodicts({api_key: Token.api_key, foodict_ID: Token.foodict_ID, post_ID: $stateParams.post_ID, type: 0},
    function(successData) {
      if(successData.isAuthorized == true)
        {
          $scope.biters = successData.result;
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
    function(error) {
      $foodieUtils.errorCatcher(error.status);
    });
  }

  $scope.openProfile = function(foodict_ID){
      if(Token.foodict_ID == foodict_ID)
      {
        $location.path('/tab/newsfeed/home/profile').replace();
      }
      else
      {        
        $location.path('/tab/newsfeed/otherprofile/' + foodict_ID).replace();
      }
  }

  /*========================== ONLOAD ============================*/
  $scope.getAllBiters();
})
.controller('CommentCtrl', function($scope, $location, $ionicScrollDelegate, $stateParams, $ionicModal, $foodieUtils, Comments, Token) {
  $scope.comments = [];
  $scope.new_comment = "";
  //retrieve all comments
  $scope.getAllComments = function(){
    Comments.viewCommentsForThisPost({api_key: Token.api_key, post_ID: $stateParams.post_ID},
    function(successData) {
      if(successData.isAuthorized == true)
        {
          $scope.comments = successData.result;
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
      $ionicScrollDelegate.scrollBottom();
    }, 
    function(error) {
      $foodieUtils.errorCatcher(error.status);
    });
  }
  
  
  //add new comment
  $scope.postNewComment = function(){
    var new_item = {api_key: Token.api_key, post_ID:$stateParams.post_ID, foodict_ID: Token.foodict_ID,comment_content:$scope.new_comment};
    if($scope.new_comment != "")
    {
      Comments.addNewComment(null,new_item,
      function(successData){
        if(successData.isAuthorized == true)
          {
            $scope.comments = successData.result;
          }
        else
          {
            $foodieUtils.confirm("Expired Account","To continue using Foodie, please re-login your account. Re-login now?",function(res){
              if (res){
                //true
                window.localStorage.clear();
                $location.path('/login').replace();
              }
            });
          }    
        $scope.new_comment = "";
        $ionicScrollDelegate.scrollBottom();
      }, 
      function(error) {
          $foodieUtils.errorCatcher(error.status);
      });
    }    
  }

  $scope.reportEnabled = function(foodict_ID){
    if(parseInt(Token.foodict_ID) != parseInt(foodict_ID))
    {
      return true;
    }
    return false
  }
  $scope.deleteEnabled = function(foodict_ID){
    if(parseInt(Token.foodict_ID) == parseInt(foodict_ID))
    {
      return true;
    }
    return false
  }

  $scope.openProfile = function(foodict_ID){
      if(Token.foodict_ID == foodict_ID)
      {
        $location.path('/tab/newsfeed/home/profile').replace();
      }
      else
      {        
        $location.path('/tab/newsfeed/otherprofile/' + foodict_ID).replace();
      }
  }


  //ACTIONS

  $scope.deleteThis = function(comment){
    $foodieUtils.confirm("Delete comment","Delete this comment?",function(res){
      if (res){
          Comments.deleteThisComment({api_key: Token.api_key, foodict_ID: Token.foodict_ID, comment_ID: comment.comment_ID},
          function(successData){
            if(successData.isAuthorized == true)
              {
                if(successData.result)
                {
                  //deletion on UI
                  $scope.comments.splice($scope.comments.indexOf(comment), 1);
                }
                else
                {
                  // $foodieUtils.warning("Delete comment","Deletion of comment failed.",function(){
                  // });
                  $scope.getAllComments();
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
          function(error) {
              $foodieUtils.errorCatcher(error.status);
          });
      }
    });   
  }

  $scope.reportThis = function(comment){
    $foodieUtils.confirm("Report comment","You are about to report an item. Continue?",function(res){
      if (res){
        $scope.openModalReportComment();
        $scope.focusedItem = comment;
      }
    });
  }

    //Modal
    $ionicModal.fromTemplateUrl('templates/modal/modal-report-comment.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modalReportComment = modal;
    });
    $scope.openModalReportComment = function() {    
      $scope.modalReportComment.show();
    };
    $scope.closeModalReportComment = function() {
      $scope.modalReportComment.hide();    
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.modalReportComment.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
      // Execute action
    });


  /*================= ONLOAD ====================*/
  $scope.getAllComments();

})
.controller('ReportCommentModalCtrl', function($scope, $location, $foodieUtils, $ionicLoading, $ionicSlideBoxDelegate, Token, Report) {

  $scope.report_type = null;
  $scope.slideIndex = 0;
  $scope.toggleSlide = function(value){  
    $ionicSlideBoxDelegate.enableSlide(value);
  }

  $scope.nextSlide = function(){  
    $ionicSlideBoxDelegate.next();
  }

  $scope.previousSlide = function(){  
    $ionicSlideBoxDelegate.previous();
  }

  $scope.backToStart = function(){  
    $scope.gotoSlide(0);
  }

  $scope.gotoSlide = function(num){  
    $ionicSlideBoxDelegate.slide(num, 300);
  }

  $scope.slideIs = function(num){  
    if($scope.slideIndex == num)
    {
      return true;
    }
    return false;
  }

  $scope.slideChanged = function(index) {
    $scope.slideIndex = index;
  };

  $scope.scrollUp = function(){
    $ionicScrollDelegate.scrollTop();
  }




  /*========== FUNCTIONS ==========*/

  $scope.selectThis = function(num){
    $scope.report_type = num;
    $scope.gotoSlide(num);
  }

  $scope.sendReport = function(type, id, desc){
    Report.reportThis(null,{api_key: Token.api_key, user_ID: Token.user_ID, report_type: type, report_item_ID: id, report_description: desc},
      function(successData) {
        if(successData.isAuthorized == true)
          {
              if(successData.result)
              {                
                $scope.gotoSlide(2);
              }
              else
              {
                $foodieUtils.alert("Report Unsuccessful","It seems that there is an error.", function(){
                  $scope.finishReport();
                });
              }
          }
        else
          {
            $foodieUtils.confirm("Expired Account","To continue using Foodie, please re-login your account. Re-login now?",function(res){
              if (res){
                //true
                window.localStorage.clear();
                $location.path('/login').replace();
              }
            });
          }    
      }, 
      function(error) {
        $foodieUtils.errorCatcher(error.status);
      });
  }
  /*=============== ONLOAD ===============*/

  $scope.finishReport = function(){
    $scope.closeModalReportComment();
    $scope.$broadcast('refreshNewsfeed');
    $scope.gotoSlide(0);
  }
})

.controller('ReportModalCtrl', function($scope, $location, $foodieUtils, $ionicLoading, $ionicSlideBoxDelegate, Token, Report) {

  $scope.report_type = null;
  $scope.slideIndex = 0;
  $scope.toggleSlide = function(value){  
    $ionicSlideBoxDelegate.enableSlide(value);
  }

  $scope.nextSlide = function(){  
    $ionicSlideBoxDelegate.next();
  }

  $scope.previousSlide = function(){  
    $ionicSlideBoxDelegate.previous();
  }

  $scope.backToStart = function(){  
    $scope.gotoSlide(0);
  }

  $scope.gotoSlide = function(num){  
    $ionicSlideBoxDelegate.slide(num, 300);
  }

  $scope.slideIs = function(num){  
    if($scope.slideIndex == num)
    {
      return true;
    }
    return false;
  }

  $scope.slideChanged = function(index) {
    $scope.slideIndex = index;
  };

  $scope.scrollUp = function(){
    $ionicScrollDelegate.scrollTop();
  }




  /*========== FUNCTIONS ==========*/

  $scope.selectThis = function(num){
    $scope.report_type = num;
    $scope.gotoSlide(num);
  }

  $scope.sendReport = function(type, id, desc){
    Report.reportThis(null,{api_key: Token.api_key, user_ID: Token.user_ID, report_type: type, report_item_ID: id, report_description: desc},
      function(successData) {
        if(successData.isAuthorized == true)
          {
              if(successData.result)
              {                
                $scope.gotoSlide(3);
              }
              else
              {
                $foodieUtils.alert("Report Unsuccessful","It seems that there is an error.", function(){
                  $scope.finishReport();
                });
              }
          }
        else
          {
            $foodieUtils.confirm("Expired Account","To continue using Foodie, please re-login your account. Re-login now?",function(res){
              if (res){
                //true
                window.localStorage.clear();
                $location.path('/login').replace();
              }
            });
          }    
      }, 
      function(error) {
        $foodieUtils.errorCatcher(error.status);
      });
  }

  $scope.unfollowThis = function(item, text){
    $foodieUtils.unfollowActionSheet(item.foodict_username, text, function(){
      Follow.unfollowThisFoodict({api_key: Token.api_key, source_foodict_ID: Token.foodict_ID, target_foodict_ID: item.foodict_ID},
      function(successData) {
        if(successData.isAuthorized == true)
          {
              if(successData.result)
              {
                $scope.gotoSlide(4);
              }
          }
        else
          {
            $foodieUtils.confirm("Expired Account","To continue using Foodie, please re-login your account. Re-login now?",function(res){
              if (res){
                //true
                window.localStorage.clear();
                $location.path('/login').replace();
              }
            });
          }    
      }, 
      function(error) {
        $foodieUtils.errorCatcher(error.status);
      });
    });
  }

  /*=============== ONLOAD ===============*/

  $scope.finishReport = function(){
    $scope.closeModalReport();
    $scope.$broadcast('refreshNewsfeed');
    $scope.gotoSlide(0);
  }
})

.controller('OtherProfileCtrl', function($scope, $location, $foodieUtils, $ionicLoading, Token, OtherProfile, Follow, $stateParams, $ionicNavBarDelegate, Profile) {
   
  $scope.foodictProfileDetails = function(foodict_ID){
        OtherProfile.Details({api_key: Token.api_key, foodict_ID: Token.foodict_ID, target_foodict_ID: $stateParams.otherFoodictID},
        function(successData){
          if(successData.isAuthorized == true)
            {
              $scope.profileDetails = successData.result;
              $ionicNavBarDelegate.changeTitle(successData.result.foodict_username, 'forward')
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

  $scope.viewFollower = function(foodict_ID){
    $location.path('/tab/newsfeed/otherprofile/'+foodict_ID+'/followers').replace();
  }

  $scope.viewFollowing = function(foodict_ID){
    $location.path('/tab/newsfeed/otherprofile/'+foodict_ID+'/following').replace();
  }

  $scope.followThis = function(follow){
    Follow.followThisFoodict({api_key: Token.api_key, source_foodict_ID: Token.foodict_ID, target_foodict_ID: follow.foodict_ID},
    function(successData) {
      if(successData.isAuthorized == true)
        {
          follow.isFollowed = true;
          follow.follow_status = successData.result.follow_status;

          if(successData.result.follow_status == 1)
          {
            follow.count_follower = follow.count_follower + 1;
          }
          $scope.getGridPosts();
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
    function(error) {
      $foodieUtils.errorCatcher(error.status);
    });
  }

  $scope.unfollowThis = function(follow, text){
    $foodieUtils.unfollowActionSheet(follow.foodict_username, text, function(){
      Follow.unfollowThisFoodict({api_key: Token.api_key, source_foodict_ID: Token.foodict_ID, target_foodict_ID: follow.foodict_ID},
      function(successData) {
        if(successData.isAuthorized == true)
          {
            follow.isFollowed = false;
            if(follow.follow_status == 1)
            {
              follow.count_follower = follow.count_follower - 1;
            }
            follow.follow_status = 0;
            $scope.getGridPosts();
            //$scope.following.splice($scope.following.indexOf(follow), 1);
          }
        else
          {
            $foodieUtils.confirm("Expired Account","To continue using Foodie, please re-login your account. Re-login now?",function(res){
              if (res){
                //true
                window.localStorage.clear();
                $location.path('/login').replace();
              }
            });
          }    
      }, 
      function(error) {
        $foodieUtils.errorCatcher(error.status);
      });
    });
  }

  $scope.getGridPosts = function(){
        Profile.getGridPosts({api_key: Token.api_key, user_ID: Token.user_ID, foodict_ID: Token.foodict_ID, target_foodict_ID: $stateParams.otherFoodictID},
        function(successData){
          if(successData.isAuthorized == true)
            {
              $scope.gridPosts = successData.result;
              $scope.isLocked = successData.isLocked;
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



  $scope.foodictProfileDetails();
  $scope.getGridPosts();
})


















.controller('OtherFollowersCtrl', function($scope, $location, $foodieUtils, Follow, Follower, Token, $stateParams) {

  $scope.openProfile = function(foodict_ID){
      if(Token.foodict_ID == foodict_ID)
      {
        $location.path('/tab/newsfeed/home/profile').replace();
      }
      else
      {        
        $location.path('/tab/newsfeed/otherprofile/' + foodict_ID).replace();
      }
  }
  
  $scope.checkIfHim = function(foodictID){
    if($stateParams.foodictID != foodictID)
    {
        return true;
    }
    return false;
  }

  $scope.checkIfMe = function(foodictID){
    if(Token.foodict_ID != foodictID)
    {
        return true;
    }
    return false;
  }


  $scope.getFollowers = function(){
    Follower.getMyFollower({api_key: Token.api_key, foodict_ID: Token.foodict_ID, target_foodict_ID: $stateParams.foodictID},
    function(successData) {
      if(successData.isAuthorized == true)
        {
          $scope.follower = successData.result;
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
    function(error) {
      $foodieUtils.errorCatcher(error.status);
    });
  }
  $scope.followThis = function(follow){
    Follow.followThisFoodict({api_key: Token.api_key, source_foodict_ID: Token.foodict_ID, target_foodict_ID: follow.foodict_ID},
    function(successData) {
      if(successData.isAuthorized == true)
        {
          follow.isFollowed = true;
          follow.follow_status = successData.result.follow_status;
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
    function(error) {
      $foodieUtils.errorCatcher(error.status);
    });
  }

  $scope.unfollowThis = function(follow, text){
    $foodieUtils.unfollowActionSheet(follow.foodict_username, text, function(){
      Follow.unfollowThisFoodict({api_key: Token.api_key, source_foodict_ID: Token.foodict_ID, target_foodict_ID: follow.foodict_ID},
      function(successData) {
        if(successData.isAuthorized == true)
          {
            if(successData.result)
            {
              follow.follow_ID = 0;
              follow.isFollowed = false;
              follow.follow_status = 0;
            }
            else
            {
              $foodieUtils.alert("Error encountered","Action cannot be done correctly. Sorry about that.");
            } 
            //$scope.following.splice($scope.following.indexOf(follow), 1);
          }
        else
          {
            $foodieUtils.confirm("Expired Account","To continue using Foodie, please re-login your account. Re-login now?",function(res){
              if (res){
                //true
                window.localStorage.clear();
                $location.path('/login').replace();
              }
            });
          }    
      }, 
      function(error) {
        $foodieUtils.errorCatcher(error.status);
      });
    });
  }
  $scope.getFollowers();
})












.controller('OtherFollowingCtrl', function($scope, $location, $foodieUtils, Follow, Following, Token, $stateParams) {

  $scope.openProfile = function(foodict_ID){
      if(Token.foodict_ID == foodict_ID)
      {
        $location.path('/tab/newsfeed/home/profile').replace();
      }
      else
      {        
        $location.path('/tab/newsfeed/otherprofile/' + foodict_ID).replace();
      }
  }

  $scope.checkIfHim = function(foodictID){
    if($stateParams.foodictID != foodictID)
    {
        return true;
    }
    return false;
  }

  $scope.checkIfMe = function(foodictID){
    if(Token.foodict_ID != foodictID)
    {
        return true;
    }
    return false;
  }

  $scope.getFollowings = function(){
    Following.getMyFollowing({api_key: Token.api_key, foodict_ID: Token.foodict_ID, target_foodict_ID: $stateParams.foodictID},
    function(successData) {
      if(successData.isAuthorized == true)
        {
          $scope.following = successData.result;
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
    function(error) {
      $foodieUtils.errorCatcher(error.status);
    });
  }

  $scope.followThis = function(follow){
    Follow.followThisFoodict({api_key: Token.api_key, source_foodict_ID: Token.foodict_ID, target_foodict_ID: follow.foodict_ID},
    function(successData) {
      if(successData.isAuthorized == true)
        {
          follow.isFollowed = true;
          follow.follow_status = successData.result.follow_status;
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
    function(error) {
      $foodieUtils.errorCatcher(error.status);
    });
  }

  $scope.unfollowThis = function(follow, text){
    $foodieUtils.unfollowActionSheet(follow.foodict_username, text, function(){
      Follow.unfollowThisFoodict({api_key: Token.api_key, source_foodict_ID: Token.foodict_ID, target_foodict_ID: follow.foodict_ID},
      function(successData) {
        if(successData.isAuthorized == true)
          {
            if(successData.result)
            {
              follow.follow_ID = 0;
              follow.isFollowed = false;
              follow.follow_status = 0;
            }
            else
            {
              $foodieUtils.alert("Error encountered","Action cannot be done correctly. Sorry about that.");
            } 
            //$scope.following.splice($scope.following.indexOf(follow), 1);
          }
        else
          {
            $foodieUtils.confirm("Expired Account","To continue using Foodie, please re-login your account. Re-login now?",function(res){
              if (res){
                //true
                window.localStorage.clear();
                $location.path('/login').replace();
              }
            });
          }    
      }, 
      function(error) {
        $foodieUtils.errorCatcher(error.status);
      });
    });
  }

  //execute data
  $scope.getFollowings();
})

.controller('SharedOfferCtrl', function($scope, $location, $foodieUtils, $ionicLoading, $stateParams, $interval, Token, Offer) {

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
        $location.path('/tab/newsfeed').replace();
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
                                $location.path('/tab/newsfeed').replace();
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

})

.controller('MyHomeCtrl', function($scope, $location, $foodieUtils, Profile, Token, $cordovaFacebook) {

     $scope.checkIfMe = function(foodictID){
      if(Token.foodict_ID == foodictID)
      {
          return true;
      }
      return false;
    }

  
    $scope.logout = function(){
      try
      {
        $cordovaFacebook.logout();
      }
      catch(err)
      {

      }
      $scope.$broadcast('logoutAccount');
      window.localStorage.clear();      
      $location.path('/login').replace();
      Token.destroyToken();
    }

    $scope.getProfileDetails = function(){
        Profile.getMyProfileDetails({api_key: Token.api_key, user_ID: Token.user_ID, foodict_ID: Token.foodict_ID},
        function(successData){
          if(successData.isAuthorized == true)
            {
              $scope.profileDetails = successData.result;
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

    $scope.getGridPosts = function(){
        Profile.getGridPosts({api_key: Token.api_key, user_ID: Token.user_ID, foodict_ID: Token.foodict_ID, target_foodict_ID: Token.foodict_ID},
        function(successData){
          if(successData.isAuthorized == true)
            {
              $scope.gridPosts = successData.result;
              $scope.isLocked = successData.isLocked;
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

    $scope.viewMyFollower = function(){
      $location.path('/tab/newsfeed/me/followers').replace();
    }

     $scope.viewMyFollowing = function(){
      $location.path('/tab/newsfeed/me/following').replace();
    }

    $scope.profileAction = function(){
      $foodieUtils.profileActionSheet(function(index){
          if(index == 0)
          {
            $location.path('/tab/newsfeed/me/edit').replace();
          }
          else if(index == 1)
          {
            $location.path('/tab/newsfeed/me/vouchers').replace();
          }
          else if(index == 2)
          {
            $location.path('/tab/newsfeed/me/settings').replace();
          }
          else
          {
            $foodieUtils.yesno("Loging out","You might miss new food trends! Do you really want to logout?",function(res){
              if (res){
                //true
                $scope.logout();
              }
            });
          }
        }, 
        function(error) {
          $foodieUtils.errorCatcher(error.status);
        });
    }

    //=-=-=-=-=-=-=-=-=-=-=-=ONLOAD=-=-=-=-=-=-=-=-=-=-=-=
    $scope.getProfileDetails();
    $scope.getGridPosts();

})
.controller('MyFollowersCtrl', function($scope, $location, $foodieUtils, Follow, Follower, Token) {

  $scope.openProfile = function(foodict_ID){
      if(Token.foodict_ID == foodict_ID)
      {
        $location.path('/tab/newsfeed/home/profile').replace();
      }
      else
      {        
        $location.path('/tab/newsfeed/otherprofile/' + foodict_ID).replace();
      }
  }

  $scope.checkIfMe = function(foodictID){
    if(Token.foodict_ID != foodictID)
    {
        return true;
    }
    return false;
  }

  $scope.getAllFollowers = function(){
    Follower.getMyFollower({api_key: Token.api_key, foodict_ID: Token.foodict_ID, target_foodict_ID: Token.foodict_ID},
    function(successData) {
      if(successData.isAuthorized == true)
        {
          $scope.follower = successData.result;
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
    function(error) {
      $foodieUtils.errorCatcher(error.status);
    });
  }

  $scope.followThis = function(follow){
    Follow.followThisFoodict({api_key: Token.api_key, source_foodict_ID: Token.foodict_ID, target_foodict_ID: follow.foodict_ID},
    function(successData) {
      if(successData.isAuthorized == true)
        {
          follow.isFollowed = true;
          follow.follow_status = successData.result.follow_status;
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
    function(error) {
      $foodieUtils.errorCatcher(error.status);
    });
  }

  $scope.unfollowThis = function(follow, text){
    $foodieUtils.unfollowActionSheet(follow.foodict_username, text, function(){
      Follow.unfollowThisFoodict({api_key: Token.api_key, source_foodict_ID: Token.foodict_ID, target_foodict_ID: follow.foodict_ID},
      function(successData) {
        if(successData.isAuthorized == true)
          {
            if(successData.result)
            {
              follow.follow_ID = 0;
              follow.isFollowed = false;
              follow.follow_status = 0;
            }
            else
            {
              $foodieUtils.alert("Error encountered","Action cannot be done correctly. Sorry about that.");
            } 
            //$scope.following.splice($scope.following.indexOf(follow), 1);
          }
        else
          {
            $foodieUtils.confirm("Expired Account","To continue using Foodie, please re-login your account. Re-login now?",function(res){
              if (res){
                //true
                window.localStorage.clear();
                $location.path('/login').replace();
              }
            });
          }    
      }, 
      function(error) {
        $foodieUtils.errorCatcher(error.status);
      });
    });
  }

  $scope.getAllFollowers();
})

.controller('MyFollowingCtrl', function($scope, $location, $foodieUtils, Follow, Following, Token) {

  $scope.openProfile = function(foodict_ID){
      if(Token.foodict_ID == foodict_ID)
      {
        $location.path('/tab/newsfeed/home/profile').replace();
      }
      else
      {        
        $location.path('/tab/newsfeed/otherprofile/' + foodict_ID).replace();
      }
  }

  $scope.checkIfMe = function(foodictID){
    if(Token.foodict_ID != foodictID)
    {
        return true;
    }
    return false;
  }
  $scope.getAllFollowings = function(){
    Following.getMyFollowing({api_key: Token.api_key, foodict_ID: Token.foodict_ID, target_foodict_ID: Token.foodict_ID},
    function(successData) {
      if(successData.isAuthorized == true)
        {
          $scope.following = successData.result;
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
    function(error) {
      $foodieUtils.errorCatcher(error.status);
    });
  }

  $scope.followThis = function(follow){
    Follow.followThisFoodict({api_key: Token.api_key, source_foodict_ID: Token.foodict_ID, target_foodict_ID: follow.foodict_ID},
    function(successData) {
      if(successData.isAuthorized == true)
        {
          follow.isFollowed = true;
          follow.follow_status = successData.result.follow_status;
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
    function(error) {
      $foodieUtils.errorCatcher(error.status);
    });
  }

  $scope.unfollowThis = function(follow, text){
    $foodieUtils.unfollowActionSheet(follow.foodict_username, text, function(){
      Follow.unfollowThisFoodict({api_key: Token.api_key, source_foodict_ID: Token.foodict_ID, target_foodict_ID: follow.foodict_ID},
      function(successData) {
        if(successData.isAuthorized == true)
          {
            if(successData.result)
            {
              follow.follow_ID = 0;
              follow.isFollowed = false;
              follow.follow_status = 0;
            }
            else
            {
              $foodieUtils.alert("Error encountered","Action cannot be done correctly. Sorry about that.");
            } 
            //$scope.following.splice($scope.following.indexOf(follow), 1);
          }
        else
          {
            $foodieUtils.confirm("Expired Account","To continue using Foodie, please re-login your account. Re-login now?",function(res){
              if (res){
                //true
                window.localStorage.clear();
                $location.path('/login').replace();
              }
            });
          }    
      }, 
      function(error) {
        $foodieUtils.errorCatcher(error.status);
      });
    });
  }

  //execute data
  $scope.getAllFollowings();
})
.controller('FoodictFooducerProfileCtrl', function($scope, $location, $stateParams, $foodieUtils, $ionicLoading, $timeout, Token, FooducerProfile) {
  
  var foodictFooducerProfileMap = new Object();
  $scope.getProfile = function(){
    FooducerProfile.getProfile({api_key: Token.api_key, fooducer_ID: $stateParams.fooducerID, foodict_ID: Token.foodict_ID},
      function(successData){
        if(successData.isAuthorized)
          {
            $scope.profileDetails = successData.result;
            $timeout(function(){
              $scope.initializeMap(successData.result.fooducer_location_latitude, successData.result.fooducer_location_longitude);
            }, 1000);        

            
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

      });
  }

  $scope.initializeMap = function(latitude, longitude) {
      try
      {
        foodictFooducerProfileMap = new google.maps.Map(document.getElementById("foodictFooducerProfileMap"), {
          center: new google.maps.LatLng(latitude, longitude),
          zoom: 16,          
          disableDoubleClickZoom: true
        }); 
        var pin = new google.maps.Marker({position:new google.maps.LatLng(latitude, longitude)});
        pin.setMap(foodictFooducerProfileMap);        
        foodictFooducerProfileMap.panTo(pin.getPosition());
      }
      catch(err)
      {        
        $foodieUtils.alert("Unsuccessful request","Unable to fetch map data from the internet" + err,function(){
          $scope.isMapShown = false;
        });
      }    
      $ionicLoading.hide();    
  }

  //=-=-=-=-=-=-=-=-ONLOAD=-=-=-=--=-=--=-
  $scope.getProfile();

});


