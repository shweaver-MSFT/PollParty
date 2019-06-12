// Question class to store questions and question count.
class question {

    static getForPresentation(presentationId) {
        return this.data.questions.find(item => item.presentationId === presentationId);
    }

    static getById(id) {
        return this.data.questions.find(item => item.id == id);
    }

    // returns current question and total questions count.
    static get(presentationId, slideId) {
        var question = this.data.questions.find(item => item.presentationId === presentationId && item.slideId === slideId);
        return { questionTotal: this.data.questionTotal, currentQuestion: question };
    }

    // returns current question
    static getCurrentQuestion(presentationId, slideId) {
        var question = this.data.questions.find(item => item.presentationId === presentationId && item.slideId === slideId);
        return question;
    }


    static save(presentationId, slideId, text) {
        let question = this.getCurrentQuestion(presentationId, slideId);

        this.data.questionTotal = this.data.questionTotal + 1;
        if (question === null || question === undefined) {
            // create new
            question = {
                id: presentationId + '-' + slideId,
                slideId: slideId,
                presentationId: presentationId,
                text: text,
                questionIndex: this.data.questionTotal
            };
            this.data.questions.push(question);
        }
        else {
            //update
            question.text = text;
        }

        return { questionTotal: this.data.questionTotal, currentQuestion: question };
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
