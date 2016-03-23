angular.module('foodie.controllers.admin.spam', ['foodie.services', 'foodie.plugins'])

.controller('AdminSpamCtrl', function($scope, $location, $foodieUtils, $ionicLoading, $timeout, Token, Spam) {

	$scope.getSpams = function(){
    Spam.getSpams({api_key: Token.api_key, administrator_ID: Token.administrator_ID},
    function(successData) {
      if(successData.isAuthorized == true)
        {
          $scope.spams = successData.result;
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

  $scope.gotoState = function(id, type){
    $location.path('admin/spam/' + id + "/" + type).replace(); 
  }

  /*================================ ONLOAD =================================*/
  $scope.getSpams();
})

.controller('AdminSpamDetailsCtrl', function($scope, $location, $foodieUtils, $ionicLoading, $timeout, $stateParams, Token, Spam, Report) {

  $scope.getSpamDetails = function(){
    Spam.getSpamDetails(null,{api_key: Token.api_key, administrator_ID: Token.administrator_ID, report_ID: $stateParams.reportID, report_type: $stateParams.reportType},
    function(successData) {
      if(successData.isAuthorized == true)
        {
            if(successData.result == null)
            {
                $location.path('admin/spam').replace();              
            }
            else
            {
                $scope.spam = successData.result;
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

  $scope.penalize = function(reportID, itemID, type, amt){
    $foodieUtils.confirm("You're about to penalize a user","Penalty will be given, continue?",function(res){
      if (res){
          Spam.penalize(null,{api_key: Token.api_key, administrator_ID: Token.administrator_ID, report_ID: reportID, report_source_item_ID: itemID, report_type: type, penalty_amount: amt},
            function(successData) {
              if(successData.isAuthorized == true)
                {
                  if(successData.result == true)
                  {
                    $foodieUtils.alert("Successful!","You successfully deducted " + amt +" Foodie Points on the user.",function(){
                      $location.path('admin/spam').replace();
                    });
                  }
                  else
                  {
                    $foodieUtils.alert("Failed!","Something went wrong.",function(){
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
  }

  $scope.delete = function(reportID, itemID, type){
    $foodieUtils.confirm("Deleting an item","You're about to delete an item, Continue?",function(res){
      if (res){
          Spam.deleteThis({api_key: Token.api_key, administrator_ID: Token.administrator_ID, report_ID: reportID, report_source_item_ID: itemID, report_type: type},
            function(successData) {
              if(successData.isAuthorized == true)
                {
                  if(successData.result == true)
                  {
                    $foodieUtils.alert("Successful!","You successfully deleted an item.",function(){
                      $location.path('admin/spam').replace();
                    });
                  }
                  else
                  {
                    $foodieUtils.alert("Failed!","Something went wrong.",function(){
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
  }

  $scope.ignore = function(reportID, itemID, type){
        Report.deleteReport({api_key: Token.api_key, administrator_ID: Token.administrator_ID, report_ID: reportID, report_source_item_ID: itemID, report_type: type},
            function(successData) {
              if(successData.isAuthorized == true)
                {
                  if(successData.result == true)
                  {
                    $foodieUtils.alert("Successful!","You successfully deleted a report.",function(){
                      $location.path('admin/spam').replace();
                    });
                  }
                  else
                  {
                    $foodieUtils.alert("Failed!","Something went wrong.",function(){
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

  /*================================ ONLOAD =================================*/
  $scope.getSpamDetails();
});


