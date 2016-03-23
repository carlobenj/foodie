/**
 * jr-crop - A simple ionic plugin to crop your images.
 * @version v0.1.1
 * @link https://github.com/JrSchild/jr-crop
 * @author Joram Ruitenschild
 * @license MIT
 */
angular.module('ionic')

.factory('$jrCrop', [
  '$ionicModal',
  '$rootScope',
  '$q', '$ionicGesture',
function($ionicModal, $rootScope, $q) {

  var template = '<div class="jr-crop modal">' +
                    '<ion-header-bar class="bar-dark filter-bar">' +   
                        '<button class="button button-clear" ng-click="cancel()">{{cancelText}}</button>' + 
                        '<h1 class="title">{{title}}</h1>' +
                        '<button class="button button-clear" ng-click="crop()">{{chooseText}}</button>' +
                    '</ion-header-bar>' +
                    '<div class="jr-crop-center-container">' +
                      '<div class="jr-crop-img" ng-style="{width: width + \'px\', height: height + \'px\'}"></div>' +
                    '</div>' +
                    '<div class="jr-crop-center-container">' +
                      '<div class="jr-crop-select" style="overflow: hidden" ng-style="{width: width + \'px\', height: height + \'px\'}"></div>' +
                    '</div>' +
                    // '<div class="bar bar-footer bar-dark jr-crop-footer">' +
                    //   '<button class="button button-clear" ng-click="cancel()">{{cancelText}}</button>' +
                    //   '<div class="title">{{title}}</div>' +
                    //   '<button class="button button-clear" ng-click="crop()">{{chooseText}}</button>' +
                    // '</div>' +
                  '</div>';

  var jrCropController = ionic.views.View.inherit({

    promise: null,
    imgWidth: null,
    imgHeight: null,

    // Elements that hold the cropped version and the full
    // overlaying image.
    imgSelect: null,
    imgFull: null,

    // Values exposed by scaling and moving. Needed
    // to calculate the result of cropped image
    posX: 0,
    posY: 0,
    scale: 1,

    last_scale: 1,
    last_posX: 0,
    last_posY: 0,

    initialize: function(options) {
      var self = this;

      self.options = options;
      self.promise = $q.defer();
      self.loadImage().then(function(elem) {
        self.imgWidth = elem.naturalWidth;
        self.imgHeight = elem.naturalHeight;

        self.options.modal.el.querySelector('.jr-crop-img').appendChild(self.imgSelect = elem.cloneNode());
        self.options.modal.el.querySelector('.jr-crop-select').appendChild(self.imgFull = elem.cloneNode());

        self.bindHandlers();
        self.initImage();
      });

      // options === scope. Expose actions for modal.
      self.options.cancel = this.cancel.bind(this);
      self.options.crop = this.crop.bind(this);
      self.options.cancelText = self.options.cancelText || 'Cancel';
      self.options.chooseText = self.options.chooseText || 'Choose';
    },

    /**
     * Init the image in a center position
     */
    initImage: function() {
      var self = this;

      if (self.options.height < self.imgHeight || self.options.width < self.imgWidth) {
        var imgAspectRatio = self.imgWidth / self.imgHeight;
        var selectAspectRatio = self.options.width / self.options.height;

        if (selectAspectRatio > imgAspectRatio) {
          self.scale = self.last_scale = self.options.width / self.imgWidth;
        } else {
          self.scale = self.last_scale = self.options.height / self.imgHeight;
        }
      }

      var centerX = (self.imgWidth - self.options.width) / 2;
      var centerY = (self.imgHeight - self.options.height) / 2;

      self.posX = self.last_posX = -centerX;
      self.posY = self.last_posY = -centerY;

      self.setImageTransform();
    },

    cancel: function() {
      var self = this;

      self.options.modal.remove().then(function() {
        self.promise.reject('canceled');
      });
    },

    /**
     * This is where the magic happens
     */
    bindHandlers: function() {
      var self = this,

          min_pos_x = 0, min_pos_y = 0,
          max_pos_x = 0, max_pos_y = 0,
          transforming_correctX = 0, transforming_correctY = 0,

          scaleMax = 1, scaleMin,
          image_ratio = self.imgWidth / self.imgHeight,
          cropper_ratio = self.options.width / self.options.height;

      if (cropper_ratio < image_ratio) {
        scaleMin = self.options.height / self.imgHeight;
      } else {
        scaleMin = self.options.width / self.imgWidth;
      }

      function setPosWithinBoundaries() {
        calcMaxPos();
        if (self.posX > min_pos_x) {
          self.posX = min_pos_x;
        }
        if (self.posX < max_pos_x) {
          self.posX = max_pos_x;
        }
        if (self.posY > min_pos_y) {
          self.posY = min_pos_y;
        }
        if (self.posY < max_pos_y) {
          self.posY = max_pos_y;
        }
      }

      /**
       * Calculate the minimum and maximum positions.
       * This took some headaches to write, good luck
       * figuring this out.
       */
      function calcMaxPos() {
        // Calculate current proportions of the image.
        var currWidth = self.scale * self.imgWidth;
        var currHeight = self.scale * self.imgHeight;

        // Images are scaled from the center
        min_pos_x = (currWidth - self.imgWidth) / 2;
        min_pos_y = (currHeight - self.imgHeight) / 2;
        max_pos_x = -(currWidth - min_pos_x - self.options.width);
        max_pos_y = -(currHeight - min_pos_y - self.options.height);
      }
      // // Based on: http://stackoverflow.com/questions/18011099/pinch-to-zoom-using-hammer-js
      // ionic.onGesture('touch transform drag dragstart dragend', function(e) {
      //   console.log(e.type);
      //   switch (e.type) {
      //     case 'touch':
      //       e.gesture.preventDefault();
      //       self.last_scale = self.scale;
      //       ionic.trigger('dragstart', {target: self.options.modal.el}, false, true)
      //       ionic.trigger('drag', {target: self.options.modal.el}, false, true)
      //       break;
      //     case 'drag':
      //       e.gesture.preventDefault();
      //       self.posX = self.last_posX + e.gesture.deltaX - transforming_correctX;
      //       self.posY = self.last_posY + e.gesture.deltaY - transforming_correctY;
      //       setPosWithinBoundaries();
      //       break;
      //     case 'transform':
      //       self.scale = Math.max(scaleMin, Math.min(self.last_scale * e.gesture.scale, scaleMax));
      //       setPosWithinBoundaries();
      //       break;
      //     case 'dragend':
      //       e.gesture.preventDefault();
      //       self.last_posX = self.posX;
      //       self.last_posY = self.posY;
      //       break;
      //     case 'dragstart':
      //       e.gesture.preventDefault();
      //       self.last_scale = self.scale;

      //       // After scaling, hammerjs needs time to reset the deltaX and deltaY values,
      //       // when the user drags the image before this is done the image will jump.
      //       // This is an attempt to fix that.
      //       if (e.gesture.deltaX > 1 || e.gesture.deltaX < -1) {
      //         transforming_correctX = e.gesture.deltaX;
      //         transforming_correctY = e.gesture.deltaY;
      //       } else {
      //         transforming_correctX = 0;
      //         transforming_correctY = 0;
      //       }
      //       break;
      //   }

      //   self.setImageTransform();

      // }, self.options.modal.el);

      var elmnt = self.options.modal.el;
      var startx = 0;
      var starty = 0;
      var distx = 0;
      var disty = 0;


       elmnt.addEventListener('touchstart', function(e){
        var touchobj = e.changedTouches[0]; // reference first touch point (ie: first finger)
        self.last_scale = self.scale;
        startx = parseInt(touchobj.clientX);
        starty = parseInt(touchobj.clientY);
        //     // After scaling, hammerjs needs time to reset the deltaX and deltaY values,
        //     // when the user drags the image before this is done the image will jump.
        //     // This is an attempt to fix that.
        //     if (distx > 1 || distx < -1) {
        //       transforming_correctX = distx;
        //       transforming_correctY = disty;
        //     } else {
        //       transforming_correctX = 0;
        //       transforming_correctY = 0;
        //     }

        e.preventDefault();
        self.setImageTransform();
       }, false);
       
       elmnt.addEventListener('touchmove', function(e){
        var touchobj = e.changedTouches[0]; // reference first touch point for this event
        distx = parseInt(touchobj.clientX) - startx;
        disty = parseInt(touchobj.clientY) - starty;


        self.posX = self.last_posX + distx;
        self.posY = self.last_posY + disty;
        setPosWithinBoundaries();


        e.preventDefault();
        self.setImageTransform();
       }, false);

       
       elmnt.addEventListener('touchend', function(e){
        var touchobj = e.changedTouches[0]; // reference first touch point for this event

        self.last_posX = self.posX;
        self.last_posY = self.posY;     

        e.preventDefault();
        self.setImageTransform();
       }, false);

    },

    setImageTransform: function() {
      var self = this;

      var transform =
        'translate3d(' + self.posX + 'px,' + self.posY + 'px, 0) ' +
        'scale3d(' + self.scale + ',' + self.scale + ', 1)';

      self.imgSelect.style[ionic.CSS.TRANSFORM] = transform;
      self.imgFull.style[ionic.CSS.TRANSFORM] = transform;

      console.log("x " + self.posX + "    y - " + self.posY);
    },

    /**
     * Calculate the new image from the values calculated by
     * user input. Return a canvas-object with the image on it.
     * 
     * Note: It doesn't actually downsize the image, it only returns
     * a cropped version. Since there's inconsistenties in image-quality
     * when downsizing it's up to the developer to implement this. Preferably
     * on the server.
     */
    crop: function() {
      var canvas = document.createElement('canvas');
      var context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Canvas size is original proportions but scaled down.
      canvas.width = this.options.width / this.scale;
      canvas.height = this.options.height / this.scale;

      // The full proportions 
      var currWidth = this.imgWidth * this.scale;
      var currHeight = this.imgHeight * this.scale;

      // Because the top/left position doesn't take the scale of the image in
      // we need to correct this value.
      var correctX = (currWidth - this.imgWidth) / 2;
      var correctY = (currHeight - this.imgHeight) / 2;

      var sourceX = (this.posX - correctX) / this.scale;
      var sourceY = (this.posY - correctY) / this.scale;

      context.drawImage(this.imgFull, sourceX, sourceY);

      this.options.modal.remove();
      this.promise.resolve(canvas);
    },

    /**
     * Load the image and return the element.
     * Return Promise that will fail when unable to load image.
     */
    loadImage: function() {
      var promise = $q.defer();
      
      // Load the image and resolve with the DOM node when done.
      angular.element('<img />')
        .bind('load', function(e) {
          promise.resolve(this);
        })
        .bind('error', promise.reject)
        .prop('src', this.options.url);

      // Return the promise
      return promise.promise;
    }
  });

  return {
    options: {
      width: 0,
      height: 0,
      aspectRatio: 0
    },

    crop: function(options) {
      this.initOptions(options);

      var scope = $rootScope.$new(true);

      ionic.Utils.extend(scope, this.options);

      scope.modal = $ionicModal.fromTemplate(template, {
        scope: scope
      });

      // Show modal and initialize cropper.
      return scope.modal.show().then(function() {
        return (new jrCropController(scope)).promise.promise;
      });
    },

    initOptions: function(options) {
      ionic.Utils.extend(this.options, options);

      if (this.options.aspectRatio) {

        if (!this.options.width && this.options.height) {
          this.options.width = 200;
        }

        if (this.options.width) {
          this.options.height = this.options.width / this.options.aspectRatio;
        } else if (this.options.height) {
          this.options.width = this.options.height * this.options.aspectRatio;
        }
      }
    }
  };
}]);