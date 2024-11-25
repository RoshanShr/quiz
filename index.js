const express = require('express');
const fs = require('fs');
const app = express();
const cors = require('cors');

const path = require('path');

// fetch("https://opentdb.com/api.php?amount=10")
//     .then((response) => response.json())
//     .then((data) => {
//         console.log(data)
//     })
//     .catch((err) => {
//         console.log('Hello')
//     })
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

// Route to trigger the redirect
app.get('/home', (req, res) => {
    res.redirect('./home.html'); // Redirects to example.html in the public folder
});

// Route to trigger the redirect
app.get('/takeQuiz', (req, res) => {
    console.log("Taking quiz...")
    fetch("https://opentdb.com/api.php?amount=10")
    .then((response) => response.json())
    .then((data) => {
        console.log('Sending dat...')
        console.log(data)
        res.send(data)
    })
    .catch((err) => {
        console.log('Hello')
    })
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});