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

    let Response = function(slideId, responseBool) {

        this.slideId = slideId;
        this.responseBool = responseBool;
    };

    let ResponseSet = function() {

        let responses = [];
        let trueCount = 0;
        let falseCount = 0;
        
        function addResponse(response) {
            
            responses.push(response);

            if (response.responseBool == true) {
                trueCount++;
            }
            else {
                falseCount++;
            }
        }

        this.responses = responses;
        this.trueCount = trueCount;
        this.falseCount = falseCount;
        this.addResponse = addResponse;
    };

    let Session = function(presentationId) {

        let code = 1234;// TODO: GenCode here
        let responseSet = new ResponseSet();

        function respond(slideId, responseBool) {
            let response = new Response(slideId, responseBool);
            responseSet.addResponse(response);
        }

        this.presentationId = presentationId;
        this.code = code;
        this.responseSet = responseSet;
        this.respond = respond;
    };

    module.exports = { Question, QuestionSet, Response, ResponseSet, Session };
})();