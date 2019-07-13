const randomize = require('randomatic');
(function () {

    let Question = function (slideId, questionText) {

        this.slideId = slideId;
        this.questionText = questionText;
    };

    let QuestionSet = function (presentationId) {

        let questions = [];

        function addUpdateQuestion(slideId, questionText) {

            let q = getBySlideId(slideId);
            if (q !== undefined) {
                q.questionText = questionText;
            }
            else {
                q = new Question(slideId, questionText);
                questions.push(q);
            }
        }

        function getBySlideId(slideId) {
            return questions.find((q) => q.slideId == slideId);
        }

        this.presentationId = presentationId;
        this.questions = questions;
        this.addUpdateQuestion = addUpdateQuestion;
        this.getBySlideId = getBySlideId;
    };

    let Response = function (slideId, responseBool) {

        this.slideId = slideId;
        this.responseBool = responseBool;
    };

    let ResponseSet = function () {

        let responses = [];

        this.responses = responses;
    };

    let Session = function (presentationId) {

        let code = randomize('0', 4);
        let responseSet = new ResponseSet();
        let currentQuestion = null;
        let currentQuestionIndex = 0;
        let questionTotal = 0;

        this.presentationId = presentationId;
        this.code = code;
        this.responseSet = responseSet;
        this.currentQuestion = currentQuestion;
        this.currentQuestionIndex = currentQuestionIndex;
        this.questionTotal = questionTotal;
    };

    module.exports = { Question, QuestionSet, Response, ResponseSet, Session };
})();