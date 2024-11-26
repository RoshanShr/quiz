const express = require('express');
const app = express();
const path = require('path');


app.use(express.static(path.join(__dirname, 'files')));

app.get('/', (req, res) => {
    res.redirect('./home.html'); 
});

// app.get('/takeQuiz', (req, res) => {
//     fetch("https://opentdb.com/api.php?amount=10")
//     .then((response) => response.json())
//     .then((data) => {
//         res.send(data)
//     })
//     .catch((err) => {
//         res.send({message: "Some error occured while fetching questions"})
//     })

// });

app.get('/takeQuiz', async (req, res) => {
    try {
        const response = await fetch("https://opentdb.com/api.php?amount=10");
        const data = await response.json();
        res.send(data);
    } catch (err) {
        res.send({ message: "Some error occurred while fetching questions" });
    }
});

app.get('/cancelQuiz', (req, res) => {
    res.send({message: "You didn't wish to participate in the quiz contest"})
});


app.listen(3000, () => {
    console.log(`Server is running`);
});