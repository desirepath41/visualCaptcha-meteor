if (Meteor.isServer) {
  var session = {}; //global fake session for server side 
  var VisualCaptcha = (VisualCaptcha != undefined) ? VisualCaptcha : null;
  Meteor.startup(function () {
    //Define the routes of the API
    Router.map(function () {
      this.route("try", {
        where: 'server',
        action: handleSubmit
      });
      this.route("audio", {
        path: "/audio/?:type?",
        where: 'server',
        action: getAudio
      });
      this.route("image", {
        path: "/image/:index",
        where: 'server',
        action: getImage
      });
      this.route("start", {
        path: "/start/:howmany",
        where: 'server',
        action: start
      });
    });
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
    this.response.writeHead(302);
    this.response.end();
  }

  function getAudio() {
    var type = this.params.type;
    // It's not impossible this method is called before VisualCaptcha is initialized, so we have to send a 404
    allowCORS(this.response);
    if ( ! VisualCaptcha ) {
      this.response.writeHead(404);
      this.response.end('Not Found');
    } else {
      // Default file type is mp3, but we need to support ogg as well
      if ( type !== 'ogg' ) {
          type = 'mp3';
      }

      var result = VisualCaptcha.getAudio( this.response, type );
      if(!result.error) {
        this.response.writeHead(200);
        this.response.end(result.audio);
      } else {
        this.response.writeHead(result.errorCode);
        this.response.end(result.errorMsg);
      }
    }
  }

  function getImage() {
    allowCORS(this.response);
    try {
      var result = VisualCaptcha.getImage(this.params.index, this.request.query.retina, this.response);
      if(!result.error) {
        this.response.writeHead(200);
        this.response.end(result.image);
      } else {
        this.response.writeHead(result.errorCode);
        this.response.end(result.errorMsg);
      }
    } catch (er){
      this.response.writeHead(400);
      this.response.end(er.toString());
    }
  }

  function start() {
     // After initializing VisualCaptcha, we only need to generate new options
    allowCORS(this.response);
    if ( ! VisualCaptcha ) {
        VisualCaptcha = new Meteor.VisualCaptcha(session);
    }
    this.response.writeHead(200);
    this.response.end(VisualCaptcha.start( this.params.howmany ));
  }
}
