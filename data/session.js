// session class exposing CRUD operations to add, read, edit, delete sessions
class session { 
    
    static get(id){
        return this.sessions.find(session => session.id == id);         
    }    

    static save(id, currentSlideId, presentationId, responses){
        this.sessions.push({id: id, currentSlideId: currentSlideId, presentationId: presentationId, responses: responses });
    }

    static edit(id, presentationId, currentSlideId, responses){
        var item = get(id);
        item.currentSlideId = currentSlideId;
        item.presentationId = presentationId;
        item.responses = responses;
    }

    static delete(id){
        this.sessions.pop(get(id));
    }    
}

session.sessions = [];

module.exports = session;
