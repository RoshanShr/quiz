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
//app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/home', (req, res) => {
    res.redirect('./home.html'); 
});


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
app.get('/cancelQuiz', (req, res) => {
    res.send({message: "You didn't wish to participate in the quiz contest"})

});



app.listen(3000, () => {
    console.log(`Server is running`);
});