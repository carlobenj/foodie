angular.module('foodie.directive', [])

//time plugin
.directive('timeago', function($interval) {
  return {
    restrict:'A',
    link: function(scope, element, attrs){
      attrs.$observe("timeago", function(){
        var UTCtime = moment(attrs.timeago + "00:00", "YYYY-MM-DD HH:mm:ssZ");
        element.text(moment(UTCtime).fromNow());
        
        $interval(function(){        
        element.text(moment(UTCtime).fromNow());
        },60000);
      });      
    }
  };
})

//time plugin
.directive('timeRemaining', function($interval) {
  return {
    restrict:'A',
    link: function(scope, element, attrs){
      attrs.$observe("timeRemaining", function(){
        var m1 = moment(moment().utc().format("YYYY-MM-DD HH:mm:ss"),'YYYY-MM-DD HH:mm:ss');
        var m2 = moment(attrs.timeRemaining,'YYYY-MM-DD HH:mm:ss');
        var diff = moment.duration(m1.diff(m2)).humanize();
        element.text(diff);
        
        $interval(function(){        
        m1 = moment(moment().utc().format("YYYY-MM-DD HH:mm:ss"),'YYYY-MM-DD HH:mm:ss');
        m2 = moment(attrs.timeRemaining,'YYYY-MM-DD HH:mm:ss');
        diff = moment.duration(m1.diff(m2)).humanize();
        element.text(diff);
        },1000);
      });      
    }
  };
})

.directive('datetime', function() {
  return {
    restrict:'A',
    link: function(scope, element, attrs){
      attrs.$observe("datetime", function(){
        var zone = (moment().zone() / 60) * (-1);
        element.text(moment(attrs.datetime).add(zone, 'hours').format("MMMM DD, YYYY"));

      });      
    }
  };
})

//abbreviate
.directive('abbreviate', function($interval) {
  return {
    restrict:'A',
    link: function(scope, element, attrs){
      attrs.$observe("abbreviate", function(){
        var old_value = parseInt(attrs.abbreviate);
        if(old_value < 1000){
            element.text(old_value);
        }
        else if(old_value >= 1000){
            var remainder = parseInt(Math.round((old_value % 1000) / 100));
            if(remainder > 0)
            {
              element.text(parseInt(old_value / 1000) + "." + remainder + "K");
            }
            else
            {
              element.text(parseInt(old_value / 1000) + "K");
            }
        }
        else
        {
        }
      });      
    }
  };
})

//tabs hidden plugin
.directive('hideCompose', function($rootScope) {
    return {
        restrict: 'A',
        link: function($scope, $el) {
            $rootScope.hideCompose = true;
            $scope.$on('$destroy', function() {
                $rootScope.hideCompose = false;
            });
        }
    };
})

.directive('scrollWatch', function($rootScope) {
  return function(scope, elem, attr) {
    var start = 0;
    var threshold = 200;
    
    elem.bind('scroll', function(e) {
      if(e.detail.scrollTop - start > threshold) {
        $rootScope.slideNav = true;
      } else {
        $rootScope.slideNav = false;
      }
      if ($rootScope.slideHeaderPrevious > e.detail.scrollTop - start) {
        $rootScope.slideNav = false;
      }
      $rootScope.slideHeaderPrevious = e.detail.scrollTop - start;
      $rootScope.$apply();
    });
  };
})

.directive('noScrollWatch', function($rootScope) {
  return function(scope, elem, attr) {
    $rootScope.slideNav = false;
  };
})

.directive('getWidth', function($rootScope) {
    return {
        restrict: 'A',
        link: function(scope, el, attrs) {
            //document.getElementById(id).offsetHeight;
            $rootScope.foodiePostWidth = el[0].offsetWidth;
            $rootScope.foodiePostHeight = (el[0].offsetWidth*0.65) + 70;
        }
    };
})

.directive('ngCache', function($rootScope) {
    return {
        restrict: 'A',
        link: function(scope, el, attrs) {
            attrs.$observe('ngSrc', function(src) {
                el.addClass('foodie-lazy');
                if($rootScope.isImgCacheLoaded)
                {
                  ImgCache.isCached(src, function(path, success) {
                      if(success == "true" || success == true) 
                      {
                          el.removeClass('foodie-lazy');           
                          ImgCache.useCachedFile(el); 
                      } 
                      else 
                      {
                          ImgCache.cacheFile(src, function() {
                              ImgCache.useCachedFile(el);
                          },function(err){

                          },
                          function(pe){
                            if(pe.lengthComputable) {
                              if(pe.loaded == pe.total){
                                el.addClass('reveal');
                              }
                            }
                          });
                      }
                  });
                }                
                else
                {
                    el.removeClass('foodie-lazy');
                    el.src = src;
                }
            });
        }
    };
})

.directive('imgCaman', function($rootScope) {
    return {
        restrict: 'A',
        link: function(scope, el, attrs) {
            attrs.$observe('imgCaman', function(filterType) {
                switch(filterType)
                {
                  case "normal":      
                    Caman(el[0], function () {
                      this.revert();
                    });
                    break;
                  case "vintage":      
                    Caman(el[0], function () {
                      this.revert();
                      this.vintage().render();
                    });
                    break;
                  case "lomo":      
                    Caman(el[0], function () {
                      this.revert();
                      this.lomo().render();
                    });
                    break;
                  case "clarity":      
                    Caman(el[0], function () {
                      this.revert();
                      this.clarity().render();
                    });
                    break;
                  case "sinCity":      
                    Caman(el[0], function () {
                      this.revert();
                      this.sinCity().render();
                    });
                    break;
                  case "sunrise":      
                    Caman(el[0], function () {
                      this.revert();
                      this.sunrise().render();
                    });
                    break;
                  case "crossProcess":      
                    Caman(el[0], function () {
                      this.revert();
                      this.crossProcess().render();
                    });
                    break;
                  case "orangePeel":      
                    Caman(el[0], function () {
                      this.revert();
                      this.orangePeel().render();
                    });
                    break;
                  case "love":      
                    Caman(el[0], function () {
                      this.revert();
                      this.love().render();
                    });
                    break;
                  case "grungy":      
                    Caman(el[0], function () {
                      this.revert();
                      this.grungy().render();
                    });
                    break;
                  case "jarques":      
                    Caman(el[0], function () {
                      this.revert();
                      this.jarques().render();
                    });
                    break;
                  case "pinhole":      
                    Caman(el[0], function () {
                      this.revert();
                      this.pinhole().render();
                    });
                    break;
                  case "oldBoot":      
                    Caman(el[0], function () {
                      this.revert();
                      this.oldBoot().render();
                    });
                    break;
                  case "glowingSun":      
                    Caman(el[0], function () {
                      this.revert();
                      this.glowingSun().render();
                    });
                    break;
                  case "hazyDays":      
                    Caman(el[0], function () {
                      this.revert();
                      this.hazyDays().render();
                    });
                    break;
                  case "herMajesty":      
                    Caman(el[0], function () {
                      this.revert();
                      this.herMajesty().render();
                    });
                    break;
                  case "nostalgia":      
                    Caman(el[0], function () {
                      this.revert();
                      this.nostalgia().render();
                    });
                    break;
                  case "hemingway":      
                    Caman(el[0], function () {
                      this.revert();
                      this.hemingway().render();
                    });
                    break;
                  case "concentrate":      
                    Caman(el[0], function () {
                      this.revert();
                      this.concentrate().render();
                    });
                    break;
                  default:      
                    Caman(el[0], function () {
                      this.revert();
                    });
                    break;      
                }

            });
              
        }
    };
});

// .directive('lazyScroll', ['$rootScope', '$timeout',
// function($rootScope, $timeout) {
//   return {
//     restrict: 'A',
//     link: function ($scope, $element) {
//       var scrollTimeoutId = 0;

//       $scope.invoke = function () {
//         $rootScope.$broadcast('lazyScrollEvent');
//       };

//       $element.bind('scroll', function () {
//         $timeout.cancel(scrollTimeoutId);
//         // wait and then invoke listeners (simulates stop event)
//         scrollTimeoutId = $timeout($scope.invoke, 0);
//       });
//     }
//   };
// }])

// .directive('imageLazySrc', ['$document', '$timeout',
//   function ($document, $timeout) {
//     return {
//       restrict: 'A',
//       link: function ($scope, $element, $attributes) {

//           var deregistration = $scope.$on('lazyScrollEvent', function () {
//             //console.log('scroll');
//             if (isInView()) {
//             $element[0].src = $attributes.imageLazySrc; // set src attribute on element (it will load image)
//             deregistration();
//             }
//           });

//           function isInView() {
//             var clientHeight = $document[0].documentElement.clientHeight;
//             var clientWidth = $document[0].documentElement.clientWidth;
//             var imageRect = $element[0].getBoundingClientRect();
//             return (imageRect.top >= 0 && imageRect.bottom <= clientHeight) && (imageRect.left >= 0 && imageRect.right <= clientWidth);
//           }

//           // bind listener
//           // listenerRemover = scrollAndResizeListener.bindListener(isInView);
//           // unbind event listeners if element was destroyed
//           // it happens when you change view, etc
//           $element.on('$destroy', function () {
//             deregistration();
//           });
//         // explicitly call scroll listener (because, some images are in viewport already and we haven't scrolled yet)

//         $timeout(function() {
//           if (isInView()) {
//           $element[0].src = $attributes.imageLazySrc; // set src attribute on element (it will load image)
//           deregistration();
//           }
//         }, 500);
//       }
//     };
// }]);