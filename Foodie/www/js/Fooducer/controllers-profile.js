angular.module('foodie.controllers.fooducer.profile', ['foodie.services', 'foodie.plugins'])

.controller('FooducerProfileCtrl', function($scope, $location, $foodieUtils, $ionicLoading, $timeout, Token, FooducerProfile) {
  
  var fooducerProfileMap = new Object();
  $scope.getProfile = function(){
    FooducerProfile.getProfile({api_key: Token.api_key, fooducer_ID: Token.fooducer_ID},
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
        fooducerProfileMap = new google.maps.Map(document.getElementById("fooducerprofilemap"), {
          center: new google.maps.LatLng(latitude, longitude),
          zoom: 16,          
          disableDoubleClickZoom: true
        }); 
        var pin = new google.maps.Marker({position:new google.maps.LatLng(latitude, longitude)});
        pin.setMap(fooducerProfileMap);        
        fooducerProfileMap.panTo(pin.getPosition());
      }
      catch(err)
      {        
        $foodieUtils.alert("Unsuccessful request","Unable to fetch map data from the internet" + err,function(){
          $scope.isMapShown = false;
        });
      }    
      $ionicLoading.hide();    
  }

  $scope.profileAction = function(){
      $foodieUtils.fooducerProfileActionSheet(function(index){
          if(index == 0)
          {
            $location.path('/fooducer/profile/edit').replace();
          }
          else if(index == 1)
          {
            $location.path('/fooducer/profile/settings').replace();
          }
          else
          {
            $foodieUtils.yesno("Loging out","Do you really want to logout?",function(res){
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

  $scope.logout = function(){
      $scope.$emit('logoutAccount');
      window.localStorage.clear();
      $location.path('/login').replace();
      Token.destroyToken();
  }

  //=-=-=-=-=-=-=-=-ONLOAD=-=-=-=--=-=--=-
  $scope.getProfile();

})

.controller('FooducerEditProfileCtrl', function($scope, $location, $foodieUtils, $ionicLoading, $ionicModal, $jrCrop, Token, Camera, FooducerProfile) {

  $scope.new_image = "";  
  var markers = [];
  var changeLocationMapObject;
  $scope.getProfile = function(){
    FooducerProfile.getProfile({api_key: Token.api_key, fooducer_ID: Token.fooducer_ID},
      function(successData){
        if(successData.isAuthorized)
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

      });
  }
    $scope.countries = [{name: 'Afghanistan', code: 'AF'},{name: 'Åland Islands', code: 'AX'},{name: 'Albania', code: 'AL'},{name: 'Algeria', code: 'DZ'},
    {name: 'American Samoa', code: 'AS'},{name: 'AndorrA', code: 'AD'},{name: 'Angola', code: 'AO'},{name: 'Anguilla', code: 'AI'},{name: 'Antarctica', code: 'AQ'},
    {name: 'Antigua and Barbuda', code: 'AG'},{name: 'Argentina', code: 'AR'},{name: 'Armenia', code: 'AM'},{name: 'Aruba', code: 'AW'},{name: 'Australia', code: 'AU'},
    {name: 'Austria', code: 'AT'},{name: 'Azerbaijan', code: 'AZ'},{name: 'Bahamas', code: 'BS'},{name: 'Bahrain', code: 'BH'},{name: 'Bangladesh', code: 'BD'},
    {name: 'Barbados', code: 'BB'},{name: 'Belarus', code: 'BY'},{name: 'Belgium', code: 'BE'},{name: 'Belize', code: 'BZ'},{name: 'Benin', code: 'BJ'},
    {name: 'Bermuda', code: 'BM'},{name: 'Bhutan', code: 'BT'},{name: 'Bolivia', code: 'BO'},{name: 'Bosnia and Herzegovina', code: 'BA'},{name: 'Botswana', code: 'BW'},
    {name: 'Bouvet Island', code: 'BV'},{name: 'Brazil', code: 'BR'},{name: 'British Indian Ocean Territory', code: 'IO'},{name: 'Brunei Darussalam', code: 'BN'},
    {name: 'Bulgaria', code: 'BG'},{name: 'Burkina Faso', code: 'BF'},{name: 'Burundi', code: 'BI'},{name: 'Cambodia', code: 'KH'},{name: 'Cameroon', code: 'CM'},
    {name: 'Canada', code: 'CA'},{name: 'Cape Verde', code: 'CV'},{name: 'Cayman Islands', code: 'KY'},{name: 'Central African Republic', code: 'CF'},{name: 'Chad', code: 'TD'},
    {name: 'Chile', code: 'CL'},{name: 'China', code: 'CN'},{name: 'Christmas Island', code: 'CX'},{name: 'Cocos (Keeling) Islands', code: 'CC'},{name: 'Colombia', code: 'CO'},
    {name: 'Comoros', code: 'KM'},{name: 'Congo', code: 'CG'},{name: 'Congo, The Democratic Republic of the', code: 'CD'},{name: 'Cook Islands', code: 'CK'},
    {name: 'Costa Rica', code: 'CR'},{name: 'Cote D\'Ivoire', code: 'CI'},{name: 'Croatia', code: 'HR'},{name: 'Cuba', code: 'CU'},{name: 'Cyprus', code: 'CY'},
    {name: 'Czech Republic', code: 'CZ'},{name: 'Denmark', code: 'DK'},{name: 'Djibouti', code: 'DJ'},{name: 'Dominica', code: 'DM'},{name: 'Dominican Republic', code: 'DO'},
    {name: 'Ecuador', code: 'EC'},{name: 'Egypt', code: 'EG'},{name: 'El Salvador', code: 'SV'},{name: 'Equatorial Guinea', code: 'GQ'},{name: 'Eritrea', code: 'ER'},
    {name: 'Estonia', code: 'EE'},{name: 'Ethiopia', code: 'ET'},{name: 'Falkland Islands (Malvinas)', code: 'FK'},{name: 'Faroe Islands', code: 'FO'},{name: 'Fiji', code: 'FJ'},
    {name: 'Finland', code: 'FI'},{name: 'France', code: 'FR'},{name: 'French Guiana', code: 'GF'},{name: 'French Polynesia', code: 'PF'},{name: 'French Southern Territories', code: 'TF'},
    {name: 'Gabon', code: 'GA'},{name: 'Gambia', code: 'GM'},{name: 'Georgia', code: 'GE'},{name: 'Germany', code: 'DE'},{name: 'Ghana', code: 'GH'},{name: 'Gibraltar', code: 'GI'},
    {name: 'Greece', code: 'GR'},{name: 'Greenland', code: 'GL'},{name: 'Grenada', code: 'GD'},{name: 'Guadeloupe', code: 'GP'},{name: 'Guam', code: 'GU'},{name: 'Guatemala', code: 'GT'},
    {name: 'Guernsey', code: 'GG'},{name: 'Guinea', code: 'GN'},{name: 'Guinea-Bissau', code: 'GW'},{name: 'Guyana', code: 'GY'},{name: 'Haiti', code: 'HT'},
    {name: 'Heard Island and Mcdonald Islands', code: 'HM'},{name: 'Holy See (Vatican City State)', code: 'VA'},{name: 'Honduras', code: 'HN'},{name: 'Hong Kong', code: 'HK'},
    {name: 'Hungary', code: 'HU'},{name: 'Iceland', code: 'IS'},{name: 'India', code: 'IN'},{name: 'Indonesia', code: 'ID'},{name: 'Iran, Islamic Republic Of', code: 'IR'},
    {name: 'Iraq', code: 'IQ'},{name: 'Ireland', code: 'IE'},{name: 'Isle of Man', code: 'IM'},{name: 'Israel', code: 'IL'},{name: 'Italy', code: 'IT'},{name: 'Jamaica', code: 'JM'},
    {name: 'Japan', code: 'JP'},{name: 'Jersey', code: 'JE'},{name: 'Jordan', code: 'JO'},{name: 'Kazakhstan', code: 'KZ'},{name: 'Kenya', code: 'KE'},{name: 'Kiribati', code: 'KI'},
    {name: 'Korea, Democratic People\'S Republic of', code: 'KP'},{name: 'Korea, Republic of', code: 'KR'},{name: 'Kuwait', code: 'KW'},{name: 'Kyrgyzstan', code: 'KG'},
    {name: 'Lao People\'S Democratic Republic', code: 'LA'},{name: 'Latvia', code: 'LV'},{name: 'Lebanon', code: 'LB'},{name: 'Lesotho', code: 'LS'},{name: 'Liberia', code: 'LR'},
    {name: 'Libyan Arab Jamahiriya', code: 'LY'},{name: 'Liechtenstein', code: 'LI'},{name: 'Lithuania', code: 'LT'},{name: 'Luxembourg', code: 'LU'},{name: 'Macao', code: 'MO'},
    {name: 'Macedonia, The Former Yugoslav Republic of', code: 'MK'},{name: 'Madagascar', code: 'MG'},{name: 'Malawi', code: 'MW'},{name: 'Malaysia', code: 'MY'},
    {name: 'Maldives', code: 'MV'},{name: 'Mali', code: 'ML'},{name: 'Malta', code: 'MT'},{name: 'Marshall Islands', code: 'MH'},{name: 'Martinique', code: 'MQ'},
    {name: 'Mauritania', code: 'MR'},{name: 'Mauritius', code: 'MU'},{name: 'Mayotte', code: 'YT'},{name: 'Mexico', code: 'MX'},{name: 'Micronesia, Federated States of', code: 'FM'},
    {name: 'Moldova, Republic of', code: 'MD'},{name: 'Monaco', code: 'MC'},{name: 'Mongolia', code: 'MN'},{name: 'Montserrat', code: 'MS'},{name: 'Morocco', code: 'MA'},
    {name: 'Mozambique', code: 'MZ'},{name: 'Myanmar', code: 'MM'},{name: 'Namibia', code: 'NA'},{name: 'Nauru', code: 'NR'},{name: 'Nepal', code: 'NP'},{name: 'Netherlands', code: 'NL'},
    {name: 'Netherlands Antilles', code: 'AN'},{name: 'New Caledonia', code: 'NC'},{name: 'New Zealand', code: 'NZ'},{name: 'Nicaragua', code: 'NI'},{name: 'Niger', code: 'NE'},
    {name: 'Nigeria', code: 'NG'},{name: 'Niue', code: 'NU'},{name: 'Norfolk Island', code: 'NF'},{name: 'Northern Mariana Islands', code: 'MP'},{name: 'Norway', code: 'NO'},
    {name: 'Oman', code: 'OM'},{name: 'Pakistan', code: 'PK'},{name: 'Palau', code: 'PW'},{name: 'Palestinian Territory, Occupied', code: 'PS'},{name: 'Panama', code: 'PA'},
    {name: 'Papua New Guinea', code: 'PG'},{name: 'Paraguay', code: 'PY'},{name: 'Peru', code: 'PE'},{name: 'Philippines', code: 'PH'},{name: 'Pitcairn', code: 'PN'},
    {name: 'Poland', code: 'PL'},{name: 'Portugal', code: 'PT'},{name: 'Puerto Rico', code: 'PR'},{name: 'Qatar', code: 'QA'},{name: 'Reunion', code: 'RE'},{name: 'Romania', code: 'RO'},
    {name: 'Russian Federation', code: 'RU'},{name: 'RWANDA', code: 'RW'},{name: 'Saint Helena', code: 'SH'},{name: 'Saint Kitts and Nevis', code: 'KN'},{name: 'Saint Lucia', code: 'LC'},
    {name: 'Saint Pierre and Miquelon', code: 'PM'},{name: 'Saint Vincent and the Grenadines', code: 'VC'},{name: 'Samoa', code: 'WS'},{name: 'San Marino', code: 'SM'},
    {name: 'Sao Tome and Principe', code: 'ST'},{name: 'Saudi Arabia', code: 'SA'},{name: 'Senegal', code: 'SN'},{name: 'Serbia and Montenegro', code: 'CS'},{name: 'Seychelles', code: 'SC'},
    {name: 'Sierra Leone', code: 'SL'},{name: 'Singapore', code: 'SG'},{name: 'Slovakia', code: 'SK'},{name: 'Slovenia', code: 'SI'},{name: 'Solomon Islands', code: 'SB'},
    {name: 'Somalia', code: 'SO'},{name: 'South Africa', code: 'ZA'},{name: 'South Georgia and the South Sandwich Islands', code: 'GS'},{name: 'Spain', code: 'ES'},
    {name: 'Sri Lanka', code: 'LK'},{name: 'Sudan', code: 'SD'},{name: 'South Sudan', code: 'SS'},{name: 'Suriname', code: 'SR'},{name: 'Svalbard and Jan Mayen', code: 'SJ'},{name: 'Swaziland', code: 'SZ'},
    {name: 'Sweden', code: 'SE'},{name: 'Switzerland', code: 'CH'},{name: 'Syrian Arab Republic', code: 'SY'},{name: 'Taiwan, Province of China', code: 'TW'},{name: 'Tajikistan', code: 'TJ'},
    {name: 'Tanzania, United Republic of', code: 'TZ'},{name: 'Thailand', code: 'TH'},{name: 'Timor-Leste', code: 'TL'},{name: 'Togo', code: 'TG'},{name: 'Tokelau', code: 'TK'},
    {name: 'Tonga', code: 'TO'},{name: 'Trinidad and Tobago', code: 'TT'},{name: 'Tunisia', code: 'TN'},{name: 'Turkey', code: 'TR'},{name: 'Turkmenistan', code: 'TM'},
    {name: 'Turks and Caicos Islands', code: 'TC'},{name: 'Tuvalu', code: 'TV'},{name: 'Uganda', code: 'UG'},{name: 'Ukraine', code: 'UA'},{name: 'United Arab Emirates', code: 'AE'},
    {name: 'United Kingdom', code: 'GB'},{name: 'United States', code: 'US'},{name: 'United States Minor Outlying Islands', code: 'UM'},{name: 'Uruguay', code: 'UY'},
    {name: 'Uzbekistan', code: 'UZ'},{name: 'Vanuatu', code: 'VU'},{name: 'Venezuela', code: 'VE'},{name: 'Viet Nam', code: 'VN'},{name: 'Virgin Islands, British', code: 'VG'},
    {name: 'Virgin Islands, U.S.', code: 'VI'},{name: 'Wallis and Futuna', code: 'WF'},{name: 'Western Sahara', code: 'EH'},{name: 'Yemen', code: 'YE'},{name: 'Zambia', code: 'ZM'},
    {name: 'Zimbabwe', code: 'ZW'}];

    //=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-PROFILE PICTURE FUNCTIONS=-=-=-=-=--=--=--=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

    $scope.takeNewPhoto = function(){
      $foodieUtils.cameraActionSheet(function(index){
        if(index == 0)
        {   
          Camera.takePicture().then(
            function(imageURI) {     
              $scope.createImage(imageURI);   
            }, 
            function(err) {
              $foodieUtils.alert("No image","No image were uploaded");
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
              $foodieUtils.warning("No image","No image were uploaded");
            }
          );
        }
      });
    }



    $scope.createImage = function(file_uri){
      $jrCrop.crop({
          url: file_uri,
          width: 160,
          height: 160,
          title: 'Crop image'         
      })
      .then(function(canvas) {
          // success!    
          $scope.profileDetails.fooducer_image = canvas.toDataURL("image/png");
          $scope.saveChanges($scope.profileDetails, 1);
      }, function(err) {
          // User canceled or couldn't load image.
          $foodieUtils.alert("Crop error","Sorry we cannot successfully crop your photo.");
      });
    } 


    // $ionicModal.fromTemplateUrl('templates/modal/modal-profpic.html', {
    //   scope: $scope,
    //   animation: 'slide-in-up'
    // }).then(function(modal) {
    //   $scope.modal = modal;
    // });
    // $scope.openProfpicModal = function(srcstring) {    
    //   $scope.modal.show();
    //   $scope.createImage("data:image/png;base64," + srcstring);
    // };
    // $scope.closeProfpicModal = function() {
    //   $scope.modal.hide();    
    //   $scope.new_image = "";
    // };






/*============================== MAP ===========================*/

  $scope.initializeChangeLocationMap = function(obj) {
    changeLocationMapObject = new Object();
      try
      {
        changeLocationMapObject = new google.maps.Map(document.getElementById("ChangeLocationMap"), {
          center: new google.maps.LatLng(obj.fooducer_location_latitude, obj.fooducer_location_longitude),
          zoom: 16,          
          disableDoubleClickZoom: true
        }); 
        $scope.addOrReplaceMarker(new google.maps.Marker({position:new google.maps.LatLng(obj.fooducer_location_latitude, obj.fooducer_location_longitude)}));

        google.maps.event.addListener(changeLocationMapObject, 'dblclick', function(event) {
          $scope.addOrReplaceMarker(new google.maps.Marker({position:new google.maps.LatLng(event.latLng.lat(), event.latLng.lng())}));
          obj.fooducer_location_latitude = event.latLng.lat();
          obj.fooducer_location_longitude = event.latLng.lng();
        });
      }
      catch(err)
      {        
        $foodieUtils.alert("Unsuccessful requestasdasd","Unable to fetch map data from the internet" + err,function(){
          $scope.isMapShown = false;
        });
      }    
      $ionicLoading.hide();    
  }

  $scope.saveNewLocationMap = function(){
    $scope.saveChanges($scope.profileDetails, 4);
    $scope.closeLocationMapModal();
  }

  $scope.addOrReplaceMarker = function(itm){
      if(markers.length == 0)
      {
        markers.push(itm);
        itm.setMap(changeLocationMapObject);        
      } 
      else
      {
        markers[markers.length - 1].setMap(null);
        markers.push(itm);
        itm.setMap(changeLocationMapObject);
      }   
    }

    $ionicModal.fromTemplateUrl('templates/modal/modal-change-location.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modalLocationMap = modal;
    });
    $scope.openLocationMapModal = function(srcstring) {    
      $scope.modalLocationMap.show();
      $scope.initializeChangeLocationMap($scope.profileDetails);
    };
    $scope.closeLocationMapModal = function() {
      $scope.modalLocationMap.hide();   
    };

    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.modal.remove();
      $scope.modalLocationMap.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
      // Execute action
    });



    // $scope.createImage = function(srcstring){
    //     var canvas = document.getElementById('profPicCanvas');
    //     var context = canvas.getContext('2d');
    //     var img = new Image();
    //     img.onload = function () {
    //       if(img.height > img.width)
    //         {
    //           var y = 0 - ((((canvas.width/img.width)*img.height) - canvas.height)/2);
    //           context.drawImage(this, 0, y, canvas.width, ((canvas.width/img.width)*img.height));
    //         }
    //       else
    //         {
    //           var x = 0 - ((((canvas.height/img.height)*img.width) - canvas.width)/2);
    //           context.drawImage(this, x, 0, ((canvas.height/img.height)*img.width), canvas.height);
    //         }
    //       $scope.new_image = canvas.toDataURL("image/png");
    //     }
    //     img.src = srcstring;        
    // }

    $scope.saveChanges = function(object, flag){
        $ionicLoading.show();
        var edit_item = {api_key: Token.api_key, user_ID: Token.user_ID, fooducer_ID: Token.fooducer_ID, type: flag,
                        user_name: object.user_name, fooducer_company: object.fooducer_company, 
                        fooducer_about: object.fooducer_about, fooducer_fb: object.fooducer_fb, 
                        fooducer_twitter: object.fooducer_twitter, fooducer_ig: object.fooducer_ig, 
                        fooducer_website: object.fooducer_website, fooducer_contact: object.fooducer_contact, 
                        fooducer_establishment_address: object.fooducer_establishment_address, fooducer_country: object.fooducer_country, 
                        fooducer_city: object.fooducer_city, fooducer_image: object.fooducer_image,
                        fooducer_location_longitude: object.fooducer_location_longitude, fooducer_location_latitude: object.fooducer_location_latitude};

        FooducerProfile.editProfile(edit_item,
        function(successData){
          $ionicLoading.hide();
          if(successData.isAuthorized)
            {
              if(successData.result)
              {
                $foodieUtils.alert("Successful update","Details successfully updated!");
              }
              else
              {
                $foodieUtils.warning("Unsuccessful update","Details were not saved. Please double check your data.");
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
          $ionicLoading.hide();
          $foodieUtils.errorCatcher(error.status);
        });
    }




    

    $scope.changeImage = function(object){
        object.fooducer_image = $scope.new_image;
        $scope.saveChanges(object, 1);
        $scope.closeProfpicModal();
    }


  //=-=-=-=-=-=-=-=-ONLOAD=-=-=-=--=-=--=-
  $scope.getProfile();
})

.controller('FooducerAccountSettingsCtrl', function($scope, $location, $foodieUtils, Token, FooducerAccount, Signup) {

  $scope.isAvailable = false;
  $scope.getAccount = function(){
    FooducerAccount.getAccountDetails(null,{api_key: Token.api_key, user_ID: Token.user_ID, fooducer_ID: Token.fooducer_ID},
      function(successData){
        if(successData.isAuthorized==true)
        {
          $scope.accountDetails = successData.result;
          $scope.current_email = successData.result.user_email;
          $scope.current_username = successData.result.user_name;
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

  $scope.saveChanges = function(object, flag){
    // var edit_item = {api_key: Token.api_key, user_ID: Token.user_ID, foodict_ID: Token.foodict_ID, type: flag,
    //                     user_email: object.user_email, password: object.password, foodict_isPrivate: object.foodict_isPrivate};

    if(flag == 1)
    {
      //email
      var regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      if(($scope.current_email!= null && $scope.current_email!= "" && $scope.current_email == object.user_email && regex.test($scope.current_email)) && ($scope.new_email!= null && $scope.new_email!= "" && regex.test($scope.new_email)))
      {
        $scope.commitChange({api_key: Token.api_key, user_ID: Token.user_ID, fooducer_ID: Token.fooducer_ID, type: 1, 
                            user_email: $scope.new_email, password: object.password, user_name: object.user_name}, true);
        $scope.current_email = $scope.new_email;
        $scope.new_email = "";
      }
      else if(!($scope.current_email!= null && $scope.current_email!= "" && $scope.current_email == object.user_email && regex.test($scope.current_email)))
      {
        $foodieUtils.warning("Unsuccessful update","Please double check the current email field.");
      }
      else if(!($scope.new_email!= null && $scope.new_email!= "" && regex.test($scope.new_email)))
      {
        $foodieUtils.warning("Unsuccessful update","New email field must be a valid email address.");
      }
      else
      {
        $foodieUtils.warning("Unsuccessful update","Details were not saved. Please double check your data.");
      }
      
    }
    else if(flag == 2)
    {
      //password
      if(($scope.current_password!= null && $scope.current_password!= "" && $scope.current_password == object.password) && 
          ($scope.new_password!= null && $scope.new_password!= "" && $scope.confirm_password!= null && $scope.confirm_password!= "" && $scope.new_password == $scope.confirm_password 
            && $scope.new_password.trim().length > 6))
      {
        $scope.commitChange({api_key: Token.api_key, user_ID: Token.user_ID, fooducer_ID: Token.fooducer_ID, type: 2, 
                            user_email: object.user_email, password: $scope.new_password, user_name: object.user_name}, true);
        $scope.current_password = "";
        $scope.new_password = "";
        $scope.confirm_password = "";
      }     
      else if(!($scope.new_password.trim().length > 6))
      {
        $foodieUtils.warning("Unsuccessful update","Password must be greater than 6 characters");
      }     
      else if(!($scope.current_password!= null && $scope.current_password!= "" && $scope.current_password == object.password))
      {
        $foodieUtils.warning("Unsuccessful update","Please double check your current password.");
      }
      else if(!($scope.new_password!= null && $scope.new_password!= "" && $scope.confirm_password!= null && $scope.confirm_password!= "" && $scope.new_password == $scope.confirm_password))
      {
        $foodieUtils.warning("Unsuccessful update","New password and confirm password field must match and must not be null.");
      }  
      else
      {
        $foodieUtils.warning("Unsuccessful update","Details were not saved. Please double check your data.");
      }    
    }   
    else if(flag == 3)
    {
      //username
      if(($scope.current_username!= null && $scope.current_username!= "" && $scope.current_username == object.user_name) && 
          ($scope.new_username!= null && $scope.new_username!= "" && $scope.new_username.trim().length > 6) && $scope.isAvailable)
      {
        $scope.commitChange({api_key: Token.api_key, user_ID: Token.user_ID, fooducer_ID: Token.fooducer_ID, type: 3, 
                            user_email: object.user_email, password: object.password, user_name: $scope.new_username}, true);
        $scope.current_username = $scope.new_username;
        $scope.new_username = "";
      }      
      else if(!($scope.new_username.trim().length > 6))
      {
        $foodieUtils.warning("Unsuccessful update","Username must be greater than 6 characters");
      }    
      else if(!($scope.current_username!= null && $scope.current_username!= "" && $scope.current_username == object.user_name))
      {
        $foodieUtils.warning("Unsuccessful update","Please double check your current username.");
      }
      else if(!($scope.isAvailable))
      {
        $foodieUtils.warning("Unsuccessful update","That username is not available.");
      }
      else
      {
        $foodieUtils.warning("Unsuccessful update","Details were not saved. Please double check your data.");
      }  
    }
    else
    {
      $foodieUtils.warning("Unsuccessful update","Details were not saved. Please double check your data.");
    }
  }

  $scope.checkExist = function(val){
    Signup.checkExistUsername({username: $scope.new_username},
      function(successData){     
        $scope.isAvailable = !successData.result;
      }, 
      function(error) {
          $foodieUtils.errorCatcher(error.status);
      });
  }

  $scope.commitChange = function(object, alt){
    FooducerAccount.updateAccountDetails(null, object,
      function(successData){
        if(successData.isAuthorized==true)
        {
          if(successData.result)
            {
              if(alt)
              {
                $foodieUtils.alert("Successful update","Details successfully updated!");
              }
              window.localStorage.setItem("username",object.user_name);
              window.localStorage.setItem("password",object.password);
            }
            else
            {
              $foodieUtils.warning("Unsuccessful update","Details were not saved. Please double check your data.");
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

  $scope.getAccount();
});


