# visualCaptcha Meteor API Demo

A demo Meteor API that uses visualCaptcha package (which in turn uses the visualcaptcha npm module), as a proof-of-concept for how to integrate it with your meteor project.

## Starting it

To start it, run `npm start` and it'll start the API server on port http://localhost:8282/

## Trying it out

The routes that exist are:

* GET /start/:howmany
* GET /image/:index
* GET /audio
* POST /

# Developers

##Installing everything

Assuming you already installed [Meteor.js](http://www.meteor.com) and [Meteorite](https://github.com/oortcloud/meteorite).

+ Clone the [package's repo](https://git.assembla.com/visualcaptcha.meteor_pkg.git)
+ Clone this repo
+ Edit smart.json and edit the path of visualcaptcha to your local copy of the package
+ Run `mrt add visualcaptcha` 
+ Start the api using `npm start`


## Coding guidelines / Code style

View http://jscode.org/readable

