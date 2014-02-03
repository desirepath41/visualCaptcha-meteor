
( function( window, $ ) {

  var SERVER = "http://localhost:8282";
  var urls = {
    start: SERVER + "/start/5"
  }
  var imageName = "";


  Template.sampleCaptcha.selectedWord = function() { 
    return Session.get("selectedWord");
  };

  Template.sampleCaptcha.images = function() {
    return Session.get("images");
  }

  Template.statusMessage.msg = function() {
    return Session.get("statusMessage");
  }

  HTTP.get(urls.start, function(err, res) {
    var jsonResp = JSON.parse(res.content);
    var images = [];
    Session.set("selectedWord", jsonResp.imageName);
    jsonResp.values.forEach(function(val, idx) {
      images.push({idx: idx, val: val});
    })
    Session.set("images", images);
  });

  var captcha = null;
  // Show an alert saying if visualCaptcha is filled or not
  var _sayIsVisualCaptchaFilled = function(e) {
      e.preventDefault();
      if ( captcha.getCaptchaData().valid ) {
          window.alert( 'visualCaptcha is filled!' );
      } else {
          window.alert( 'visualCaptcha is NOT filled!' );
      }
  };

  $( function() {
      var captchaEl = $( '#sample-captcha' ).visualCaptcha({
          imgPath: '/img/',
          captcha: {
              url: window.location.origin,
              numberOfImages: 5
          }
      } );
      captcha = captchaEl.data( 'captcha' );

      
      var queryString = window.location.search;
      // Show success/error messages
      if ( queryString.indexOf('status=noCaptcha') !== -1 ) {
          Session.set("statusMessage", { valid: "", css: "icon-no", text: "visualCaptcha was not started!" } );
      } else if ( queryString.indexOf('status=validImage') !== -1 ) {
          Session.set("statusMessage", { valid: "valid",css: "icon-yes", text: "Image was valid!" } );
      } else if ( queryString.indexOf('status=failedImage') !== -1 ) {
          Session.set("statusMessage", { valid: "",css: "icon-no", text: "Image was NOT valid!" } );
      } else if ( queryString.indexOf('status=validAudio') !== -1 ) {
          Session.set("statusMessage", { valid: "valid",css: "icon-yes", text: "Accessibility answer was valid!" } );
      } else if ( queryString.indexOf('status=failedAudio') !== -1 ) {
          Session.set("statusMessage", { valid: "",css: "icon-no", text: "Accessibility answer was NOT valid!" } );
      } else if ( queryString.indexOf('status=failedPost') !== -1 ) {
          Session.set("statusMessage", { valid: "",css: "icon-no", text: "No visualCaptcha answer was given!" } );
      }
      
 } );
  // Bind that function to the appropriate link
  Template.captcha.events({
    'click #check-is-filled': _sayIsVisualCaptchaFilled 
  });

}( window, jQuery ) );
