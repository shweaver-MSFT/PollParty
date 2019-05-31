// Question class exposing CRUD operations to add, read, edit, delete questions
class question { 
    
    static getById(id){
        return this.questions.find(item => item.id == id); 
    }
    
    static get(presentationId, slideId){
        return this.questions.find(item => item.presentationId === presentationId && item.slideId === slideId);
    }

    static save(slideId, presentationId, text){
        this.questions.push({id: this.id + 1, slideId: slideId, presentationId: presentationId, text: text });
    }

    static edit(id, slideId, presentationId, text){
        var item = this.get(id);
        item.slideId = slideId;
        item.presentationId = presentationId;
        item.text = text;
    }

    static delete(id){
        this.questions.pop(this.get(id));
    }    
}

// Some mock data
question.questions = [{id: 1, slideId: 1, presentationId: 1, text: "Poll Party Hello World?"}];

module.exports = question;
