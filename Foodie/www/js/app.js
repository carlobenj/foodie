angular.module('foodie', ['ionic', 'ngCordova', 'ja.qr', 'foodie.services', 'foodie.directive', 'foodie.controllers.others',
  'foodie.controllers.newsfeed', 'foodie.controllers.offers', 'foodie.controllers.notification', 'foodie.controllers.home', 
  'foodie.controllers.dash','foodie.controllers.promotion','foodie.controllers.fooducer.validate','foodie.controllers.fooducer.profile',
  'foodie.controllers.admin.home', 'foodie.controllers.admin.inappropriate', 'foodie.controllers.admin.spam', 'foodie.controllers.admin.offensive'])

.run(function($ionicPlatform, FoodieConfig, Token, $log, $rootScope) {
  ImgCache.options.debug = false;
  ImgCache.options.chromeQuota = 50*1024*1024;  
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    ImgCache.init(function(){
        $rootScope.isImgCacheLoaded = true;
    }, function(){
        $rootScope.isImgCacheLoaded = false;
    });
  });

  //establish connection for api 10.0.3.2
  //Token.establishConnection('http://localhost\\:12687/api/');
  Token.establishConnection('http://foodieph.azurewebsites.net/api/');

  //VOUCHER CODE: [voucher_ID] - [foodict_ID] - [foodict_ID] - [offer_ID] - [fooducer_ID] - [voucher_counter]
})

.config(function($stateProvider, $urlRouterProvider) {


///////////////////////////////////////////////////////////////////       FOODICT        //////////////////////////////////////////////////////////////////////// 
  $stateProvider

    .state('tab', {
      url: "/tab",
      abstract: true,
      templateUrl: "templates/foodict-tabs.html"
    })

    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html'
    })

    .state('tab.compose', {
      url: '/newsfeed/compose/new',
      views: {
        'tab-newsfeed': {
          templateUrl: 'templates/compose.html',
          controller: 'ComposeCtrl'
        }
      }
    }) 


    //=-=-=-=-=--=-=-=-=-=--=-=-=-=-=--=-=-=-=-=-=-=-=-=          NEWSFEED TAB           =-=-=-=-=--=-=-=-=-=--=-=-=-=-=--=-=-=-=-=--=-=-=-=-=--=-=-=-=-=--
    .state('tab.newsfeed', {
      url: '/newsfeed',
      views: {
        'tab-newsfeed': {
          templateUrl: 'templates/Foodict/TabNewsfeed/tab-newsfeed.html',
          controller: 'NewsfeedCtrl'
        }
      }
    })
    
    .state('tab.post-detail', {
      url: '/newsfeed/:post_ID',
      views: {
        'tab-newsfeed': {
          templateUrl: 'templates/Foodict/TabNewsfeed/post-detail.html',
          controller: 'PostDetailCtrl'
        }
      }
    })

    .state('tab.biters', {
      url: '/newsfeed/:post_ID/biters',
      views: {
        'tab-newsfeed': {
          templateUrl: 'templates/Foodict/TabNewsfeed/post-detail-biters.html',
          controller: 'PostDetailCtrl'
        }
      }
    })

    .state('tab.comment', {
      url: '/newsfeed/comment/:post_ID',
      views: {
        'tab-newsfeed': {
          templateUrl: 'templates/Foodict/TabNewsfeed/post-comment.html'
        }
      }
    })  

    .state('tab.otherprofile', {
      url: '/newsfeed/otherprofile/:otherFoodictID',
      views: {
        'tab-newsfeed': {
          templateUrl: 'templates/Foodict/TabNewsfeed/other-profile.html',
          controller: 'OtherProfileCtrl'
        }
      }
    }) 

    .state('tab.otherprofile-follower', {
      url: '/newsfeed/otherprofile/:foodictID/followers',
      views: {
        'tab-newsfeed': {
          templateUrl: 'templates/Foodict/TabHome/other-followers.html',
          controller: 'OtherFollowersCtrl'
        }
      }
    }) 

    .state('tab.otherprofile-following', {
      url: '/newsfeed/otherprofile/:foodictID/following',
      views: {
        'tab-newsfeed': {
          templateUrl: 'templates/Foodict/TabHome/other-following.html',
          controller: 'OtherFollowingCtrl'
        }
      }
    }) 

    .state('tab.my-profile', {
      url: '/newsfeed/home/profile',
      views: {
        'tab-newsfeed': {
          templateUrl: 'templates/Foodict/TabNewsfeed/tab-home.html',
          controller: 'MyHomeCtrl'
        }
      }
    })

    .state('tab.my-followers', {
      url: '/newsfeed/me/followers',
      views: {
        'tab-newsfeed': {
          templateUrl: 'templates/Foodict/TabHome/followers.html',
          controller: 'MyFollowersCtrl'
        }
      }
    })

    .state('tab.my-following', {
      url: '/newsfeed/me/following',
      views: {
        'tab-newsfeed': {
          templateUrl: 'templates/Foodict/TabHome/following.html',
          controller: 'MyFollowingCtrl'
        }
      }
    })

    .state('tab.my-edit', {
      url: '/newsfeed/me/edit',
      views: {
        'tab-newsfeed': {
          templateUrl: 'templates/Foodict/TabNewsfeed/edit.html',
          controller: 'EditCtrl'
        }
      }
    })

    .state('tab.my-general-info', {
      url: '/newsfeed/me/edit/general-info',
      views: {
        'tab-newsfeed': {
          templateUrl: 'templates/Foodict/TabNewsfeed/edit-general-info.html',
          controller: 'EditCtrl'
        }
      }
    })

    .state('tab.my-contact-info', {
      url: '/newsfeed/me/edit/contact-info',
      views: {
        'tab-newsfeed': {
          templateUrl: 'templates/Foodict/TabNewsfeed/edit-contact-info.html',
          controller: 'EditCtrl'
        }
      }
    })

    .state('tab.my-settings', {
      url: '/newsfeed/me/settings',
      views: {
        'tab-newsfeed': {
          templateUrl: 'templates/Foodict/TabNewsfeed/settings.html',
          controller: 'SettingsCtrl'
        }
      }
    })


    .state('tab.my-terms', {
      url: '/newsfeed/me/settings/more/terms',
      views: {
        'tab-newsfeed': {
          templateUrl: 'templates/Foodict/TabHome/terms.html',
        }
      }
    })

    .state('tab.my-about', {
      url: '/newsfeed/me/settings/more/about/developers',
      views: {
        'tab-newsfeed': {
          templateUrl: 'templates/Foodict/TabHome/about.html',
        }
      }
    })

    .state('tab.my-password', {
      url: '/newsfeed/me/settings/password',
      views: {
        'tab-newsfeed': {
          templateUrl: 'templates/Foodict/TabNewsfeed/settings-password.html'
        }
      }
    })

    .state('tab.my-email', {
      url: '/newsfeed/me/settings/email',
      views: {
        'tab-newsfeed': {
          templateUrl: 'templates/Foodict/TabNewsfeed/settings-email.html'
        }
      }
    })

    .state('tab.my-username', {
      url: '/newsfeed/me/settings/username',
      views: {
        'tab-newsfeed': {
          templateUrl: 'templates/Foodict/TabNewsfeed/settings-username.html'
        }
      }
    })

    .state('tab.my-vouchers', {
      url: '/newsfeed/me/vouchers',
      views: {
        'tab-newsfeed': {
          templateUrl: 'templates/Foodict/TabNewsfeed/vouchers.html',
          controller: 'VouchersCtrl'
        }
      }
    })

    .state('tab.shared-offer', {
      url: '/newsfeed/sharedoffer/:offerID',
      views: {
        'tab-newsfeed': {
          templateUrl: 'templates/Foodict/TabNewsfeed/offers-detail.html',
          controller: 'SharedOfferCtrl'
        }
      }
    })

    .state('tab.newsfeed-fooducer', {
      url: '/newsfeed/fooducer/:fooducerID',
      views: {
        'tab-newsfeed': {
          templateUrl: 'templates/Foodict/TabNewsfeed/fooducer-profile.html',
          controller: 'FoodictFooducerProfileCtrl'
        }
      }
    })

    //=-=-=-=-=--=-=-=-=-=--=-=-=-=-=--=-=-=-=-=-=-=-=-=           OFFER TAB        =-=-=-=-=--=-=-=-=-=--=-=-=-=-=--=-=-=-=-=--=-=-=-=-=--=-=-=-=-=--
    .state('tab.offers', {
      url: '/offers',
      views: {
        'tab-offers': {
          templateUrl: 'templates/Foodict/TabOffers/tab-offers.html',
          controller: 'OffersCtrl'
        }
      }
    })

    .state('tab.offers-detail', {
      url: '/offers/:offerID',
      views: {
        'tab-offers': {
          templateUrl: 'templates/Foodict/TabOffers/offers-detail.html',
          controller: 'OffersDetailCtrl'
        }
      }
    })

    .state('tab.offers-fooducer', {
      url: '/offers/fooducer/:fooducerID',
      views: {
        'tab-offers': {
          templateUrl: 'templates/Foodict/TabOffers/fooducer-profile.html',
          controller: 'FoodictFooducerProfileCtrl'
        }
      }
    })

    //=-=-=-=-=--=-=-=-=-=--=-=-=-=-=--=-=-=-=-=-=-=-=-=           DISCOVER TAB        =-=-=-=-=--=-=-=-=-=--=-=-=-=-=--=-=-=-=-=--=-=-=-=-=--=-=-=-=-=--
    .state('tab.discover', {
      url: '/offers',
      views: {
        'tab-offers': {
          templateUrl: 'templates/Foodict/TabOffers/tab-offers.html',
          controller: 'OffersCtrl'
        }
      }
    })

    //=-=-=-=-=--=-=-=-=-=--=-=-=-=-=--=-=-=-=-=-=-=-=-=        NOTIFICATION TAB    =-=-=-=-=--=-=-=-=-=--=-=-=-=-=--=-=-=-=-=--=-=-=-=-=--=-=-=-=-=--
    .state('tab.notification', {
      url: '/notification',
      views: {
        'tab-notification': {
          templateUrl: 'templates/Foodict/TabNotification/tab-notification.html'
        }
      }
    })

    //=-=-=-=-=--=-=-=-=-=--=-=-=-=-=--=-=-=-=-=-=-=-=-=            HOME TAB         =-=-=-=-=--=-=-=-=-=--=-=-=-=-=--=-=-=-=-=--=-=-=-=-=--=-=-=-=-=--
    .state('tab.home', {
      url: '/home',
      views: {
        'tab-home': {
          templateUrl: 'templates/Foodict/TabHome/tab-home.html',
          controller: 'HomeCtrl'
        }
      }
    })

    .state('tab.followers', {
      url: '/home/followers',
      views: {
        'tab-home': {
          templateUrl: 'templates/Foodict/TabHome/followers.html',
          controller: 'FollowersCtrl'
        }
      }
    })

    .state('tab.following', {
      url: '/home/following',
      views: {
        'tab-home': {
          templateUrl: 'templates/Foodict/TabHome/following.html',
          controller: 'FollowingCtrl'
        }
      }
    })

    .state('tab.edit', {
      url: '/home/edit',
      views: {
        'tab-home': {
          templateUrl: 'templates/Foodict/TabHome/edit.html',
          controller: 'EditCtrl'
        }
      }
    })

    .state('tab.general-info', {
      url: '/home/edit/general-info',
      views: {
        'tab-home': {
          templateUrl: 'templates/Foodict/TabHome/edit-general-info.html',
          controller: 'EditCtrl'
        }
      }
    })

    .state('tab.contact-info', {
      url: '/home/edit/contact-info',
      views: {
        'tab-home': {
          templateUrl: 'templates/Foodict/TabHome/edit-contact-info.html',
          controller: 'EditCtrl'
        }
      }
    })

    .state('tab.settings', {
      url: '/home/settings',
      views: {
        'tab-home': {
          templateUrl: 'templates/Foodict/TabHome/settings.html',
          controller: 'SettingsCtrl'
        }
      }
    })

    .state('tab.terms', {
      url: '/home/settings/more/terms',
      views: {
        'tab-home': {
          templateUrl: 'templates/Foodict/TabHome/terms.html',
        }
      }
    })

    .state('tab.about', {
      url: '/home/settings/more/about/developers',
      views: {
        'tab-home': {
          templateUrl: 'templates/Foodict/TabHome/about.html',
        }
      }
    })


    .state('tab.username', {
      url: '/home/settings/username',
      views: {
        'tab-home': {
          templateUrl: 'templates/Foodict/TabHome/settings-username.html'
        }
      }
    })

    .state('tab.password', {
      url: '/home/settings/password',
      views: {
        'tab-home': {
          templateUrl: 'templates/Foodict/TabHome/settings-password.html'
        }
      }
    })

    .state('tab.email', {
      url: '/home/settings/email',
      views: {
        'tab-home': {
          templateUrl: 'templates/Foodict/TabHome/settings-email.html'
        }
      }
    })

    .state('tab.vouchers', {
      url: '/home/vouchers',
      views: {
        'tab-home': {
          templateUrl: 'templates/Foodict/TabHome/vouchers.html',
          controller: 'VouchersCtrl'
        }
      }
    })



    .state('tab.home-otherprofile', {
      url: '/home/otherprofile/:otherFoodictID',
      views: {
        'tab-home': {
          templateUrl: 'templates/Foodict/TabHome/other-profile.html',
          controller: 'HomeOtherProfileCtrl'
        }
      }
    }) 

    .state('tab.home-otherprofile-follower', {
      url: '/home/otherprofile/:foodictID/followers',
      views: {
        'tab-home': {
          templateUrl: 'templates/Foodict/TabHome/other-followers.html',
          controller: 'HomeOtherFollowersCtrl'
        }
      }
    }) 

    .state('tab.home-otherprofile-following', {
      url: '/home/otherprofile/:foodictID/following',
      views: {
        'tab-home': {
          templateUrl: 'templates/Foodict/TabHome/other-following.html',
          controller: 'HomeOtherFollowingCtrl'
        }
      }
    }) 


    
    .state('tab.home-post-detail', {
      url: '/home/post/:post_ID',
      views: {
        'tab-home': {
          templateUrl: 'templates/Foodict/TabHome/post-detail.html',
          controller: 'HomePostDetailCtrl'
        }
      }
    })

    .state('tab.home-biters', {
      url: '/home/:post_ID/biters',
      views: {
        'tab-home': {
          templateUrl: 'templates/Foodict/TabHome/post-detail-biters.html',
          controller: 'PostDetailCtrl'
        }
      }
    })

    .state('tab.home-comment', {
      url: '/home/comment/:post_ID',
      views: {
        'tab-home': {
          templateUrl: 'templates/Foodict/TabHome/post-comment.html'
        }
      }
    })  




///////////////////////////////////////////////////////////////////       FOODUCER       //////////////////////////////////////////////////////////////////////// 

    .state('fooducer', {
      url: "/fooducer",
      abstract: true,
      templateUrl: "templates/fooducer-tabs.html"
    })

    //=-=-=-=-=--=-=-=-=-=--=-=-=-=-=--=-=-=-=-=-=-=-=-=            DASH TAB         =-=-=-=-=--=-=-=-=-=--=-=-=-=-=--=-=-=-=-=--=-=-=-=-=--=-=-=-=-=--

    .state('fooducer.dash', {
      url: '/dash',
      views: {
        'fooducer-dash': {
          templateUrl: 'templates/Fooducer/TabDash/tab-dash.html',
          controller: 'FooducerDashCtrl'
        }
      }
    })

    .state('fooducer.archives', {
      url: '/dash/archives',
      views: {
        'fooducer-dash': {
          templateUrl: 'templates/Fooducer/TabDash/archives.html',
          controller: 'FooducerArchivesCtrl'
        }
      }
    })


    .state('fooducer.archive-details', {
      url: '/dash/archives/:offerID',
      views: {
        'fooducer-dash': {
          templateUrl: 'templates/Fooducer/TabDash/archive-details.html',
          controller: 'FooducerArchiveDetailsCtrl'
        }
      }
    })

    .state('fooducer.archive-promo-details', {
      url: '/dash/archives/promo/details/:promoID',
      views: {
        'fooducer-dash': {
          templateUrl: 'templates/Fooducer/TabDash/archive-promo-details.html',
          controller: 'FooducerArchivePromoDetailsCtrl'
        }
      }
    })

    //=-=-=-=-=--=-=-=-=-=--=-=-=-=-=--=-=-=-=-=-=-=-=-=            PROMOTION TAB         =-=-=-=-=--=-=-=-=-=--=-=-=-=-=--=-=-=-=-=--=-=-=-=-=--=-=-=-=-=--
    .state('fooducer.promotion', {
      url: '/promotion',
      views: {
        'fooducer-promotion': {
          templateUrl: 'templates/Fooducer/TabPromo/tab-promotion.html',
          controller: 'FooducerPromotionCtrl'
        }
      }
    })

    //=-=-=-=-=--=-=-=-=-=--=-=-=-=-=--=-=-=-=-=-=-=-=-=            VALIDATE TAB         =-=-=-=-=--=-=-=-=-=--=-=-=-=-=--=-=-=-=-=--=-=-=-=-=--=-=-=-=-=--
    .state('fooducer.validate', {
      url: '/validate',
      views: {
        'fooducer-validate': {
          templateUrl: 'templates/Fooducer/TabValidate/tab-validate.html',
          controller: 'FooducerValidateCtrl'
        }
      }
    })

    .state('fooducer.validate-promo', {
      url: '/validate/promo/:promoID',
      views: {
        'fooducer-validate': {
          templateUrl: 'templates/Fooducer/TabValidate/validate-promo.html',
          controller: 'FooducerValidatePromoCtrl'
        }
      }
    })


    .state('fooducer.validate-promo-details', {
      url: '/validate/promo/details/:promoID',
      views: {
        'fooducer-validate': {
          templateUrl: 'templates/Fooducer/TabValidate/validate-promo-details.html',
          controller: 'FooducerValidatePromoDetailsCtrl'
        }
      }
    })

    //=-=-=-=-=--=-=-=-=-=--=-=-=-=-=--=-=-=-=-=-=-=-=-=            PROFILE TAB         =-=-=-=-=--=-=-=-=-=--=-=-=-=-=--=-=-=-=-=--=-=-=-=-=--=-=-=-=-=--
    .state('fooducer.profile', {
      url: '/profile',
      views: {
        'fooducer-profile': {
          templateUrl: 'templates/Fooducer/TabProfile/tab-profile.html',
          controller: 'FooducerProfileCtrl'
        }
      }
    })

    .state('fooducer.edit', {
      url: '/profile/edit',
      views: {
        'fooducer-profile': {
          templateUrl: 'templates/Fooducer/TabProfile/edit.html',
          controller: 'FooducerEditProfileCtrl'
        }
      }
    })

    .state('fooducer.contact-info', {
      url: '/profile/edit/contact-info',
      views: {
        'fooducer-profile': {
          templateUrl: 'templates/Fooducer/TabProfile/edit-contact-info.html',
          controller: 'FooducerEditProfileCtrl'
        }
      }
    })

    .state('fooducer.general-info', {
      url: '/profile/edit/general-info',
      views: {
        'fooducer-profile': {
          templateUrl: 'templates/Fooducer/TabProfile/edit-general-info.html',
          controller: 'FooducerEditProfileCtrl'
        }
      }
    })


    .state('fooducer.location-map', {
      url: '/profile/edit/location-map',
      views: {
        'fooducer-profile': {
          templateUrl: 'templates/Fooducer/TabProfile/edit-location-map.html',
          controller: 'FooducerEditProfileCtrl'
        }
      }
    })

    .state('fooducer.settings', {
      url: '/profile/settings',
      views: {
        'fooducer-profile': {
          templateUrl: 'templates/Fooducer/TabProfile/settings.html',
          controller: 'FooducerAccountSettingsCtrl'
        }
      }
    })


    .state('fooducer.username', {
      url: '/profile/settings/username',
      views: {
        'fooducer-profile': {
          templateUrl: 'templates/Fooducer/TabProfile/settings-username.html'
        }
      }
    })

    .state('fooducer.password', {
      url: '/profile/settings/password',
      views: {
        'fooducer-profile': {
          templateUrl: 'templates/Fooducer/TabProfile/settings-password.html'
        }
      }
    })

    .state('fooducer.email', {
      url: '/profile/settings/email',
      views: {
        'fooducer-profile': {
          templateUrl: 'templates/Fooducer/TabProfile/settings-email.html'
        }
      }
    })


    //=-=-=-=-=--=-=-=-=-=--=-=-=-=-=--=-=-=-=-=-=-=-=-=            DASH TAB         =-=-=-=-=--=-=-=-=-=--=-=-=-=-=--=-=-=-=-=--=-=-=-=-=--=-=-=-=-=--+
    .state('admin', {
      url: "/admin",
      abstract: true,
      templateUrl: "templates/admin-tabs.html"
    })

    .state('admin.spam', {
      url: '/spam',
      views: {
        'admin-spam': {
          templateUrl: 'templates/Admin/TabSpam/tab-spam.html',
          controller: 'AdminSpamCtrl'
        }
      }
    })

    .state('admin.spam-details', {
      url: '/spam/:reportID/:reportType',
      views: {
        'admin-spam': {
          templateUrl: 'templates/Admin/TabSpam/spam-details.html',
          controller: 'AdminSpamDetailsCtrl'
        }
      }
    })

    .state('admin.inappropriate', {
      url: '/inappropriate',
      views: {
        'admin-inappropriate': {
          templateUrl: 'templates/Admin/TabInappropriate/tab-inappropriate.html',
          controller: 'AdminInappropriateCtrl'
        }
      }
    })

    .state('admin.inappropriate-details', {
      url: '/inappropriate/item/details/:reportID/:reportType',
      views: {
        'admin-inappropriate': {
          templateUrl: 'templates/Admin/TabInappropriate/inappropriate-details.html',
          controller: 'AdminInappropriateDetailsCtrl'
        }
      }
    })

    .state('admin.home', {
      url: '/home',
      views: {
        'admin-home': {
          templateUrl: 'templates/Admin/TabHome/tab-home.html',
          controller: 'AdminHomeCtrl'
        }
      }
    })

    .state('admin.offensive', {
      url: '/offensive',
      views: {
        'admin-offensive': {
          templateUrl: 'templates/Admin/TabOffensive/tab-offensive.html',
          controller: 'AdminOffensiveCtrl'
        }
      }
    })


    .state('admin.offensive-details', {
      url: '/offensive/comment/item/details/:reportID/:reportType',
      views: {
        'admin-offensive': {
          templateUrl: 'templates/Admin/TabOffensive/offensive-details.html',
          controller: 'AdminOffensiveDetailsCtrl'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
});

