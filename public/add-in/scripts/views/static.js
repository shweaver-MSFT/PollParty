(function () {
    "use strict";

    let StaticView = function () {

        let initialize = async function (view, data) {

            let editButton = view.querySelector(".command-button");
            let questionTextSpan = view.querySelector(".question-text");
            let questionCountDiv = view.querySelector('.question-count');

            editButton.disabled = true;

            // Get the question data
            let questionData = (data !== undefined) ? data.questionData : null;

            let finishSetup = function () {

                if (questionData === null) {
                    return;
                }

                // Configure question text
                questionTextSpan.innerText = questionData.currentQuestion.text;

                // Configure edit button
                editButton.disabled = false;
                editButton.addEventListener("click", function () {

                    // Navigate to the edit view
                    window.PollParty.App.navigate(window.PollParty.Views.EditView, {
                        question: questionData.currentQuestion
                    });
                });

                // Configure question index and total
                questionCountDiv.innerText = `${questionData.currentQuestion.questionIndex}/${questionData.questionTotal}`;
            }

            if (questionData !== null) {
                finishSetup();
            }
            else {
                // Attempt to retrieve the question from the backend 
                // using the presentation id and slide id
                let presentationId = window.PollParty.Helpers.PowerPointHelper.getPresentationId();
                let slideId = await window.PollParty.Helpers.PowerPointHelper.getSelectedSlideId();

                let url = `./api/question?pid=${presentationId}&sid=${slideId}`;

                let xhr = new XMLHttpRequest();
                xhr.responseType = "json";
                xhr.open("GET", url);
                xhr.addEventListener("load", function () {
                    if (xhr.status !== 200) {
                        return;
                    }

                    // Inspect json and populate the question object
                    questionData = xhr.response;
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