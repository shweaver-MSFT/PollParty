(function() {
    "use strict";

    let StaticView = function () {

        let initialize = function (view, data) {
            
            let editButton = view.querySelector(".command-button");
            let questionText = view.querySelector(".question-text");

            // Get the question data
            let question = data["question"] || null;
            if (question === null) {
                
                // TODO: Move fetch code to separate class
                // TODO: Attempt to retrieve the question from the backend 
                // using the presentation id and slide id
                let presentationId = 1;
                let slideId = 1;

                let url = `./api/question?pid=${presentationId}&sid=${slideId}`;

                let xhr = new XMLHttpRequest();
                xhr.responseType = "json";
                xhr.open("GET", url);
                xhr.addEventListener("load", function() {
                    if (xhr.status !== 200) {
                        return;
                    }
                    
                    // Inspect json and populate the question object
                    question = xhr.response;
                    if (question !== null) {

                        // Configure question text
                        questionText.innerText = question.text;
                    
                        // Configure edit button
                        editButton.disabled = false;
                        editButton.addEventListener("click", function() {
                            
                            // Navigate to the edit view
                            window.PollParty.App.navigate(window.PollParty.Views.EditView, {
                                question: question
                            });
                        });
                    }
                });
                xhr.send();
            }
        };

        this.initialize = initialize;
        this.templateSelector = ".static.view";
    };

    window.PollParty.Views.StaticView = StaticView;

})();