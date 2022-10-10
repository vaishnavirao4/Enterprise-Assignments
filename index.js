var SERVER_NAME = 'image-api'
var PORT = 5000;
var HOST = '127.0.0.1';

var getCounter = 0;
var postCounter = 0;


var restify = require('restify')

  // This is to get a persistence engine for the images
  , imagesSave = require('save')('images')

  // The below method is going to create the restify server
  , server = restify.createServer({ name: SERVER_NAME})

  server.listen(PORT, HOST, function () {
  console.log('Server %s listening at %s', server.name, server.url)
  console.log('Endpoints: %s/images',server.url)

})

server
  .use(restify.fullResponse())

  .use(restify.bodyParser())

// Get all images present in the system
server.get('/images', function (req, res, next) {
  console.log('> images GET: received request')
  
  getCounter++;

  // Find every entity within the given collection
  imagesSave.find({}, function (error, images) {

    // Returns all of the images in the system
    res.send(images)
    console.log(' < images GET: sending response')
  })
  console.log('Processed Request Count--> GET: %s, POST: %s',getCounter,postCounter)

})


// Create a new image
server.post('/images', function (req, res, next) {
  console.log(' > images POST: received request')
  postCounter++;
  
  if (req.params.imageId === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('imageId must be supplied'))
  }

  // To define the name
  if (req.params.name === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('name must be supplied'))
  }

  if (req.params.url === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('url must be supplied'))
  }

  if (req.params.size === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('size must be supplied'))
  }

  var newImage = {
    imageId: req.params.imageId,
		name: req.params.name, 
		url: req.params.url,
    size: req.params.size
	}

  // Create the image using the persistence engine
  imagesSave.create( newImage, function (error, image) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    // Send the image if there are no issues
    res.send(201, image)
    console.log(' < images POST: sending response')
  })
  console.log('Processed Request Count--> GET: %s, POST: %s',getCounter,postCounter)

})


// Delete the image with the given Image id
server.del('/images', function (req, res, next) {

  // Delete the image with the persistence engine
  imagesSave.deleteMany({}, function (error, user) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    // Send a response
    res.send()
  })
})


