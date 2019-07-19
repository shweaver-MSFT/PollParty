 (function() {
    "use strict";

    let ResponseView = function () {

        let session = null;
        let yesButton = null;
        let noButton = null;

        let initialize = function (view, data) {
            
            try {

                if (!data || data.session === undefined) {
                    throw "We couldn't connect to the active session for the code provided."; 
                }

                session = data.session;
                let question = session.currentQuestion;
                
                let questionCount = view.querySelector(".question-count");
                questionCount.innerText = `${session.currentQuestionIndex + 1}/${session.questionTotal}`;

                let questionText = view.querySelector(".question-text");
                questionText.innerText = question.questionText;
                        
                yesButton = view.querySelector(".yes-button");
                yesButton.addEventListener("click", handleYesButtonClick);

                noButton = view.querySelector(".no-button");
                noButton.addEventListener("click", handleNoButtonClick);
            }
            catch(e) {
                handleError(e);
            }
        };

        function unload() {

            if (yesButton) {
                yesButton.removeEventListener("click", handleYesButtonClick);
                yesButton = null;
            }

            if (noButton) {
                noButton.removeEventListener("click", handleNoButtonClick);
                noButton = null;
            }

            session = null;
        }

        function handleError(e) {

            let errorMessage = e || "We've encountered an error.";

            window.PollParty.App.navigate(window.PollParty.Views.ErrorView, {
                message: `${errorMessage} Please re-enter the code and try again.`
            });
        }

        function handleYesButtonClick(e) {
            this.classList.add("selected");                
            submitSelection(true);
        }

        function handleNoButtonClick(e) {
            this.classList.add("selected");
            submitSelection(false);
        }
        
        function submitSelection(responseBool) {

            yesButton.disabled = true;
            noButton.disabled = true;

            // TODO: Add loading indicator

            let url = `/api/session/${session.code}?response=${responseBool}`;
            let xhr = new XMLHttpRequest();
            xhr.responseType = "json";
            xhr.open("POST", url);
            xhr.addEventListener("load", function() {
                if (xhr.status !== 200) {
                    
                    handleError("We couldn't submit your response.");
                    return;
                }
                
                // Send to the confirm view to wait for the next question
                window.PollParty.App.navigate(window.PollParty.Views.ConfirmView, {
                    session: session
                });
            });
            xhr.send();
        }

        this.initialize = initialize;
        this.unload = unload;
        this.templateSelector = ".response.view";
    };

    window.PollParty.Views.ResponseView = ResponseView;

})();