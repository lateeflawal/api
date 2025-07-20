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
