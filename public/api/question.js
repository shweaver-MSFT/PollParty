// Question class to store questions and question count.
class question {

    static getForPresentation(presentationId) {
        return this.data.questions.find(item => item.presentationId === presentationId);
    }

    static save(slideId, presentationId, text){
        this.data.questions.push({
            id: this.id + 1, 
            slideId: slideId, 
            presentationId: presentationId, 
            text: text 
        });
    }

    static getById(id) {
        return this.data.questions.find(item => item.id == id);
    }

    static get(presentationId, slideId) {
        return this.data.questions.find(item => item.presentationId === presentationId && item.slideId === slideId);
    }

    static save(presentationId, slideId, text, questionIndex) {
        let item = this.get(presentationId, slideId);
        if (item === null) {
            // create new
            this.data.questions.push({
                id: slideId + presentationId,
                slideId: slideId,
                presentationId: presentationId,
                text: text,
                questionIndex: questionIndex
            });
        }
        else {
            //update
            item.text = text;
            item.questionIndex = questionIndex;
        }
        
        this.data.questionTotal = questionTotal + 1;

        return { 
            questionTotal: this.data.questionTotal,
             currentQuestion: item 
        };
    }
}

// Some mock data
question.data = {
    questionTotal: 0,
    questions: []
};

// sample data
// question.data = {
//     questionTotal: 0,
//     questions: [{
//         id: null,
//         slideId: 1,
//         presentationId: 1,
//         questionIndex: 1,
//         text: "Poll Party Hello World?"
//     }]
// };

module.exports = question;
