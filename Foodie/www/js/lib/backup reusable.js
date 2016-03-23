angular.module('foodie.controllers', ['foodie.services'])

.controller('NewsfeedCtrl', function($scope, Posts, $http, $interval) {

  $scope.posts = Posts.query();
  //$scope.time = new Date("August 19, 2013 11:45:00").toString();
  // $http.get('newsfeed.json')
  //   .success(function(data){
  //     $scope.posts = data;
  //   })
  //   .error(function(data, status, headers, config) {
  //     alert("Please connect to the internet;");
  //     $scope.posts = null;
  //   });
    $scope.refresh = function(){
      $scope.posts = Posts.query();
      // $http.get('newsfeed.json')
      // .success(function(data){
      //   $scope.posts = data;
      // })
      // .error(function(data, status, headers, config) {
      //   alert("Please connect to the internet;");
      //   $scope.posts = null;
      // });
      // $scope.$broadcast('scroll.refreshComplete');
    };
    //$interval($scope.refresh,5000);
  //$timeout($scope.refresh,1000, true);
})

.controller('OffersCtrl', function($scope, Posts, $http) {
  
  $scope.posts = Posts.query();
  // $http.get('newsfeed.json')
  //   .success(function(data){
  //     $scope.posts = data;
  //   })
  //   .error(function(data, status, headers, config) {
  //     alert("Please connect to the internet;");
  //     $scope.posts = null;
  //   });
  
  $scope.refresh = function(){
  $scope.posts = Posts.query();
  //   $http.get('newsfeed.json')
  //   .success(function(data){
  //     $scope.posts = data;
  //   })
  //   .error(function(data, status, headers, config) {
  //     alert("Please connect to the internet;");
  //     $scope.posts = null;
  //   });
  //   $scope.$broadcast('scroll.refreshComplete');
  };


})

.controller('PostDetailCtrl', function($scope, $stateParams, Posts, $http) {
    $http.get('http://localhost:12687/api/post?post_ID='+$stateParams.post_ID)
    .success(function(data){
      $scope.datasroc = data;
    })
    .error(function(data, status, headers, config) {
      alert("Please connect to the internet;");
      $scope.datasroc = null;
    });
  // $http.get('newsfeed.json')
  //   .success(function(data){
  //     $scope.posts = data;
  //   })
  //   .error(function(data, status, headers, config) {
  //     alert("Please connect to the internet;");
  //     $scope.posts = null;
  //   });
})

.controller('OffersDetailCtrl', function($scope, $stateParams, Posts, $http) {
  $http.get('http://localhost:12687/api/post?post_ID='+$stateParams.post_ID)
    .success(function(data){
      $scope.datasroc = data;
    })
    .error(function(data, status, headers, config) {
      alert("Please connect to the internet;");
      $scope.datasroc = null;
    });

    // $http.get('newsfeed.json')
    // .success(function(data){
    //   $scope.posts = data;
    // })
    // .error(function(data, status, headers, config) {
    //   alert("Please connect to the internet;");
    //   $scope.posts = null;
    // });
})

.controller('NotificationCtrl', function($scope) {
})

.controller('HomeCtrl', function($scope) {
})

.controller('CommentCtrl', function($scope, $ionicScrollDelegate, $stateParams, $http) {
  $scope.comments = [];
  $http.get('http://localhost:12687/api/comment/'+$stateParams.post_ID)
    .success(function(data){
      if (data != null)
      {
        $scope.comments = data;
      }
      else
      {
        $scope.comments = {"comment_content": "No comments available."};
      }
    })
    .error(function(data, status, headers, config) {
      alert("Please connect to the internet;");
      $scope.comments = {"comment_content": "No comments available."};
    })
    .finally(function(){
      $ionicScrollDelegate.scrollBottom();
    })

  

  // $scope.postNewComment = function(){
  //   var datax = {post_ID:$stateParams.post_ID,foodict_ID:"10002",comment_content:$scope.new_comment};
  //   $http.post('http://localhost:12687/api/comment', datax)
  //   .success(function(data){
  //     alert(datax.comment_content);
  //     $scope.comments.unshift(datax);
  //     // $scope.$apply(function(){
  //     //   alert("boom");
  //     //   $scope.comments.push(datax);  //UPDATE li
  //     // });
  //     //$scope.comments = data;  
  //   })
  //   .error(function(data, status, headers, config) {
  //     alert("Please connect to the internet;");
  //     $scope.comments = {"comment_content": "No comments available."};
  //   })
  //   .finally(function(){
  //     $ionicScrollDelegate.scrollBottom();
  //     $scope.$observe();
  //   })
  // }

  $scope.postNewComment = function(){
    var new_item = {post_ID:$stateParams.post_ID,foodict_ID:"10002",comment_content:$scope.new_comment};
    $http.post('http://localhost:12687/api/comment', new_item)
    .success(function(data){
      $scope.comments.push({
        comment_content: $scope.new_comment,
        comment_date: "2014-10-03T12:36:31.247",
        foodict_ID: 10002,
        foodict_username: "carlobenj",
        foodict_image: "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xpa1/v/t1.0-1/c0.0.160.160/p160x160/1623743_729576150396168_1398607722_n.jpg?oh=c2677ef5f02449baf88493cc8a62f01d&oe=54BD4A09&__gda__=1422057436_05cad6c2d027df1fec3fb4e1c349e398"
      });
      alert(data[4].comment_content);
    })
    .error(function(data, status, headers, config) {
      alert("Please connect to the internet;");
      $scope.comments = {"comment_content": "No comments available."};
    })
    .finally(function(){
      $ionicScrollDelegate.scrollBottom();
      $scope.$observe();
    })
  }

  $scope.addDom = function () {
    var fret = {
      post_ID: '10002',
      foodict_ID: '10002',
      comment_content: 'asdasdasd'
    };
    $scope.comments.push(fret);

    alert(fret.comment_content + " - casd");
  };

})

.controller('ComposeCtrl', function($scope, $ionicNavBarDelegate) {
})

.controller('LoginCtrl', function($scope, $ionicNavBarDelegate) {
});


// $http.get('http://localhost:12687/api/comment/'+$stateParams.post_ID)
  //   .success(function(data){
  //     if (data != null)
  //     {
  //       $scope.comments = data;
  //     }
  //     else
  //     {
  //       $scope.comments = {"comment_content": "No comments available."};
  //     }
  //   })
  //   .error(function(data, status, headers, config) {
  //     alert("Please connect to the internet;");
  //     $scope.comments = {"comment_content": "No comments available."};
  //   })
  //   .finally(function(){
  //     $ionicScrollDelegate.scrollBottom();
  //   })
    // $http.post('http://localhost:12687/api/comment', new_item)
    // .success(function(data){
    //   $scope.comments = data;
    //   $scope.new_comment = "";
    // })
    // .error(function(data, status, headers, config) {
    //   alert("Please connect to the internet");      
    //   $scope.comments = data;
    //   $scope.new_comment = "";
    // })
    // .finally(function(){
    //   $ionicScrollDelegate.scrollBottom();
    // })


// .controller('ComposeCtrl', function($scope, $ionicNavBarDelegate, Camera, $http) {
//   $scope.image_string = "";
//   $scope.getPhoto = function() {
//     Camera.getPicture().then(function(imageURI) {
//       $scope.image_string = imageURI;
//   //     alert(imageURI);
//   //     var qweimg = {"ss": imageURI};
//   //     alert(qweimg);
//   // $http.post('http://10.0.3.2:12687/api/comment', qweimg)
//   //   .success(function(data){
//   //     alert("ok");
//   //   })
//   //   .error(function(data, status, headers, config) {
//   //     alert("Please connect to the internet");   
//   //   })
//   //   .finally(function(){
//   //     alert("tapos");
//   //   })
//   //   }, function(err) {
//   //     console.err(err);
//      });
//   };
// })

// .controller('NewsfeedCtrl', function($scope, $q, $ionicScrollDelegate, Newsfeed, Token) {
//   //Broadcasted Refresh
//   alert("pasok");
//   $scope.$on('refreshNewsfeed', function() { 
//     $scope.getNewsfeed();
//     $ionicScrollDelegate.scrollTop();
//   });

//   $scope.getNewsfeed = function() {

//     $scope.newsfeedPosts = $q.defer();
//     alert("defer");
//     Newsfeed.viewMyNewsfeed({api_key: Token.api_key},
//     function(successData){
//         if(successData.isAuthorized == true)
//           {
//             alert(successData.result);
//             $scope.newsfeedPosts.resolve(successData.result);
//             alert("tapos");
//             //$scope.newsfeedPosts = successData.result;
//           }
//         else
//           {
//             alert("e");
//             $scope.newsfeedPosts.resolve(null);
//             // $scope.newsfeedPosts = null;
//           }    
//       }, 
//       function(error) {
//           if(error.status == 500)
//           {
//             alert("Internal server error");
//           }

//         alert("error");
//       });  
//   }

//   //Retrieve newsfeed if the data is null
//   if($scope.newsfeedPosts == null || $scope.newsfeedPosts == [])
//   {
//     // $scope.getNewsfeed();
//   }
//   $scope.getNewsfeed();

   
// })


// .controller('ComposeModalCtrl', function($scope, $ionicNavBarDelegate, $ionicLoading, $foodieUtils, Camera, Token, Posts) {
//   $scope.image_string = "img/uploadphoto.png";
//   $scope.isChecked = false;
//   $scope.toggleText = "Enable";
//   $scope.latitude = null;  
//   $scope.longitude = null;
//   var map;

//   //GEOLOCATION FUNCTIONS
//     $scope.GeolocationSuccess = function(position) {
//       $scope.latitude = position.coords.latitude;  
//       $scope.longitude = position.coords.longitude;
//       //first unaltered map
//       map = new google.maps.Map(document.getElementById("map"), {
//         center: new google.maps.LatLng($scope.latitude, $scope.longitude),
//         zoom: 15
//       });            
//       var marker = new google.maps.Marker({position:new google.maps.LatLng($scope.latitude, $scope.longitude)});
//       marker.setMap(map); 

//       $scope.chooseLocation();
//     };

//     $scope.GeolocationError = function(error) {
//         alert('code: '    + error.code    + '\n' +
//               'message: ' + error.message + '\n');
//     }

//     $scope.toggleLocation = function(){
//       $scope.isChecked = !$scope.isChecked;
//       if($scope.isChecked)
//         {
//             //Enabled location sharing
//             $scope.toggleText = "Disable";
//             navigator.geolocation.getCurrentPosition($scope.GeolocationSuccess, $scope.GeolocationError, { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true });
//         }
//       else
//         {
//             //Disabled locatiopn sharing
//             $scope.toggleText = "Enable";            
//             $scope.latitude = null;  
//             $scope.longitude = null;
//         }
//     }



//     $scope.chooseLocation = function(){
//       //request for nearby places
//       var request = {
//         location: new google.maps.LatLng($scope.latitude, $scope.longitude),
//         radius: 1500,
//         types: ['store']
//       };
//       var service = new google.maps.places.PlacesService(map);
//       service.nearbySearch(request, function(results, status){
//         if (status == google.maps.places.PlacesServiceStatus.OK) {
//           for (var i = 0; i < results.length; i++) {
//             alert(results[i].name);
//           }
//         }
//       });
//     }

//     $scope.getPhoto = function() {
//       $foodieUtils.cameraActionSheet(function(index){
//         if(index == 0)
//         {
//           Camera.takePicture().then(
//             function(imageURI) {
//               $scope.image_string = "data:image/jpeg;base64, " + imageURI;
//               $scope.post_image = "data:image/jpeg;base64, " + imageURI;
//             }, 
//             function(err) {
//               console.err(err);
//             }
//           );
//         }
//         else
//         {
//           Camera.fromLibrary().then(
//             function(imageURI) {
//               $scope.image_string = "data:image/jpeg;base64, " + imageURI;
//               $scope.post_image = "data:image/jpeg;base64, " + imageURI;
//             }, 
//             function(err) {
//               console.err(err);
//             }
//           );
//         }
//       });
//     };

//     $scope.postBlog = function(){
//       $ionicLoading.show(); //show loader
//       var new_item = {api_key: Token.api_key, foodict_ID: Token.foodict_ID, post_title: $scope.post_title, post_text: $scope.post_text, post_image: $scope.post_image, post_location_latitude: $scope.latitude, post_location_longitude: $scope.longitude};
//       Posts.postNewBlog(null,new_item,
//       function(successData){
//         if(successData.isAuthorized == true)
//           {
//             $ionicLoading.hide();
//             $scope.closeModal();
//             // $scope.comments = successData.result;
//           }
//         else
//           {
//             $ionicLoading.hide();
//             $foodieUtils.confirm("Expired Account","To continue using Foodie, please re-login your account. Re-login now?",function(res){
//               if (res){
//                 //true
//                 Token.destroyToken();
//                 window.localStorage.clear();
//                 $location.path('/login').replace();
//               }
//             });
//             // $scope.comments = null;
//           }    
//       }, 
//       function(error) {
//           $ionicLoading.hide();
//           $foodieUtils.errorCatcher(error.status);
//       });
//     }   
// })

