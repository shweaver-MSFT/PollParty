// Question class exposing CRUD operations to add, read, edit, delete questions
class question { 
    
    static get(id){
        return this.questions.find(q => q.id == id); 
    }    

    static save(slideId, presentationId, text){
        this.questions.push({id: this.id + 1, slideId: slideId, presentationId: presentationId, text: text });
    }

    static edit(id, slideId, presentationId, text){
        var item = get(id);
        item.slideId = slideId;
        item.presentationId = presentationId;
        item.text = text;
    }

    static delete(id){
        this.questions.pop(get(id));
    }    
}

// Some mock data
question.questions = [{id: 1, slideId: 1, presentationId: 1, text: "Poll Party Hello World?"}];

module.exports = question;
