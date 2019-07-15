 (function() {
    "use strict";

    let ResponseView = function () {

        let viewInstance = null;

        let initialize = function (view, data) {
            
            viewInstance = view;

            let sessionData = data;
            if (sessionData) {

                let questionData = sessionData.currentQuestion;
                if (questionData !== null && questionData !== undefined) {

                    let questionCount = view.querySelector(".question-count");
                    questionCount.innerText = `${sessionData.currentQuestionIndex + 1}/${sessionData.questionTotal}`;

                    let questionText = view.querySelector(".question-text");
                    questionText.innerText = questionData.questionText;
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

            // TODO: Add loading indicator

            let url = `/api/session/${sessionData.code}?response=${responseBool}`;
            let xhr = new XMLHttpRequest();
            xhr.responseType = "json";
            xhr.open("POST", url);
            xhr.addEventListener("load", function() {
                if (xhr.status !== 200) {
                    
                    window.PollParty.App.navigate(window.PollParty.Views.ErrorView, {
                        message: "Please try voting again, or go back and re-enter the key.",
                        showButton: true,
                        commandText: "Try Again",
                        commandCallback: function() {

                            // Recursive call to try again
                            submitSelection(responseBool, sessionData);
                        }
                    });
                    return;
                }
                
                // Send to the confirm view to wait for the next question
                window.PollParty.App.navigate(window.PollParty.Views.ConfirmView, sessionData);
            });
            xhr.send();
        }

        this.initialize = initialize;
        this.templateSelector = ".response.view";
    };

    window.PollParty.Views.ResponseView = ResponseView;

})();