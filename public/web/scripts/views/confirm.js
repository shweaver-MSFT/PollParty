(function() {
    "use strict";

    let ConfirmView = function () {

        let initialize = function (view, data) {

            // Get response data from the previous view
            let responseBool = data !== undefined ? data.response : null;
            let sessionData = data !== undefined ? data.session : null;
            if (responseBool === null || sessionData === null) {
                
                finishSetup(false);
                return;
            }

            // configure the retry button
            let retryButton = view.querySelector(".retry-button");
            retryButton.addEventListener("click", function() {
                window.PollParty.App.navigate(window.PollParty.Views.ResponseView, {
                    session: sessionData
                });
            });
            retryButton.classList.add("hidden");

            // Wire up code button
            let codeButton = view.querySelector(".code-button");
            codeButton.addEventListener("click", function() {
                window.PollParty.App.navigate(window.PollParty.Views.CodeView);
            });

            // Send API call to submit the responseBool. 
            let url = `/api/session/${sessionData.code}/response/${responseBool}`;
            let xhr = new XMLHttpRequest();
            xhr.responseType = "json";
            xhr.open("POST", url);
            xhr.addEventListener("load", function() {
                if (xhr.status !== 200) {
                    finishSetup(false);
                    return;
                }
                
                finishSetup(true);
            });
            xhr.send();

            // Finishing function to update the view
            function finishSetup(success) {

                let statusIcon = view.querySelector(".status-icon");
                let statusText = view.querySelector(".status-text");
                let descriptionText = view.querySelector(".description-text");

                if (success) {

                    statusIcon.innerText = "Check";
                    statusText.innerText = "Thank you!";
                    descriptionText.innerText = "Please wait for the next poll to appear.";

                    // TODO: Pulse check session (api get) for the currentQuestion to change, 
                    // then nav to the ResponseView with the new question
                    setInterval(function() {

                    }, 3000)
                }
                else {

                    statusIcon.innerText = "X";
                    statusText.innerText = "Error!";
                    descriptionText.innerText = "Please try voting again, or go back and re-enter the code.";

                    if (sessionData !== null && sessionData.code !== undefined) {
                        retryButton.classList.remove("hidden");
                    }
                }
            }
        };

        this.initialize = initialize;
        this.templateSelector = ".confirm.view";
    };

    window.PollParty.Views.ConfirmView = ConfirmView;

})();