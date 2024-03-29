# NodeJS Playground Project

### Application description
It is necessary to create an application that allows users to register and after successful registration to create an album and add/upload images to the album. While adding images, the user can add hashtags or tag other users.

All other registered users can see the homepage where they should be able to search for images using hashtags or user tags with suggestions. Also, users can give their rating to the image (thumbs up / down or like and dislike).

### Required functionality

- Homepage
  - list images
  - search images using hashtags or user tags with suggestions
  - if the user is logged in, display the rating buttons.
  - preselect button if user like or dislike specific image
- Profile
  - display all private albums
  - create a new private album
- Album Details
  - list images for the specified album
  - add a new image with suggestions for:
    - hashtags (#nature, #sun, #love, #cat)
    - user (foo@bar, john@doe)
- Login page
- Register page
  - send an email to the activate account


Express & ES6 REST API Boilerplate
==================================

[![bitHound Score](https://www.bithound.io/github/developit/express-es6-rest-api/badges/score.svg)](https://www.bithound.io/github/developit/express-es6-rest-api)

This is a straightforward boilerplate for building REST APIs with ES6 and Express.

- ES6 support via [babel](https://babeljs.io)
- REST resources as middleware via [resource-router-middleware](https://github.com/developit/resource-router-middleware)
- CORS support via [cors](https://github.com/troygoode/node-cors)
- Body Parsing via [body-parser](https://github.com/expressjs/body-parser)

> Tip: If you are using [Mongoose](https://github.com/Automattic/mongoose), you can automatically expose your Models as REST resources using [restful-mongoose](https://git.io/restful-mongoose).

Getting Started
---------------

```sh
# clone it
git clone git@github.com:developit/express-es6-rest-api.git
cd express-es6-rest-api

# Make it your own
rm -rf .git && git init && npm init

# Install dependencies
npm install

# Start development live-reload server
PORT=8080 npm run dev

# Start production server:
PORT=8080 npm start
```
Docker Support
------
```sh
cd express-es6-rest-api

# Build your docker
docker build -t es6/api-service .
#            ^      ^           ^
#          tag  tag name      Dockerfile location

# run your docker
docker run -p 8080:8080 es6/api-service
#                 ^            ^
#          bind the port    container tag
#          to your host
#          machine port   

```

Docker Demo
-------------------------
It's supposed to be pretty easy to take your Docker to your favourite cloud service, here's a demo of what's our Dockerized bolierplate is like: [https://docker-deployment-yudfxfiaja.now.sh/api](https://docker-deployment-yudfxfiaja.now.sh/api)

License
-------

MIT
