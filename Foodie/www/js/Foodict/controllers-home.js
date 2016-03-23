angular.module('foodie.controllers.home', ['foodie.services', 'foodie.plugins'])

.controller('HomeCtrl', function($scope, $location, $foodieUtils, Profile, Token, $cordovaFacebook) {

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
      $location.path('/tab/home/followers').replace();
    }

     $scope.viewMyFollowing = function(){
      $location.path('/tab/home/following').replace();
    }

    $scope.profileAction = function(){
      $foodieUtils.profileActionSheet(function(index){
          if(index == 0)
          {
            $location.path('/tab/home/edit').replace();
          }
          else if(index == 1)
          {
            $location.path('/tab/home/vouchers').replace();
          }
          else if(index == 2)
          {
            $location.path('/tab/home/settings').replace();
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

.controller('EditCtrl', function($scope, $location, $foodieUtils, $ionicModal, $ionicLoading, $jrCrop, Token, Profile, Camera) {


    $scope.new_image = "";
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

    $scope.genders = [{id: 0, name: "Male", value: true},{id: 1, name: "Female", value: false}];
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

    $scope.saveChanges = function(object, flag){
        $ionicLoading.show();
        var edit_item = {api_key: Token.api_key, user_ID: Token.user_ID, foodict_ID: Token.foodict_ID, type: flag,
                        foodict_username: object.foodict_username, foodict_first_name: object.foodict_first_name, 
                        foodict_middle_name: object.foodict_middle_name, foodict_last_name: object.foodict_last_name, 
                        foodict_isMale: object.foodict_isMale, foodict_contact: object.foodict_contact, 
                        foodict_country: object.foodict_country, foodict_city: object.foodict_city, foodict_image: object.foodict_image};
        Profile.editMyProfileDetails(edit_item,
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
          width: 120,
          height: 120,
          title: 'Crop image'         
      })
      .then(function(canvas) {
          // success!    
          $scope.profileDetails.foodict_image = canvas.toDataURL("image/png");
          $scope.saveChanges($scope.profileDetails, 1);
      }, function(err) {
          // User canceled or couldn't load image.
          $foodieUtils.alert("Crop error","Sorry we cannot successfully crop your photo.");
      });
    }    

    // $scope.changeImage = function(object){
    //     object.foodict_image = $scope.new_image;
    //     $scope.closeProfpicModal();
    // }


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
    // //Cleanup the modal when we're done with it!
    // $scope.$on('$destroy', function() {
    //   $scope.modal.remove();
    // });
    // // Execute action on hide modal
    // $scope.$on('modal.hidden', function() {
    //   // Execute action
    // });
    // // Execute action on remove modal
    // $scope.$on('modal.removed', function() {
    //   // Execute action
    // });



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

      // var canvas = document.getElementById('profPicCanvas');
      // var context = canvas.getContext('2d');
      // var img = new Image();
      // img.onload = function () {
      //     if(img.height > img.width)
      //     {
      //         var y = 0 - ((((canvas.width/img.width)*img.height) - canvas.height)/2);
      //         context.drawImage(this, 0, y, canvas.width, ((canvas.width/img.width)*img.height));
      //     }
      //     else
      //     {
      //         var x = 0 - ((((canvas.height/img.height)*img.width) - canvas.width)/2);
      //         context.drawImage(this, x, 0, ((canvas.height/img.height)*img.width), canvas.height);
      //     }
      // }
      // img.src = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAgAAAQABAAD//gAEKgD/4gIcSUNDX1BST0ZJTEUAAQEAAAIMbGNtcwIQAABtbnRyUkdCIFhZWiAH3AABABkAAwApADlhY3NwQVBQTAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA9tYAAQAAAADTLWxjbXMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAApkZXNjAAAA/AAAAF5jcHJ0AAABXAAAAAt3dHB0AAABaAAAABRia3B0AAABfAAAABRyWFlaAAABkAAAABRnWFlaAAABpAAAABRiWFlaAAABuAAAABRyVFJDAAABzAAAAEBnVFJDAAABzAAAAEBiVFJDAAABzAAAAEBkZXNjAAAAAAAAAANjMgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB0ZXh0AAAAAEZCAABYWVogAAAAAAAA9tYAAQAAAADTLVhZWiAAAAAAAAADFgAAAzMAAAKkWFlaIAAAAAAAAG+iAAA49QAAA5BYWVogAAAAAAAAYpkAALeFAAAY2lhZWiAAAAAAAAAkoAAAD4QAALbPY3VydgAAAAAAAAAaAAAAywHJA2MFkghrC/YQPxVRGzQh8SmQMhg7kkYFUXdd7WtwegWJsZp8rGm/fdPD6TD////bAEMABgQFBgUEBgYFBgcHBggKEAoKCQkKFA4PDBAXFBgYFxQWFhodJR8aGyMcFhYgLCAjJicpKikZHy0wLSgwJSgpKP/bAEMBBwcHCggKEwoKEygaFhooKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKP/CABEIAKAAoAMAIgABEQECEQH/xAAbAAACAwEBAQAAAAAAAAAAAAAEBQIDBgEAB//EABkBAAIDAQAAAAAAAAAAAAAAAAIEAAEDBf/EABkBAAIDAQAAAAAAAAAAAAAAAAIEAAEDBf/aAAwDAAABEQIRAAAB11dgPJdMkX7fIYKY2WmfunDBic4TqdnWIQ66GLkxjuGOC1lgb7nqqXueKgcxqEizHHQLBnOC6+2TN8jFdgn1aioOrDr6KZfB+mLeaP1X9X0fxj66uRfORCDqNAix1qqCZtBS1pbVWMH3MMtMblPqXxs6o8VY3iHYaaJqK21MoL6N8134VuowxK5bJc57mSE9jM6HYDdMC/CdKiPg/wBy+W2VxobRfo2cN9KFHaCWPzLeZuxpJtjuVnn9tjKvms220W3Xbh7rrvqrZLPnX0HPXslBf1XsUtaBy0LoEnfJVFuTB+bXw2Oi+1hXLnbXXCkSukClmIZi88b8CyXFFfoejlgkqtIWsNAsTXJJtqfK2OmwxXtS1TVLThQhdjAsAyxCYq7tKZZporYxXxPowfX8OqLWNy16WLnldGanMfsFI7ure39blBXS7CosmpKV8rHseTpagaE0Bny+yLAv1EI/GoaRIYY7StoRhpDlN0l4l/V5krK/HsQgcJiMKHJKzz1K0XaVXcI5vTGgcAQab58xC6fKi6Vm64uG+XuGG+YJzyO8kuaSaLrh5sHOqxRwrTZt2q2iKEZc/omYTV5Loc6yy2ttSd/eXXq5jSv/xAAqEAACAgIBAwQBBAMBAAAAAAABAgADBBESEyEyBRAiMTMUFSAjBiRBNP/aAAgBAAABBQKMRqojoNYqrW4dPUfwD7/gnljxvKj8tnl/FcpFtqvVg+itt7IlFvVN+zYP4NeBP154nOZq8TONVqZddzfxyRq+tSYvxVt8Ur72gLaIIToXZX9jlif+xLgR1mrb0nNF6fwtAbJrXjOXEZN26j/47/MGAz1CxlVnJmzN7gjQOZjXGq3HtFtXvZoZbWaNhPLW6iP9TJEWfUz7udm/dROxhEUz0C3ab9umJ6gqVSupurZWedNTaprLIcGgn9vomR6dX0rfJKiw6DRcZ2P6Mz9MZbjFAv3/AI8BCZ6p6jyjKxl+I1orxchYKbolVkUaHswDLm19PKxqh0hSNrXOnFqEzqh0nTR/x/svrHqPIlzOrOrOrOpOpOZnKBtkz1esfu65VaGq6qyamvbIXa5aBbKrnx6WO/YeAi/b+QgjeVflZLav9w/E1XB7lb43s06nyxXeeq16yb3SnElVbWEeMX7fziRz3q+/t8+vjk9PY6J2OylYcVS1KcGzU3bj44uR14WYtK11VHYgPd/OVwn5VSr7zq+cT6sMI/rqPyeN5PX1JjV9Ov1zF6ORjNypxzH7MJZ9yuD7HaursMx+OMhjxmfSd2tbso29WJtei09axDZ6fS79Gk97vMR/CJ4p9t4N2r9Vf5VtLC8LvK7HYuZiryfquJ1XmVyuppBrrpPe78az7p3F/EnaNkRskatvR3tsBrUgxuMbQDP39NHybuu5uW18buwPPa81WdVOPKuWWrXjKTotqMS0qQs+RZyzoROG5xAnHoYrX8IvB6esJaxsT7YRO8I7Csay9Akwz6NQ40Vpu8+xmJTyfNt5ZFjFpguZTZynYxfJu0rg8j2mX+Sf9Cl3yl4VUp8B9air1H7U1dQAVnYxG0UfRpu3Nzl2QzfyJ7ZPlvcEQ6apSaqe01ErNh9UYU103v8AtqJuL3Kdpyivon6DfFXE3shplH5T/mOnUs4iDX6mL/XTmv1stBHiD23CZra216m5vS01lpk/l9sR7Fvu3YlHYUryf1DI4U1pqfQrG4o1D7Puf//EACMRAAICAgICAgMBAAAAAAAAAAABAhEDIRASMUEEEyIyUVL/2gAIAQIRAT8BO39F/eWLRLb5RITIvQ3Wxzss7cpky6FmiieS1o6SFikx42R4tjch2zqRjei14L4a6yob5Z6MP+RreuOutn13FzZixd2Vs9kiS0Rf5aPfHhE8ya6owSpsepDJGTJFMWZIw5O8exJ2TerItSVmPzQsjq7PtlfkWbI1sshHs6Iqlx8vJS6ojJx8Ecvs+zq6FNKZ3vXGCvJZkyqCMku3F0ZcS/eiWeF2fGryuMS0N0jNMvn/xAAjEQACAgEEAgMBAQAAAAAAAAAAAQIRAxIhMUEEEBMiQhRR/9oACAEBEQE/AUkPHe9jjXtIlBsS0xr32RHHtk1TojHU6I46KNJOOllmmjFXI99kSxTe5hx1Lc1IeRCmjNwK2VESiJxXB8qNf2KfJRvZL7RIQUUX7T3G+yMlW4mRlUlRlnplpMmTQrHwdESD7PyLgQjRJuycW4pM6ERMWGckfzyZOOiVCexFGRTg6ZGR8Uf8F40H0S8KEd0iib0onyWePHVKyeNT5JYKFG9zGie0fWW7JGPG5sxQ0lFEMn5IQkZuKGZHbOWYIdle/wD/xAAyEAABAgQFAgUDAgcAAAAAAAABAAIQESExAxIgQVEicRMwMmGBBEKRFFIjM2JyobHB/9oACAEAAAY/AldYYnVEzQcN03+7UE1FDW5uVpkVRrApnDaWolrWgBfxCfZEkz0mV0QsoPUh4lQuk6nIAGvCt8Ih7JtOyL3A5AnAW2jVHKqFVKo5ScqFZHHr0uB2U2+pCZknZfyvlTj7RqqS+VaRg17bgzTXjfQecs0BPqgQLpw3TYyFhHlWUpQCOGftjdZ2fzH0TTdBUuj4laqZaZ91Y/lOLS6ckY2hIRxDvA4WA7p3cIe4X2FfaquGgg7rEYNigFXU/sjgYR6dzzCysrawG1nVSXS786KoBP8ADpO/lyTCdgU1jGCvKLThyLd4UcQpfqTPghZHuzBM7J2HlzOxN+ISajExOmtkUHC4TnZauQTH8J4IplRabgoSv5BMHP8A2wpCRjey914g9OJ/tN7aG9tBU0f6jKFFJTdtEOkJrZPNJs6lhjCEzKHeDYGAC7rDw+BOFHUXrCqBLmA9yrr1JzSSU4Nu0kCDXcQ7Qf2UyhSy6gsxw2uKFA3iFol7rNE1MRzCzlTDCILKL0FEVqrlOkZlViALlYbW+lsLqsGs+55mVPhZwwudu0FU+jx1IfS4rd5nQArJoHMZJz+ekJ79GcimyIFmdIUof81jtEAIMGw0ZR8ou2a2am81Kn5IPtGaM96/Cc39phRDCw97p+Ga1kFUL203V4jtGW28MUs9M4f5KcRUCkMouVTyJzkEYyaybD6ncItbSl1Lhey6DU2hMrMbnRRf/8QAJhAAAgICAQQCAgMBAAAAAAAAAAERITFBURBhcYGRoSCxwdHw4f/aAAgBAAABPyEmaCzCQTochKUxJidSRZ7f8CthIQun2hkvc+x0uT8nyqyKQQq7U2jsdsItM1LYTfYgQvlGAujcCbSM5ggR7h8qwZIfYvxoq3pEHD2YeKaB4A2RE8KVYk+J/DqLmDXYiaJQhTeRuZI+RtTN3AuNvksZ08MSK2Y7i/BoEUdCZyN1kaRthveUIJ44DNLyXQsKo7DaoRdLYkwv5IJygRan0sCkTaHsQBYSlkknpAMsjI3jOoGFtttZZK+M6GTlSK9kc9ufiejCxXaMbN19id0ShIpgvYmySeUIiNk8GvDQ9+5JdEnKWiZO6yRHlbGIFoUXBHJItM2lIfmjbkcaQhGZmrE8kk+SoUUxRnmCu9di+xvknr0LvRPYsUQKW4R4bNzsjbCJDSZKY5z7B13H2JYfhFVnv1xFJDIoU1IoZYsxhQhCUDkxSoJPmOhXGrNyPhpcf0OVCEsBLwF2BxZPoN5gmEPCHWiRU0aJobcbSNWPiglS6FEUM4jGIHy7wNwifLGWDjURlGo1Gv2HkPLgN0SA8pG0TgiQwLTQ2A47TCgU4VoBtwtLIirmRP2vesRkDL7ly2Yeos0fJdNuXyIlSzfyNFCmUUpffojpySRRGWYSvOCoMILNinkeiRAaHCtrbJlE2VOtkSN5K9hCTMhIeHS1oRj9KEhDUjIxUtFpbZHpxK2PXO3TPGxOORYiyjMzuQn0tIs+aE8Al7yror5WVJokip6ITuRQlnMUzPSX6Ub4yLStsRmqPh03b6Ex7+zGFOUz9MRocn2TqZM+LsQgq9yMaTTZUeoA2Imoo7wgWHcCl5mj5RKgk8xA1Ds7pEHhwbshDcF9iMirFjAyORLt5uFS2JLyI2gwkOg155hIMsX1VM1Tfkc+P6IeJZSSBLgEmRX6HzMKEoIWTb6V6ecI4IYcHge5Q2aZD3GyDSt0kOzZitwY1qglGSYJ+hbz5KYV2sDfsSIp3wRl4F9wZJKFR2bEHkeWN2vTOe/+g3RdPsJh8ozoSEORwAnJ/gZ5Q0iE40hKV74CgoaL4k2H8EJKruRkWf3DrIrFyTbo0DgRFJC1THAYnBtwhvd4nwJgirL5EROafJNeC3mHORFG4Y4x5LOVOclRLDMCpSv8ZYYH7YOizZrOg8t7F0RnDb4Kz38wq3aNXvjaENCH5RnpJYqB5ikLU26Nz/Qto4kBwhcuRlxsoNqwnAsCHfv8CTeeP0I7iWy/YyMmKCVuEY+I+hoS/oEKlLBDKE1CSNn80oKKOpMEarpDwYSFCOIboS+aOEMirSdGiieFskVqqfZHWxJNwK2Nl/QIgSOMZpTZyf/aAAwDAAABEQIRAAAQ8zi3aVE3WdjdgwUxJJdMEF9htt4CuqCIvyWwYuxzApOSoFAmCStO4t6N4VdMdh/ch3KWLMPv9BaiC9Y3wFkD0J5FraOfCSCqKOwB/8QAHhEBAQEAAwADAQEAAAAAAAAAAQARITFBEFFhcZH/2gAIAQIRAT8QdzgjLgnz+IdN+GBzZXLF1LPh9y2wOLQWTVs5hW7vmyNcLXJYwsRkWdG5C8aD5fSz2D6JXkO632y8Fnwfg8uNuK1izmPEmbs9vcf8kQqTyHr3+WUn8mxeiOQsgwuhIb/iA5XiMsbEjRCOCR4gQvVyfNgIyHoWb+llBIISArrasw5UxziJN+AFNU+gsm+rmUl4tiNXcaLEe24lI8IgLUjYRm905+4sy/dyT4Xl6zH4/8QAHxEBAQEBAAICAwEAAAAAAAAAAQARITFBEFFhcZGh/9oACAEBEQE/EEcWxY/xIEtt9TrwhwtNfcfA4I4MmicjWZgiOB8c36FmK6bJE290jomb3k+bD5sh82O4Lhdt2CeWf3V6I834jqr8o0MLZ5YCcZbhDcv7k1P5LQjeYYBA+BjxeWXCSrqXbpNwjdYhzS7dGX2XmII1xdDN2UocZZ6y8o2B4LBD7mby9FlFEfyA8P5bUA24koYn0+orDfUMsUDIq7JPAfEOwj6sCPwdSKhyGYJJNJTIfU+MsFXrkCLL/8QAJBABAAICAgICAwEBAQAAAAAAAQARITFBUWFxgaGRscEQ0eH/2gAIAQAAAT8Qmf5St8wqkxtkzEj7qBbCSSoHZFWC2H5iyAR6SWEFo/6VPFgUMiMLe37j/wAlcIf7lCJVWQzcICIWlC4OALQG8y8b2L64xAPVwVhunMyKlAqwcRXBgQBbEhdJe5iJVoI5I4CSZuXxHEAyrqZI1CGEQlkuXL/w3o3YwZah1YbLkPctd2gOWLwkLssFWiozFxQ7oLieguFulqMlGcWiWjooL1FFxWqVt5NpRY4sp2r7iqHW3HuV1tWXXUCHcg7MQkx5l0ypQKAeRjmUUrIuSINHyJa9wWdV5tXmpwAWPm2ozOF/kyEUpBXRNbIoT5k3DOK+CGXX4uv1L5LisiPMPItepUm24vRKzdgHCc/UQwBwikjGppMIOC6L+YeK0GvuoJNwKbeYDeoAc5lkgtkZEEuPgceeB9S3MsRVBFKVuVtlAIHcKUXt4J7H3WJZUhtaQhTHkSZ6pdc9eZcGK2My11S9tvb+p6RrxcCMvwS+fyuwDHoP7EIsKrll6aWMSrCQF8SocQNDmbmEJlj+q3CtBimw74mzzaWZ5inCG3R/7AJkGLTfxClWPFRq2Cm8Kl9EGwalP3labljaVaIi0GhNBCYAFquAnmEVz5nUt835gjbg7GCsQ0qIdb3dn+T8RN/7ijZXK5gP+VirS8MF0Bp3V4g16jhlYsPCA0SvArwQUsK6mrQu5dwuyqjpZm2pRlLDSFdyzmaZtWT4PuIwPpqZBNe/8MOKoWY6i+YOYqCcwVy3HsdRb7ZchPlizZ9RJZlK0IAHSlZmEMKOZyFMPiskm2i7IGu0l2Y/5ERDLeY64YMjsZRYyzhXGEaIVseuE3HMcGpqNu3P+xr+zQjYB5ljaEkmKNW9WzFBaJm/nsq8VHZtIoDG8y3N5YBHw8zYlrHNwDmnCyGvLFm+YZvovgExPzLh17Y3N3DU2Hc0HMGz6l29I9rUrjwv7JYhaaikuQIZZq+5kQxVeogG6GXo+uuAcoHEfbdMsq+xeXNXpgmsewNLAl4HG40dhjaI1LEA2zK/8nmIjWk/MR0nsH6gwWLl18phTtmSd3GAxKxNg8QWPEQBy8vEVh5LZVRRqw8kBnF8Su5gy0EzqzwX4j2tTRo6JYzS7PKL+4O6QuY34Z6ExYTDoEwRbehZYPmeaUEBVoXLhUV9Lb9EGqvPU4EN8EvsCZuB4BUckBjZqcmq7ZQKSxCnFwoqx8wjYu2tezwuIySxSYMspi8XB1wJHknoKuYiVC4/VLAeZiXf+IsBtAhpst7cD6I9bLT7hUTfkGyK7fbnZhxTNhA0utdxQVaAOyJCTAHEYqD4bdpxKZ0LpeT8zKneJZjmx8y4O4qPT/g8AtgV0NF5ZpQqBTLHl7Ao2GgvNeiUZDuLG6rgmSwtSMPaV7qW6g9YhOivRuEsXgNGMEAk1Kb35j2Yg0w2ApBwcP1X4h7dHrBsb5QN45iZli8LcxQhSLqWayllhqZZvamX/koFYtYAXriIVX1BYvB0HL+JiaGh42HyuZgmwW5liuriO/FriURe1AyvBCYsNTTJ+LoiYVfZ37lE6HADg4in9Aj1yFMhN2epg6TKfzMUOkNurH+ooIGjiXAjyIZwLAdGZwPlEa1A1KGwv0MUfyJo5fyIRszxMETCWWQFVQ8zKr+IyttkMe5k/PF2bfm/xKS2HPV2zLBsLlqq1uc+R4mYyJWB4rOcQZDUy4pqqoDfaEXwtYirs0ldZjpl8QbNbbgG0AfPfxMDaAXatbgGIqTDmTE5BUIVyvg5mEZ0BqzAl8J3erTb+5mWgrCKU2XSMQYqhxHgHTw+v+ShZEsznrw7h7WQP4iGR7/Utw0UJVlQ/CmXeiYJDxKLQBKYaY7TUllaB+n4YSeivebGAG6iMKO7Ql/AbV58n1/ZmNl4iLs6o+4AFbwP7lHNmsVdczKCERNvqYcjfcVWkq8K5lEWzS1OQPN3BpAHk5gC+7VQwOKGnSqwx8RZOUuD/wAOn/dfM7DCsNHHpMR3gaUKp4u4MQNYoSBn4hN9O9d1v7v8Q1y1sti4iTHSnyP8gjqCgmLgxLaTim+K5j0xKSMw3YCWpdFy8WlmKxE1me1hFxwm+6lb5qOBnUMEVhTI4dDgxzG3Vaqs46jqtt6iYggoBY6lAC9RgPZ6NhzBA2vt8xEqKyIlrIH4CHW27lmpQMzmEZE//9k=";
      //img.src="ss.jpg";  
      //img.src="img/uploadphoto.png";
   

  // $scope.loadDefault = function(srcstring){
  //     var canvas = document.getElementById('profPicCanvas');
  //     var context = canvas.getContext('2d');
  //     var img = new Image();
  //     img.onload = function () {
  //         if(img.height > img.width)
  //         {
  //             var y = 0 - ((((canvas.width/img.width)*img.height) - canvas.height)/2);
  //             context.drawImage(this, 0, y, canvas.width, ((canvas.width/img.width)*img.height));
  //         }
  //         else
  //         {
  //             var x = 0 - ((((canvas.height/img.height)*img.width) - canvas.width)/2);
  //             context.drawImage(this, x, 0, ((canvas.height/img.height)*img.width), canvas.height);
  //         }
  //     }
  //     //img.src = "data:image/jpeg;base64,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";
  //     //img.src="ss.jpg";  
  //     img.src=srcstring;
  // } 



//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-ONLOAD EXECUTIONS=-=-=-=-=--=--=--=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

    $scope.getProfileDetails();
})

.controller('SettingsCtrl', function($scope, $location, $foodieUtils, $ionicModal, Token, Account, Signup) {

  $scope.isAvailable = false;
  $scope.getAccount = function(){
    Account.getAccountDetails(null,{api_key: Token.api_key, user_ID: Token.user_ID, foodict_ID: Token.foodict_ID},
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

  $scope.togglePrivacy = function(object){
    if(object.foodict_isPrivate)
    {
      $foodieUtils.confirm("Privacy Settings","By enabling this setting, your Posts will be private and you will approve follow requests. Enable this setting?",function(res){
        if (!res){
          object.foodict_isPrivate = false;
        }
        else{
          $scope.commitChange({api_key: Token.api_key, user_ID: Token.user_ID, foodict_ID: Token.foodict_ID, type: 3, user_email: object.user_email, password: object.password, foodict_isPrivate: object.foodict_isPrivate});
        }
      });
    }
    else
    {
      $foodieUtils.confirm("Privacy Settings","By disabling this setting, your Posts will be visible to all. Continue?",function(res){
        if (!res){
          object.foodict_isPrivate = true;
        }
        else{
          $scope.commitChange({api_key: Token.api_key, user_ID: Token.user_ID, foodict_ID: Token.foodict_ID, type: 3, user_email: object.user_email, password: object.password, foodict_isPrivate: object.foodict_isPrivate});
        }
      });
    }

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
   //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.termsModal.remove();
  });
  
  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    // Execute action
  });
  
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  });

    
    // Account.updateAccountDetails(null, object,
    //   function(successData){
    //     if(successData.isAuthorized==true)
    //     {
    //       if(successData.result)
    //         {
    //           $foodieUtils.alert("Successful update","Details successfully updated!");
    //           window.localStorage.setItem("username",object.user_email);
    //           window.localStorage.setItem("password",object.password);
    //         }
    //         else
    //         {
    //           $foodieUtils.warning("Unsuccessful update","Details were not saved. Please double check your data.");
    //         }
    //     }
    //     else
    //     {
    //       $foodieUtils.confirm("Expired Account","To continue using Foodie, please re-login your account. Re-login now?",function(res){
    //         if (res){
    //           //true
    //           window.localStorage.clear();
    //           $location.path('/login').replace();
    //           Token.destroyToken();
    //         }
    //       });
    //     }
    //   },
    //   function(error){
    //     $foodieUtils.errorCatcher(error.status);
    //   });
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
        $scope.commitChange({api_key: Token.api_key, user_ID: Token.user_ID, foodict_ID: Token.foodict_ID, type: 1, 
                            user_email: $scope.new_email, password: object.password, foodict_isPrivate: object.foodict_isPrivate, user_name: object.user_name}, true);
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
          ($scope.new_password!= null && $scope.new_password!= "" && $scope.confirm_password!= null && $scope.confirm_password!= "" && $scope.new_password == $scope.confirm_password))
      {
        $scope.commitChange({api_key: Token.api_key, user_ID: Token.user_ID, foodict_ID: Token.foodict_ID, type: 2, 
                            user_email: object.user_email, password: $scope.new_password, foodict_isPrivate: object.foodict_isPrivate, user_name: object.user_name}, true);
        $scope.current_password = "";
        $scope.new_password = "";
        $scope.confirm_password = "";
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
      $scope.commitChange(edit_item, false);
    }    
    else if(flag == 4)
    {
      //username
      if(($scope.current_username!= null && $scope.current_username!= "" && $scope.current_username == object.user_name) && 
          ($scope.new_username!= null && $scope.new_username!= "" && $scope.new_username.length > 6) && $scope.isAvailable)
      {
        $scope.commitChange({api_key: Token.api_key, user_ID: Token.user_ID, foodict_ID: Token.foodict_ID, type: 4, 
                            user_email: object.user_email, password: object.password, foodict_isPrivate: object.foodict_isPrivate, user_name: $scope.new_username}, true);
        $scope.current_username = $scope.new_username;
        $scope.new_username = "";
      }      
      else if(!($scope.new_username.length > 6))
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
    Account.updateAccountDetails(null, object,
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
})

.controller('FollowersCtrl', function($scope, $location, $foodieUtils, Follow, Follower, Token) {

  $scope.openProfile = function(foodict_ID){
      if(Token.foodict_ID == foodict_ID)
      {
        $location.path('/tab/home').replace();
      }
      else
      {        
        $location.path('/tab/home/otherprofile/' + foodict_ID).replace();
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

.controller('FollowingCtrl', function($scope, $location, $foodieUtils, Follow, Following, Token) {

  $scope.openProfile = function(foodict_ID){
      if(Token.foodict_ID == foodict_ID)
      {
        $location.path('/tab/home').replace();
      }
      else
      {        
        $location.path('/tab/home/otherprofile/' + foodict_ID).replace();
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


.controller('HomeOtherProfileCtrl', function($scope, $location, $foodieUtils, $ionicLoading, Token, OtherProfile, Follow, Profile, $stateParams, $ionicNavBarDelegate) {
   
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
    $location.path('/tab/home/otherprofile/'+foodict_ID+'/followers').replace();
  }

  $scope.viewFollowing = function(foodict_ID){
    $location.path('/tab/home/otherprofile/'+foodict_ID+'/following').replace();
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


















.controller('HomeOtherFollowersCtrl', function($scope, $location, $foodieUtils, Follow, Follower, Token, $stateParams) {

  $scope.openProfile = function(foodict_ID){
      if(Token.foodict_ID == foodict_ID)
      {
        $location.path('/tab/home').replace();
      }
      else
      {        
        $location.path('/tab/home/otherprofile/' + foodict_ID).replace();
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












.controller('HomeOtherFollowingCtrl', function($scope, $location, $foodieUtils, Follow, Following, Token, $stateParams) {

  $scope.openProfile = function(foodict_ID){
      if(Token.foodict_ID == foodict_ID)
      {
        $location.path('/tab/home').replace();
      }
      else
      {        
        $location.path('/tab/home/otherprofile/' + foodict_ID).replace();
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


.controller('VouchersCtrl', function($scope, $location, $foodieUtils, $ionicLoading, Token, Voucher, $ionicModal, $cordovaBarcodeScanner) {

  //list visibility
  $scope.available_isVisible = true;
  $scope.expired_isVisible = true;
  $scope.claimed_isVisible = true;


  //delete button visibility
  $scope.expired_delete = false;
  $scope.claimed_delete = false;


  $scope.vouchercode = null;
  


  $scope.getMyVouchers = function(){
    Voucher.getMyVouchers({api_key: Token.api_key, foodict_ID: Token.foodict_ID},
      function(successData) {
        if(successData.isAuthorized)
          {
            $scope.voucher_available = successData.result.voucher_available;
            $scope.voucher_expired = successData.result.voucher_expired;
            $scope.voucher_claimed = successData.result.voucher_claimed;
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

  $scope.deleteVoucher = function(voucher, type){
    $foodieUtils.confirm("Delete voucher","Deleted vouchers cannot be recovered. Continue?",function(res){
      if(res)
      {
        Voucher.deleteVoucher({api_key: Token.api_key, foodict_ID: Token.foodict_ID, voucher_ID: voucher.voucher_ID},
          function(successData) {
            if(successData.isAuthorized)
              {
                if(type == 1 && successData.result)
                {
                  $scope.voucher_expired.splice($scope.voucher_expired.indexOf(voucher), 1);
                }
                else if(type == 2 && successData.result)
                {
                  $scope.voucher_claimed.splice($scope.voucher_claimed.indexOf(voucher), 1);
                }
                else
                {
                  $foodieUtils.alert("Deletion failed","Sorry you can't delete that voucher.");
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
    });    
  }

  $scope.toggleExpiredDelete = function(){
    $scope.expired_delete = !$scope.expired_delete;
  }

  $scope.toggleClaimedDelete = function(){
    $scope.claimed_delete = !$scope.claimed_delete;
  }

    $ionicModal.fromTemplateUrl('templates/modal/modal-voucher.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.vouchermodal = modal;
    });

    $scope.openVoucherModal = function(voucher) {
      $scope.vouchermodal.show().then(function(){
        $scope.focusedVoucher = voucher;  
        $scope.vouchercode = voucher.voucher_ID + "-" + Token.foodict_ID + "-" + voucher.voucher_code;  
      });
    };
    $scope.closeVoucherModal = function() {
      $scope.vouchermodal.hide();    
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.vouchermodal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
      $scope.focusedVoucher = null;   
      $scope.vouchercode = null; 
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
      // Execute action
    });

  //=-=-=-=-=-=-=-ONLOAD-=-=-=-=-=-=-=-=-=
  $scope.getMyVouchers();
})



.controller('HomeBitersCtrl', function($scope, $location, $ionicScrollDelegate, $stateParams, $ionicModal, $foodieUtils, PostDetail, Token) {
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
        $location.path('/tab/home').replace();
      }
      else
      {        
        $location.path('/tab/home/otherprofile/' + foodict_ID).replace();
      }
  }

  /*========================== ONLOAD ============================*/
  $scope.getAllBiters();
})
.controller('HomeCommentCtrl', function($scope, $location, $ionicScrollDelegate, $stateParams, $ionicModal, $foodieUtils, Comments, Token) {
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
        $location.path('/tab/home').replace();
      }
      else
      {        
        $location.path('/tab/home/otherprofile/' + foodict_ID).replace();
      }
  }


  //ACTIONS
  $scope.reportThis = function(comment){
    $foodieUtils.confirm("Report comment","You are about to report an item. Continue?",function(res){
      if (res){
        $scope.openModal();
      }
    });
  }
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

    //Modal
    $ionicModal.fromTemplateUrl('templates/modal/modal-report.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });
    $scope.openModal = function() {    
      $scope.modal.show();
    };
    $scope.closeModal = function() {
      $scope.modal.hide();    
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


  /*================= ONLOAD ====================*/
  $scope.getAllComments();

})

.controller('HomePostDetailCtrl', function($scope, $location, $stateParams, $foodieUtils, $ionicScrollDelegate, $ionicPopover, $ionicModal, $timeout, Newsfeed, Token) {

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

    $ionicPopover.fromTemplateUrl('templates/popover/popover-homepostdetail.html', {
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

.controller('HomePostDetailPopoverCtrl', function($scope, $location, $foodieUtils, $ionicModal, Newsfeed, Token) {
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
                      $location.path('/tab/home').replace();
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
  


  
});


