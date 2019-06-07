 (function() {
    "use strict";

    let ResponseView = function () {

        let viewInstance = null;

        let initialize = function (view, data) {
            
            viewInstance = view;

            let sessionData = data !== undefined ? data.session : null;
            if (sessionData !== null && sessionData !== undefined) {

                let questionData = sessionData.currentQuestion;
                if (questionData !== null && questionData !== undefined) {

                    let questionCount = view.querySelector(".question-count");
                    questionCount.innerText = `${sessionData.currentQuestionIndex}/${sessionData.questionTotal}`;

                    let questionText = view.querySelector(".question-text");
                    questionText.innerText = questionData.text;
                }
            }

            let yesButton = view.querySelector(".yes-button");
            let noButton = view.querySelector(".no-button");

            yesButton.addEventListener("click", function(e) {
                this.classList.add("selected");                
                submitSelection(true, sessionData);
            });

            noButton.addEventListener("click", function(e) {
                this.classList.add("selected");
                submitSelection(false, sessionData);
            });
        };

        function submitSelection(responseBool, sessionData) {

            let yesButton = viewInstance.querySelector(".yes-button");
            let noButton = viewInstance.querySelector(".no-button");
            yesButton.disabled = true;
            noButton.disabled = true;

            window.PollParty.App.navigate(window.PollParty.Views.ConfirmView, {
                response: responseBool,
                session: sessionData
            });
        }

        this.initialize = initialize;
        this.templateSelector = ".response.view";
    };

    window.PollParty.Views.ResponseView = ResponseView;

})();