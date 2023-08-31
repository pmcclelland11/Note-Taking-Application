// Import required modules
const express = require('express');
const path = require('path');
const fs = require('fs');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse request body as JSON and handle URL-encoded data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Path to the JSON database file
const dbPath = path.join(__dirname, 'db', 'db.json');

// API routes

// Route to get notes from the database
app.get('/api/notes', (req, res) => {
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) throw err;
    res.json(JSON.parse(data));
  });
});

// Route to save a new note to the database
app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) throw err;
    const notes = JSON.parse(data);
    newNote.id = notes.length + 1;
    notes.push(newNote);
    fs.writeFile(dbPath, JSON.stringify(notes), (err) => {
      if (err) throw err;
      res.json(newNote);
    });
  });
});

// Route to delete a note from the database
app.delete('/api/notes/:id', (req, res) => {
  const id = parseInt(req.params.id);
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) throw err;
    const notes = JSON.parse(data);
    const updatedNotes = notes.filter(note => note.id !== id);
    fs.writeFile(dbPath, JSON.stringify(updatedNotes), (err) => {
      if (err) throw err;
      res.sendStatus(200);
    });
  });
});

// HTML routes

// Route to serve the notes page
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

// Catch-all route to serve the index page
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
