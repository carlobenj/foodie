angular.module('foodie.controllers.notification', ['foodie.services', 'foodie.plugins'])

.controller('NotificationCtrl', function($scope, $location, $foodieUtils, $location, $ionicLoading, Token, Notification, Follow) {
	// window.localStorage.setItem("notifications", 0);
	$scope.getAllNotifications = function(){
		Notification.getMyNotifications({api_key: Token.api_key, user_ID: Token.user_ID, foodict_ID: Token.foodict_ID},
        function(successData){
          if(successData.isAuthorized == true)
            {
              $scope.AllNotifications = successData.result;
              $scope.markDoneAllNotifications(successData.result);
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

  $scope.markDoneAllNotifications = function(object){
    var items = [];
    for (x = 0; x < object.length; x++)
    {
        items.push(object[x].notification_ID);
    }

    Notification.markDone({api_key: Token.api_key, user_ID: Token.user_ID, foodict_ID: Token.foodict_ID, items_ID: items},
        function(successData){
          $scope.$emit('resetNotificationCount');
          if(successData.isAuthorized == false)
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

  $scope.showDelete = function(noti){
    var type = noti.notification_type;
    if(type >= 0 && type <= 4)
    {
      return true;
    }
    else if(type == 11)
    {
      return false;
    }
    else
    {
      return false;
    }
  }

  $scope.gotoState = function(url){
    $location.path(url).replace();
  }

  $scope.deleteThisNotification = function(noti){
    $foodieUtils.confirm("Delete post","Do you really want to delete this post?",function(res){
      if (res){
        Notification.deleteThis({api_key: Token.api_key, user_ID: Token.user_ID, foodict_ID: Token.foodict_ID, notification_ID: noti.notification_ID},
            function(successData){
              if(successData.isAuthorized == true)
                {
                  if(successData.result)
                  {              
                    $scope.AllNotifications.splice($scope.AllNotifications.indexOf(noti), 1);
                  }
                  else
                  {
                    $foodieUtils.warning("Error Encountered","Deletion of item failed.");
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

  $scope.actionRequest = function(noti, toAccept){
    Follow.actionOnThisRequest(null,{api_key: Token.api_key, foodict_ID: Token.foodict_ID, notification_ID: noti.notification_ID, follow_ID: noti.follow_ID, isAccepted: toAccept},
      function(successData){
        if(successData.isAuthorized == true)
        {          
            if(successData.result)
            {
              noti.isDone = true;
              if(toAccept)
              {                
                //do something on accept
              }
              else
              {
                //do something on reject
                var ind = $scope.AllNotifications.indexOf(noti);
                $scope.AllNotifications.splice(ind, 1);
              }
            }
            else
            {
              $foodieUtils.warning("Error Encountered","Action on item failed.");
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



	//=-=-=-=-=-=-=-=-ONLOAD=-=-=-=--=-=--=-
	$scope.getAllNotifications();	
});


