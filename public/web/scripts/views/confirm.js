(function() {
    "use strict";

    let ConfirmView = function () {

        const requestInterval = 1000;

        let codeButton = null;
        let session = null;
        let intervalId = null;

        function initialize(view, data) {

            try {

                if (!data || data.session === undefined) {
                    throw "We've encountered an error.";
                }

                session = data.session;

                // Wire up code button
                codeButton = view.querySelector(".code-button");
                codeButton.addEventListener("click", handleCodeButtonClick);

                // Queue interval to send session requests
                intervalId = setInterval(sendSessionRequest, requestInterval);
            }
            catch(e) {
                handleError(e);
            }
        };

        function unload() {

            if (codeButton) {
                codeButton.removeEventListener("click", handleCodeButtonClick);
                codeButton = null;
            }

            if (intervalId !== null) {
                clearInterval(intervalId);
                intervalId = null;
            }

            session = null;
        }

        function handleError(e) {

            let errorMessage = e || "We've encountered an error.";

            window.PollParty.App.navigate(window.PollParty.Views.ErrorView, {
                message: `${errorMessage} Please re-enter the code and try again.`
            });
        }

        function handleCodeButtonClick() {
            window.PollParty.App.navigate(window.PollParty.Views.CodeView);
        }

        function sendSessionRequest() {
            
            let sessionRequest = new XMLHttpRequest();
            sessionRequest.responseType = "json";
            sessionRequest.open("GET", `./api/session/${session.code}`);
            sessionRequest.addEventListener("load", function() {
            
                if (sessionRequest.status !== 200) {
                    handleError();
                    return;
                }
    
                // If the current question changes, navigate to the response view.
                let newSession = sessionRequest.response;
                if (session.currentQuestion.slideId != newSession.currentQuestion.slideId) {
                    window.PollParty.App.navigate(window.PollParty.Views.ResponseView, {
                        session: newSession
                    });
                }
            });
            sessionRequest.send();
        }

        this.initialize = initialize;
        this.unload = unload;
        this.templateSelector = ".confirm.view";
    };

    window.PollParty.Views.ConfirmView = ConfirmView;

})();