angular.module('foodie.plugins', [])
.factory('Camera', ['$q', function($q) {

  return {
    takePicture: function(options) {
      var q = $q.defer();

      navigator.camera.getPicture(function(result) {
        // Do any magic you need
        q.resolve(result);
      }, function(err) {
        q.reject(err);
      }, 
      {
        quality : 75,
        destinationType : Camera.DestinationType.FILE_URI, //DATA_URL base 64
        saveToPhotoAlbum: true,
        targetWidth: 640,
        targetHeight: 640,
        correctOrientation: true,
        cameraDirection: 1
      });

      return q.promise;
    },

    fromLibrary: function(options) {
      var q = $q.defer();

      navigator.camera.getPicture(function(result) {
        // Do any magic you need
        q.resolve(result);
      }, function(err) {
        q.reject(err);
      }, 
      {
        quality : 75,
        destinationType : Camera.DestinationType.FILE_URI, //DATA_URL base 64
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        targetWidth: 640,
        targetHeight: 640,
        correctOrientation: true,
      });

      return q.promise;
    }
  }
}])
.factory('googleMapsFactory', function ($q) {
      var deferred = $q.defer();
      if(typeof window.google !== 'undefined' && typeof window.google.maps !== 'undefined') {
        console.log('yes, google is undefined, creating promise');
        // Early-resolve the promise for googleMaps
        deferred.resolve(window.google.maps);
        return deferred.promise;
      }
      var randomizedFunctionName = 'onGoogleMapsReady' + Math.round(Math.random()*1000);
      window[randomizedFunctionName] = function() {
        window[randomizedFunctionName] = null;
        // Resolve the promise for googleMaps
        deferred.resolve(window.google.maps);
      };
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAUUBOeqEmHuL_HkVPLlb12yVlHIHMwKOw&sensor=true&v=3.exp&libraries=places,geometry&callback='+randomizedFunctionName;
      document.body.appendChild(script);
      // Return a promise for googleMaps
      return deferred.promise;
});
// .factory('googleMapsFactory', function ($q) {
//       var deferred = $q.defer();
//       if(typeof window.google !== 'undefined' && typeof window.google.maps !== 'undefined' && typeof window.google.visualization !== 'undefined') {
//         console.log('yes, google is undefined, creating promise');
//         // Early-resolve the promise for googleMaps
//         deferred.resolve(window.google.visualization);
//         deferred.resolve(window.google.maps);
//         return deferred.promise;
//       }


//       var randomizedFunctionName = 'onGoogleMapsReady' + Math.round(Math.random()*1000);
//       window[randomizedFunctionName] = function() {
//         window[randomizedFunctionName] = null;
//         // Resolve the promise for googleMaps
//         deferred.resolve(window.google.visualization);
//         deferred.resolve(window.google.maps);
//       };
//       var randomizedFunctionName2 = 'onGoogleApiLoaded' + Math.round(Math.random()*1000);
//       window[randomizedFunctionName2] = function() {
//         window[randomizedFunctionName2] = null;
//         // Resolve the promise for googleMaps
//         deferred.resolve(window.google.visualization);
//         alert(window.google.visualization);
//       };

//       var script = document.createElement('script');
//       script.type = 'text/javascript';
//       script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAUUBOeqEmHuL_HkVPLlb12yVlHIHMwKOw&sensor=true&v=3.exp&libraries=places&callback='+randomizedFunctionName;
//       document.body.appendChild(script);
//       var script2 = document.createElement('script');
//       script2.type = 'text/javascript';
//       script2.src = 'https://www.google.com/jsapi?callback='+randomizedFunctionName2;
//       document.body.appendChild(script2);

//       return deferred.promise;
// })

// .factory('googleJSApiFactory', function ($q) {
//       var deferred = $q.defer();
//       if(typeof window.google.visualization !== 'undefined') {
//         console.log('yes, google is undefined, creating promise');
//         // Early-resolve the promise for googleMaps
//         deferred.resolve(window.google.visualization);
//         return deferred.promise;
//       }
//       var randomizedFunctionName = 'onGoogleApiLoaded' + Math.round(Math.random()*1000);
//       window[randomizedFunctionName] = function() {
//         window[randomizedFunctionName] = null;
//         // Resolve the promise for googleMaps
//         deferred.resolve(window.google.visualization);
//       };
//       var script = document.createElement('script');
//       script.type = 'text/javascript';
//       script.src = 'https://www.google.com/jsapi?callback='+randomizedFunctionName;
//       document.body.appendChild(script);
//       // Return a promise for googleMaps
//       return deferred.promise;
//   });