(function () {
    "use strict";

    let StaticView = function () {

        let initialize = async function (view, data) {

            let editButton = view.querySelector(".command-button");
            let questionTextSpan = view.querySelector(".question-text");
            let questionCountDiv = view.querySelector('.question-count');

            editButton.disabled = true;

            // Get the current question
            let slideId = await window.PollParty.Helpers.PowerPointHelper.getSelectedSlideIdAsync();
            let question = data.questions.find((q) => q.slideId == slideId);

            if (question) {
                // Set question text
                questionTextSpan.innerText = question.questionText;
            }

            // Configure edit button
            editButton.disabled = false;
            editButton.addEventListener("click", function () {

                // Navigate to the edit view
                window.PollParty.App.navigate(window.PollParty.Views.EditView, data);
            });

            // Configure question index and total
            let questionIndex = data.questions.indexOf(question) + 1;
            let questionTotal = data.questions.length;
            questionCountDiv.innerText = `${questionIndex}/${questionTotal}`;
        };

        this.initialize = initialize;
        this.templateSelector = ".static.view";
    };

    window.PollParty.Views.StaticView = StaticView;

})(); 