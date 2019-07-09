// session class exposing CRUD operations to create, read, update, delete sessions
// A unique session is created when the powerpoint is being presented and the presenter/teacher is on a slide with a content add- in question.
// todo- Currently a new session is created each time, we need to update to have one session for all questions when teacher starts presenting.
// Session  stores responses information from audience.

const randomize = require('randomatic');
const questionsData = require('./questionData');

class session {

    // Get question from session id and slide id
    static joinSession(sessionId, slideId) {
        var presentationId = this.get(sessionId).presentationId;
        var currentQuestion = questionsData.get(slideId, presentationId);
        return currentQuestion.text;
    }

    // get session response counts for the current question
    /*static getSession(sessionId, slideId){
        var session = this.sessions.find(s=> s.sessionId == sessionId && s.currentSlideId == slideId);
        var currentQuestion = questionsData.get(slideId, session.presentationId).text; 
        return {question: currentQuestion, responseCountYes: session.responses.yes, responseCountNo: session.responses.no};
    }*/

    // delete all sessions with session id
    /*static delete(sessionId){
        this.sessions = this.sessions.filter(s => s.sessionId != sessionId);
    }*/

    // update session with each response
    static addResponse(sessionId, response) {
        var sessionData = session.get(sessionId);
        if (sessionData !== null) {
            if (response == true) {
                sessionData.currentResponses.yes++;
            }
            else {
                sessionData.currentResponses.no++;
            }
            return true;
        }
        return false;
    }

    // Get a session by id/code
    static get(sessionId) {
        return this.sessions.find(session => session.code == sessionId);
    }

    // Get an existing session for a presentation. If none, create a new one.
    static getCreate(presentationId, slideId) {

        // Get questions from question API associated with this presentationId
        let questions = questionsData.getForPresentation(presentationId);

        // no questions found
        if (questions.length === 0)
            return null;

        let sessionData = this.sessions.find((s) => s.presentationId == presentationId);

        if (sessionData === undefined) {

            sessionData = {
                code: randomize('0', 4),
                presentationId: presentationId,
                questionTotal: null,
                currentQuestionIndex: null,
                currentQuestion: null,
                currentResponses: {
                    yes: 0,
                    no: 0
                }
            };
        }

        // Assign the current question based upon the slideId
        let currentQuestion = questions.find((q) => q.slideId === slideId);

        sessionData.questionTotal = questions.length;
        sessionData.currentQuestionIndex = questions.indexOf(currentQuestion);
        sessionData.currentQuestion = currentQuestion;

        return sessionData;
    }
}

session.sessions = [{
    code: 1234, // Let's use a 4 digit code as the sessionId, instead of a guid.
    presentationId: 1,
    questionTotal: 1,
    currentQuestionIndex: 1,
    currentQuestion: {
        id: 1,
        slideId: 1,
        presentationId: 1,
        text: "Poll Party Hello World?",
    },
    currentResponses: {
        yes: 0,
        no: 0
    },
}];

module.exports = session;
