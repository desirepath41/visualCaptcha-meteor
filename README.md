[![Build Status](https://travis-ci.org/emotionLoop/visualCaptcha-meteor.png?branch=master)](https://travis-ci.org/emotionLoop/visualCaptcha-meteor)

## Deprecation notice

This version is now deprecated and unsupported. Meteor changed its API a lot and it has become impossible for us to focus on it for now.

# visualCaptcha Meteor API Demo (deprecated)

This is a demo Meteor that uses the [meteorite visualCaptcha package](https://github.com/emotionLoop/visualCaptcha-meteorite) and the [visualCaptcha jQuery plugin bower package](https://github.com/emotionLoop/visualCaptcha-frontend-jquery), as a proof-of-concept for how to integrate it with your Meteor project.


## Installation

- Install meteor if you haven't already with: `$ curl https://install.meteor.com | /bin/sh`
- Install meteorite if you haven't already with `npm install -g meteorite`
- After cloning the repo, run `mrt install` to download and install all packages and dependencies


## Run server

To start the server on port 8282 (default), run the following command:

```
npm start
```


## API

visualCaptcha, since 5.0, uses an API for increased security and to become back-end-agnostic (that's why you can easily plug-in a Vanilla JS, AngularJS, or jQuery front-end without changing anything).

It expects the following routes to exist, which we've put in this sample.

You are expected to have these routes in your implementation, but you can change them in visualCaptcha's front-end config.

### GET `/start/:howmany`

This route will be the first route called by the front-end, which will generate and store session data.

Parameters:

- `howmany` is required, the number of images to generate.

### GET `/image/:index`

This route will be called for each image, to get it and show it, by index.

Parameters:

- `index` is required, the index of the image you want to get.

### GET `/audio(/:type)`

This route will be called for the audio file, to get it and play it, either the mp3 or ogg file.

Parameters:

- `type` is optional, the audio file format defaults to `mp3`, but can also be `ogg`.

### POST `/try` 

This is just a sample route, where we post the form to, and where the visualCaptcha validation takes place.


## License

MIT. Check the LICENSE file.

## Coding guidelines / Code style

View [http://jscode.org/readable](http://jscode.org/readable)
