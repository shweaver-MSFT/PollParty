// session class exposing CRUD operations to create, read, update, delete sessions
var randomize = require('randomatic');
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
    static updateSession(sessionId, slideId, response){
        var session = this.sessions.find(s=> s.sessionId == sessionId && s.currentSlideId == slideId);
        if(session != null) {
            if(response == true){
                session.responses.yes++; 
            }
            else{
                session.responses.no++;
            }
            return true;
        }
        return false;
    }

    // get session response counts for the current question
    static getSession(sessionId, slideId){
        var session = this.sessions.find(s=> s.sessionId == sessionId && s.currentSlideId == slideId);
        var currentQuestion = questionsData.get(slideId, session.presentationId).text; 
        return {question: currentQuestion, responseCountYes: session.responses.yes, responseCountNo: session.responses.no};
    }
    
    static get(sessionId){
        return this.sessions.find(session => session.sessionId == sessionId);         
    }    

    // delete all sessions with session id
    static delete(sessionId){
        this.sessions = this.sessions.filter(s => s.sessionId != sessionId);
    }    
}

session.sessions = [];

module.exports = session;
