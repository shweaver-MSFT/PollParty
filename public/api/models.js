(function() {

    let Question = function(slideId, questionText) {

        this.slideId = slideId;
        this.questionText = questionText;
    };

    let QuestionSet = function(presentationId) {
        
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

        function getById(questionId) {
            return questions.find((q) => q.id == questionId);
        }

        function getBySlideId(slideId) {
            return questions.find((q) => q.slideId == slideId);
        }

        this.presentationId = presentationId;
        this.questions = questions;
        this.addUpdateQuestion = addUpdateQuestion;
        this.getById = getById;
        this.getBySlideId = getBySlideId;
    };

    let Session = function(presentationId) {

        let questionSet = new QuestionSet(presentationId);
        let code = null;// TODO: GetCode here
        //let responses = []
    };

    module.exports = { Question, QuestionSet, Session };
})();