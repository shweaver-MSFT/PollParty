(function() {
    "use strict";

    let StaticView = function () {

        let initialize = function (view, data) {
            
            let editButton = view.querySelector(".command-button");
            let questionText = view.querySelector(".question-text");

            editButton.disabled = true;

            // Get the question data
            let question = data["question"] || null;

            let finishSetup = function () {
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

            if (question !== null) {
                finishSetup();
            }
            else {
                // Attempt to retrieve the question from the backend 
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
                    finishSetup();
                });
                xhr.send();
            }
        };

        this.initialize = initialize;
        this.templateSelector = ".static.view";
    };

    window.PollParty.Views.StaticView = StaticView;

})();