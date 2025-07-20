const express = require("express");
const app = express();
app.use(express.json());

app.listen(8000, () => console.log("Server is listening on port 8000."));

//* This snippet above sets up a basic Express server. It starts by importing d express library u installed, enables JSON parsing for incoming requests (so we can work wt request bodies), n listens on port 3000. It's ready to handle RESTful routes like GET, POST, PUT, n DELETE as we build out our API.

//* Build RESTful Resources: With our Express app set up, let's build out d /movies resource using RESTful routes. We'll treat each movie as a resources n use HTTP methods to define what we want to do - retrieve, add, update, or delete movies. For simplicity, we'll store d movies in an in-memory array.

//* Here is d full set of routes. Add it in ur server.js file just under ur app.use(express.json())

//* In-memory database (for demonstration purposes)
//* In a real application, you would use a database like MongoDB, PostgreSQL, or MySQL.
const movies = [];

// Get all movies
app.get("/movies", (req, res) => {
  res.json(movies);
  console.log(movies);
});

// Get a particular movie by ID
app.get("/movies/:id", (req, res) => {
  // const movieId = parseInt(req.params.id, 10);
  // const movie = movies.find(m => m.id === movieId);
  // if (movie) {
  //     res.json(movie);
  // } else {
  //     res.status(404).json({ message: "Movie not found" });
  // }
  //* OR
  const movie = movies.find((m) => m.id === req.params.id);
  if (!movie) return res.status(404).json({ message: "Movie not found" });
  res.json(movie);
});

// Add a new movie
app.post("/movies", (req, res) => {
  // const newMovie = {
  //     id: Date.now().toString(), // Unique ID based on timestamp
  //     title: req.body.title,
  //     director: req.body.director,
  //     year: req.body.year
  // };
  // movies.push(newMovie);
  // res.status(201).json(newMovie);

  // OR
  const movie = {
    id: movies.length + 1, // Simple ID generation
    title: req.body.title,
    genre: req.body.genre,
    year: req.body.year,
  };
  movies.push(movie);
  res.status(201).json(movie);
});

// Update a movie by ID
app.put("/movies/:id", (req, res) => {
  const movie = movies.find((m) => m.id === req.params.id);
  if (!movie) return res.status(404).json({ message: "Movie not found" });

  // Update the movie details
  movie.title = req.body.title || movie.title;
  movie.genre = req.body.genre || movie.genre;
  movie.year = req.body.year || movie.year;

  res.json(movie);
});

// Delete a movie by ID
app.delete("/movies/:id", (req, res) => {
  const movieIndex = movies.findIndex((m) => m.id === req.params.id);
  if (movieIndex === -1)
    return res.status(404).json({ message: "Movie not found" });

  // Remove the movie from the array
  movies.splice(movieIndex, 1);
  res.status(204).send(); // No content to send back

  // Or
  const deletedMovie = movies.splice(movieIndex, 1);
  res.json(deletedMovie[0]);
});

//* The code above defines a complete set of RESTful routes for managing a movies resourse using Express.

//* It begins wt an in-memory array, movies, which acts as our temporary data store. The GET /movies route returns all books, while GET /movies/:id retrieves a specific movie by its ID using Array.find(), returning a 404 status if it's not found. The POST /movies route accepts JSON inputs, creates a new book wt an auto-incremented ID, and adds it to d array, returning d new resource wt a 201 Created status. PUT /movies/:id route handles full updates. Its first finds d book, an if found, updates its title, genre, n year wt d new values frm d request body. The DELETE /movies/:id route removes a movie by finding its index in d array n using splice(). If d movie doesn't exist, both PUT n DELETE return a 404 error.

//* These routes demontrate idempotency, meaning sending d same PUT or DELETE request multiple times will have d same effect as sending it once, a key REST principle. Each route also returns appropriate HTTP status codes n JSON responses, following REST conventions closely. (that making the same request multiple times will not change the result after the first successful request. For example, updating a movie with the same data will not change its state, and deleting a movie that has already been deleted will return a 404 error).

//* Each route follows a REST principle:
//* 1. Uses nouns for endpoints (/movies, /movies/:id) to represent resources.
//* 2. Uses standard HTTP methods (GET, POST, PUT, DELETE) to define actions.
//* 3. Returns appropriate HTTP status codes (200, 201, 204, 404) to indicate success or failure.
//* 4. Returns JSON responses for easy consumption by clients.
//* 5. Handles errors gracefully, returning meaningful messages when resources are not found or requests are invalid.
//** 6. Supports idempotency, ensuring that repeated requests (PUT, DELETE) have the same effect as a single request.

//* This structure keeps ur API predictable and easy to use, allowing clients to interact with the movie resources in a consistent manner. Exactly what REST is all about!

//* Middlewares: In RESTful APIs built wit frameworks like Express, middleware plays a key role in maintaining clean, modular, n consistent request handling. Middlewares are functions that sit in d middle of d request-response cycle in an Express app. When a client sends a request, middleware functions have access to d req (request), res(response), n next objects. They can inspect, modify, act on d request b4 it reaches d route handler or even terminate d response early. (In Express, middleware functions are functions that have access to the request object (req), the response object (res), and the next middleware function in the application’s request-response cycle. Middleware can perform a variety of tasks, such as logging requests, parsing request bodies, handling authentication, and more. They are executed in the order they are defined in your code).

//* You have already seen a middleware in action with app.use(express.json()), which parses incoming JSON request bodies. This is a built-in/global middleware function provided by Express that is used for parsing JSON. You can also create custom middleware to handle specific tasks, such as logging requests, validating data like POST n PUT, or handling errors.

//* Middleware for simple validation
const validateMovie = (req, res, next) => {
  if (!req.body.title || !req.body.genre || !req.body.year) {
    // return res.status(400).json({ message: "Title, genre, and year are required." });
    // OR
    return res.status(400).send("Title, genre, and year are required.");
  }
};
//* This middleware function, validateMovie, performs a simple validation check on incoming requests b4 they reach d route handler (to the /movies endpoint). It checks if the request body contains the required fields: title, genre, and year(if dtitle, genre, n year fields are present in d request body). If any of these fields are missing, it responds immediately with a 400 Bad Request status and an error message. If all required fields are present, it calls next() to pass control to the next middleware or route handler. This keeps validation logic separate n reusable from the route handlers, making the code cleaner and easier to maintain.

//* To use this middleware, pass it as an arg in ur POST and PUT routes like this:
app.post("/movies", validateMovie, (req, res) => {
  const movie = {
    id: movies.length + 1, // Simple ID generation
    title: req.body.title,
    genre: req.body.genre,
    year: req.body.year,
  };
  movies.push(movie);
  res.status(201).json(movie);
});

//* Test the API: Now that we have our RESTful API set up, we can test it using tools like Postman or cURL. These tools allow us to send HTTP requests to our server and see how it responds. We can test each route by sending GET, POST, PUT, and DELETE requests to the appropriate endpoints (e.g., http://localhost:8000/movies for GET, http://localhost:8000/movies/:id for GET by ID, etc.).
