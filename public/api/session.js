// session class exposing CRUD operations to create, read, update, delete sessions
const randomize = require('randomatic');
const questionsData = require('./question');

class session {     

    // creates a new session and returns session join code
    static createSession(presentationId, slideId){
        var sessionId = randomize('0', 4);
        this.sessions.push({sessionId: sessionId, currentSlideId: slideId, presentationId: presentationId, responses: {yes:0, no:0} });
        return sessionId;
    }

    // Get question from session id and slide id
    static joinSession(sessionId, slideId){
        var presentationId = this.get(sessionId).presentationId;
        var currentQuestion = questionsData.get(slideId, presentationId);
        return currentQuestion.text;
    }

    // update session with each response
    static addResponse(sessionId, response){
        var sessionData = session.get(sessionId);
        if(sessionData !== null) {
            if(response == true){
                sessionData.currentResponses.yes++; 
            }
            else{
                sessionData.currentResponses.no++;
            }
            return true;
        }
        return false;

    }

    // get session response counts for the current question
    /*static getSession(sessionId, slideId){
        var session = this.sessions.find(s=> s.sessionId == sessionId && s.currentSlideId == slideId);
        var currentQuestion = questionsData.get(slideId, session.presentationId).text; 
        return {question: currentQuestion, responseCountYes: session.responses.yes, responseCountNo: session.responses.no};
    }*/
    
    // Get a session by id/code
    static get(sessionId){
        return this.sessions.find(session => session.code == sessionId);         
    }    

    // delete all sessions with session id
    /*static delete(sessionId){
        this.sessions = this.sessions.filter(s => s.sessionId != sessionId);
    }*/   
}

session.sessions = [{
    code: 1234, // Let's use a 4 digit code as the sessionId, instead of a guid.
    presentationId: 1, 
    questionTotal: 1,
    currentQuestionIndex: 1,
    currentQuestion: {
        id: 1, 
        slideId: 1, 
        text: "Poll Party Hello World?",
    },
    currentResponses: {
        yes: 0,
        no: 0
    },
}];

module.exports = session;
