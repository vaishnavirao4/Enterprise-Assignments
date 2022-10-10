var SERVER_NAME = 'image-api'
var PORT = 5000;
var HOST = '127.0.0.1';


var restify = require('restify')

  // Get a persistence engine for the users
  , imagesSave = require('save')('images')

  // Create the restify server
  , server = restify.createServer({ name: SERVER_NAME})

  server.listen(PORT, HOST, function () {
  console.log('Server %s listening at %s', server.name, server.url)
  console.log('Endpoints: %s/images',server.url)

})

server
  // Allow the use of POST
  .use(restify.fullResponse())

  // Maps req.body to req.params so there is no switching between them
  .use(restify.bodyParser())

// Get all users in the system
server.get('/images', function (req, res, next) {

  // Find every entity within the given collection
  imagesSave.find({}, function (error, images) {

    // Return all of the users in the system
    res.send(images)
  })
})


// Create a new user
server.post('/images', function (req, res, next) {
  
  if (req.params.imageId === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('image must be supplied'))
  }
  // Make sure name is defined
  if (req.params.name === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('name must be supplied'))
  }
  if (req.params.url === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('age must be supplied'))
  }
  if (req.params.size === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('name must be supplied'))
  }

  var newImage = {
    imageId: req.params.imageId,
		name: req.params.name, 
		url: req.params.url,
    size: req.params.size
	}

  // Create the user using the persistence engine
  imagesSave.create( newImage, function (error, image) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    // Send the user if no issues
    res.send(201, image)
  })
})


// Delete user with the given id
server.del('/images', function (req, res, next) {

  // Delete the user with the persistence engine
  imagesSave.deleteMany({}, function (error, user) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    // Send a 200 OK response
    res.send()
  })
})


