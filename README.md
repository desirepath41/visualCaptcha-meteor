# visualCaptcha Meteor API Demo [![Build Status](https://travis-ci.org/emotionLoop/visualCaptcha-meteor.png?branch=master)](https://travis-ci.org/emotionLoop/visualCaptcha-meteor)

A demo Meteor API that uses visualCaptcha package (which in turn uses the visualcaptcha npm module), as a proof-of-concept for how to integrate it with your meteor project.


## Installation

+ Install meteor if you haven't already with: `$ curl https://install.meteor.com | /bin/sh`
+ Install meteorite if you haven't already with `npm install -g meteorite`
+ After cloning the repo, run `mrt install` to download all dependent packages.


## Run server

Run next command to start the API server on port 8282 (default):

```
npm start
```


## Coding guidelines / Code style

View [http://jscode.org/readable](http://jscode.org/readable)



## API

### GET `/start/:howmany`

This route is for generation common data (image field name, image name, image values and audio field name) for visual captcha front-end.

Parameters:

- `howmany` is required, the number of images to generate.

### GET `/image/:index`

This route is for getting generated image file by index. 

Parameters:

- `index` is required, the index of the image you wish to get.

### GET `/audio/?:type?`

This route is for getting generated audio file.

Parameters:

- `type` is optional, the audio file format and defaults to `mp3`, but can also be `ogg`.

### POST `/try` 

It is a demo example of validating the visual captcha.


## License

The MIT License (MIT)

Copyright (c) 2014 emotionLoop

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
