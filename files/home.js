
class Quiz {
    constructor() {
        this.marks = 0;
        this.currentQuestionIndex = 0;
        this.questions = [];
    }

    async takeQuiz(type) {
        this.setQuizType(type);
        try {
            const response = await fetch('http://localhost:3000/takeQuiz');

            if (response.status !== 200) {
                console.error('Looks like there was a problem. Status Code:', response.status);
                return;
            }

            const data = await response.json();
            this.questions = data.results;

            if (data.response_code === 0) {
                this.populateQuestion();
            } else {
                alert("Questions returned empty from API. Please try again");
                $('button').prop('disabled', false);
                $('#yes_btn').html('Yes');
            }
        } catch (err) {
            console.error(err);
        }
    }

    cancelQuiz() {
        fetch('http://localhost:3000/cancelQuiz')
            .then(response => {
                if (response.status !== 200) {
                    console.error('Looks like there was a problem. Status Code:', response.status);
                    return;
                }
                return response.json();
            })
            .then(data => {
                alert(data.message);
            })
            .catch(err => {
                console.error(err);
            });
    }

    populateQuestion() {
        if (this.currentQuestionIndex <= this.questions.length - 1) {
            $('#first_section').remove();
            $('#question_section').css('display', 'block');
            $('#question').html(`${this.currentQuestionIndex + 1}. ${this.questions[this.currentQuestionIndex].question}`);

            if (this.currentQuestionIndex !== 0) {
                this.checkAnswer($('#option_select').val(), this.currentQuestionIndex - 1);
            }

            this.populateOptions();

            if (this.currentQuestionIndex !== 0) {
                $(`#btn_${this.currentQuestionIndex}`).remove();
            }

            this.currentQuestionIndex++;
        } else {
            this.quizCompleted();
        }
    }

    populateOptions() {
        console.log( this.questions);
        let option_html = '';
        let options = this.questions[this.currentQuestionIndex]['incorrect_answers'];
        if (this.questions[this.currentQuestionIndex].type == 'multiple') {
            options.push(this.questions[this.currentQuestionIndex]['correct_answer']);
    
            let shuffle_options = options.sort();
            shuffle_options.forEach((e, ind, a) => {
                option_html += `<option value="${e}">${e}</option>`;
            })
        } else if (this.questions[this.currentQuestionIndex].type == 'boolean') {
            option_html = '<option value="True">True</option><option value="False">False</option>'
        }
        $('#option_select').html(option_html);
        $('#options').append(`<button class="btn btn-primary mb-2" id="btn_${this.currentQuestionIndex}" onclick="quiz.populateQuestion()">Submit answer</button>`);
    }

    quizCompleted() {
        $('#question_section').css('display', 'none');
        $('#result_section').css('display', 'block');
        this.checkAnswer($('#option_select').val(), this.currentQuestionIndex - 1);
        $('#result_section').html(`
            <h4>You have completed the quiz:</h4>
            <button class="btn btn-primary mb-2" onClick="quiz.showMarks()">Show marks</button>
        `);
    }

    setQuizType(type) {
        if (type === 'retake') {
            $('#result_section').css('display', 'none');
            this.marks = 0;
            this.currentQuestionIndex = 0;
            this.questions = [];
            $('#btn_0').remove();
        } else {
            $('button').prop('disabled', true);
            $('#yes_btn').html('Please wait...');
        }
    }

    checkAnswer(selectedAnswer, questionIndex) {
        if (selectedAnswer === this.questions[questionIndex].correct_answer) {
            this.marks++;
        }
    }

    showMarks() {
        $('#result_section').html(`
            <div class="alert alert-info" role="alert">
                Your total marks is: ${this.marks}
            </div>
            <button type="button" class="btn btn-success btn-lg" onclick="quiz.takeQuiz('retake')">Retake quiz</button>
        `);
    }
}

// Instantiate the Quiz class
// const quiz = new Quiz();
