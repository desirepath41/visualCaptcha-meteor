if (Meteor.isServer) {
  var session = {}; //global fake session for server side 
  var VisualCaptcha = (VisualCaptcha != undefined) ? VisualCaptcha : null;
  Meteor.startup(function () {
    //Define the routes of the API
    Meteor.Router.add("/try", "POST", handleSubmit);
    Meteor.Router.add("/audio/?:type?", "GET", getAudio);
    Meteor.Router.add("/image/:index",  "GET", getImage);
    Meteor.Router.add("/start/:howmany","GET", start)
  });

  function allowCORS(res) {
    res.setHeader("access-control-allow-origin", "*");
  }
  

  function handleSubmit() {
    var frontendData,
        howmany,
        redirectPath,
        pathPrefix = this.request.headers.referer.split("/")[0];

    if(!pathPrefix.match(/\/$/)) {
      pathPrefix += "/";
    }

    if ( this.request.headers.referer.indexOf( '-jquery' ) ) {
        pathPrefix += 'index-jquery.html';
    }

    // It's not impossible this method is called before VisualCaptcha is initialized, so we have to send a 404
    if ( ! VisualCaptcha ) {
        redirectPath = '?status=noCaptcha';
    } else {
        frontendData = VisualCaptcha.getFrontendData();

        // If an image field name was submitted, try to validate it
        if ( this.request.body[frontendData.imageFieldName] ) {
            if ( VisualCaptcha.validateImage(this.request.body[frontendData.imageFieldName]) ) {
                redirectPath = '?status=validImage';
            } else {
                redirectPath = '?status=failedImage';
            }
        } else if ( this.request.body[frontendData.audioFieldName] ) {
            if ( VisualCaptcha.validateAudio(this.request.body[frontendData.audioFieldName].toLowerCase()) ) {// We set lowercase to allow case-insensitivity, but it's actually optional
                redirectPath = '?status=validAudio';
            } else {
                redirectPath = '?status=failedAudio';
            }
        } else {
            redirectPath = '?status=failedPost';
        }

        // We need to know how many images were generated before, to generate the same number again
        howmany = VisualCaptcha.getImageOptions().length;
        VisualCaptcha.generate( howmany );
    }

    this.response.setHeader( 'Location', pathPrefix + redirectPath );
    return [302];
  }

  function getAudio(type) {
    // It's not impossible this method is called before VisualCaptcha is initialized, so we have to send a 404
    allowCORS(this.response);
    if ( ! VisualCaptcha ) {
      return [ 404, 'Not Found' ];
    } else {
      // Default file type is mp3, but we need to support ogg as well
      if ( type !== 'ogg' ) {
          type = 'mp3';
      }

      var ret = VisualCaptcha.getAudio( this.response, type );
      if(!ret.error) {
        return [200, ret.audio];
      } else {
        return [ret.errorCode, ret.errorMsg];
      }
    }
  }

  function getImage(idx) {
    allowCORS(this.response);
    try {
      var result = VisualCaptcha.getImage(idx, this.request.query.retina, this.response); 
      if(!result.error) {
        return [200, result.image];
      } else {
        return [result.errorCode, result.errorMsg];
      }
    } catch (er){ 
      return [400, er.toString()]
    }
  }

  function start(howmany) {
     // After initializing VisualCaptcha, we only need to generate new options
    allowCORS(this.response);
    if ( ! VisualCaptcha ) {
        VisualCaptcha = new Meteor.VisualCaptcha(session);
    }

    return [200, VisualCaptcha.start( howmany )];
  }
}
