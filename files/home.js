let marks = 0;
let j = 0;
var question = [];

// function takeQuiz(type) {
//     quizType(type);
//     fetch('http://localhost:3000/takeQuiz')
//         .then(function (response) {
//             if (response.status !== 200) {
//                 console.log(
//                     'Looks like there was a problem. Status Code: ' + response.status
//                 );
//                 return;
//             }
//             response.json().then(function (data) {
//                 question = data.results;
//                 if (data.response_code == 0) {
//                     populateQuestion();
//                 } else {
//                     alert("Questions returned empty from API. Please try again");
//                     $('button').prop('disabled', false);
//                     $('#yes_btn').html('Yes')
//                 }
//             });
//         })
//         .catch(function (err) {
//             console.log(err);
//         });
// }

async function takeQuiz(type) {
    quizType(type);
    try {
        const response = await fetch('http://localhost:3000/takeQuiz');
        
        if (response.status !== 200) {
            console.log('Looks like there was a problem. Status Code: ' + response.status);
            return;
        }
        
        const data = await response.json();
        question = data.results;

        if (data.response_code === 0) {
            populateQuestion();
        } else {
            alert("Questions returned empty from API. Please try again");
            $('button').prop('disabled', false);
            $('#yes_btn').html('Yes');
        }
    } catch (err) {
        console.log(err);
    }
}


// Do not need to this but still doing it fetching the request
function cancelQuiz() {
    fetch('http://localhost:3000/cancelQuiz')
        .then(function (response) {
            if (response.status !== 200) {
                console.log(
                    'Looks like there was a problem. Status Code: ' + response.status
                );
                return;
            }
            response.json().then(function (data) {
                let message = data.message;
                alert(message);

            });
        })
        .catch(function (err) {
            console.log(err);
        });
}

function populateQuestion() {
    if (j <= question.length - 1) {
        $('#first_section').remove();
        $('#question_section').css('display', 'block')
        $('#question').html(j + 1 + '. ' + question[j]['question']);

        if (j != 0) {
            checkAnswer($('#option_select').val(), j - 1)
        }

        populateOptions();
        if (j != 0) {
            $(`#btn_${j}`).remove();
        }
        j++;
    } else {
        quizCompleted();
    }
}

function populateOptions() {
    var option_html = '';
    let options = question[j]['incorrect_answers'];
    if (question[j].type == 'multiple') {
        options.push(question[j]['correct_answer']);

        let shuffle_options = options.sort();
        options.forEach((e, ind, a) => {
            option_html += `<option value="${e}">${e}</option>`;
        })
    } else if (question[j].type == 'boolean') {
        option_html = '<option value="True">True</option><option value="False">False</option>'
    }
    $('#option_select').html(option_html);
    $('#options').append(`<button class="btn btn-primary mb-2" id="btn_${j}" onclick="populateQuestion(${j})">Submit answer</button>`);


}

function quizCompleted() {
    $('#question_section').css('display', 'none');
    $('#result_section').css('display', 'block');
    checkAnswer($('#option_select').val(), j - 1)
    $('#result_section').html('<h4>You have completed the quiz:</h4><button class="btn btn-primary mb-2" onClick="showMarks()">Show marks</button>')
}

function quizType(type) {
    if (type == 'retake') {
        $('#result_section').css('display', 'none');
        marks = 0;
        j = 0;
        question = [];
        $('#btn_0').remove()
    } else {
        $('button').prop('disabled', true);
        $('#yes_btn').html('Please wait...')
    }
}

function checkAnswer(sel_ans, q_num) {
    if (sel_ans == question[q_num]['correct_answer']) {
        marks++;
    }
}

function showMarks() {
    $('#result_section').html(`<div class="alert alert-info" role="alert">Your total marks is: ${marks}</div><button type="button" class="btn btn-success btn-lg"
          onclick="takeQuiz('retake')">Retake quiz</button>`);
}