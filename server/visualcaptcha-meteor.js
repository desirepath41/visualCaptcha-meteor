
    WebApp.connectHandlers.use(connect.cookieParser());
    WebApp.connectHandlers.use(connect.session( {secret: 'pepe',  cookie: {secure:false}}));
    WebApp.connectHandlers.use(function(req, res, next) {
      console.log("lalala!");
      next();
    })

var Session =  {
      currentId: null,    
      values: {},
      countSessions: function() {
        return Object.keys(this.values).length;
      },
      countElements: function() {
        if( ! this.values[this.currentId] ) {
          this.values[this.currentId] = {};
        }
        return Object.keys(this.values[this.currentId]).length;
      },
      set: function(k, v) {
        if( ! this.values[this.currentId] ) {
          this.values[this.currentId] = {};
        }
        this.values[this.currentId][k] = v;
      },
      get: function(k) {
        if( ! this.values[this.currentId] ) {
          return null;
        } else {
          return this.values[this.currentId][k];
        }
      }
  }


  console.log("Restarting 'session'");
  var VisualCaptcha = ( VisualCaptcha != undefined ) ? VisualCaptcha : null;
  Meteor.startup( function () {
    //Define the routes of the API
    Meteor.Router.add( '/try' , 'POST', handleSubmit );
    Meteor.Router.add( '/audio/?:type?' , 'GET' , getAudio );
    Meteor.Router.add( '/image/:index' , 'GET' , getImage );
    Meteor.Router.add( '/start/:howmany' , 'GET' , start )

  });

  function allowCORS( res ) {
    res.setHeader( 'access-control-allow-origin' , '*' );
  }
  

  function handleSubmit() {
    var frontendData,
        howmany,
        redirectPath,
        pathPrefix = this.request.headers.referer.split( '/' )[0];

    if( !pathPrefix.match(/\/$/) ) {
      pathPrefix += '/';
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

  function getAudio( type ) {
    // It's not impossible this method is called before VisualCaptcha is initialized, so we have to send a 404
    allowCORS( this.response );
    if ( ! VisualCaptcha ) {
      return [ 404, 'Not Found' ];
    } else {
      // Default file type is mp3, but we need to support ogg as well
      if ( type !== 'ogg' ) {
          type = 'mp3';
      }

      var ret = VisualCaptcha.getAudio( this.response, type );
      if( !ret.error ) {
        return [200, ret.audio];
      } else {
        return [ret.errorCode, ret.errorMsg];
      }
    }
  }

  function getImage( idx ) {
    allowCORS( this.response );
    try {
      var result = VisualCaptcha.getImage( idx, this.request.query.retina, this.response ); 
      if( ! result.error ) {
        return [200, result.image];
      } else {
        return [result.errorCode, result.errorMsg];
      }
    } catch (er){ 
      return [400, er.toString()]
    }
  }

  function start( howmany ) {
    var key = new Date().getTime();
     // After initializing VisualCaptcha, we only need to generate new options
    allowCORS( this.response );
    //console.log("--------------- SESSION!");
    //console.log(this.request.session);
    //console.log("-------------- SESSION!");
   //if ( ! this.request.session.VisualCaptcha ) {//Session.get('VisualCaptcha') ) {
        VisualCaptcha =  new Meteor.VisualCaptcha( this.request.session)
    //}
    var res = VisualCaptcha.start( howmany )
  //console.log("--------------- SESSION AFTER!");
    //console.log(this.request.session);
    //console.log("-------------- SESSION after!");

    return [200, res];
  }

  Meteor.methods({
    logSession: function(sid) {
      console.log(sid);
      Session.currentId = sid;
    }
  })
