(function () {
    "use strict";

    let StaticView = function () {

        let editButton  = null;
        let questionSet = null;

        let initialize = async function (view, data) {

            try {
                if (!data || !data.questionSet) {
                    throw null;
                }

                questionSet = data.questionSet;
                let slideId = await window.PollParty.Helpers.PowerPointHelper.getSelectedSlideIdAsync();
                let question = questionSet.questions.find((q) => q.slideId == slideId);
                let questionIndex = questionSet.questions.indexOf(question) + 1;
                let questionTotal = questionSet.questions.length;

                // Configure question text
                let questionTextSpan = view.querySelector(".question-text");
                questionTextSpan.innerText = question.questionText;
                
                // Configure edit button
                editButton = view.querySelector(".command-button");
                editButton.addEventListener("click", handleEditButtonClick);

                // Configure question index and total
                let questionCountDiv = view.querySelector('.question-count');
                questionCountDiv.innerText = `${questionIndex}/${questionTotal}`;
            }
            catch(e) {
                window.PollParty.App.navigate(window.PollParty.Views.ErrorView);
            }
        };

        function unload() {

            if (editButton) {
                editButton.removeEventListener("click", handleEditButtonClick);
                editButton = null;
            }

            questionSet = null;
        }

        function handleEditButtonClick(e) {

            // Navigate to the edit view
            window.PollParty.App.navigate(window.PollParty.Views.EditView, {
                questionSet: questionSet
            });
        }

        this.initialize = initialize;
        this.unload = unload;
        this.templateSelector = ".static.view";
    };

    window.PollParty.Views.StaticView = StaticView;

})(); 