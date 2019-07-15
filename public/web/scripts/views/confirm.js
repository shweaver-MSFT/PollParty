(function() {
    "use strict";

    let ConfirmView = function () {

        const checkInterval = 1000;

        let currentSlideId = null;
        let intervalId = null;
        let code = null;

        function initialize(view, data) {

            // Wire up code button
            let codeButton = view.querySelector(".code-button");
            codeButton.addEventListener("click", function() {
                window.PollParty.App.navigate(window.PollParty.Views.CodeView);
            });

            // Get response data from the previous view
            let sessionData = data;
            if (sessionData) {
                
                code = sessionData.code;
                currentSlideId = sessionData.currentQuestion.slideId;
                intervalId = setInterval(checkCurrentQuestion, checkInterval);
            }
        };

        function unload() {
            if (intervalId !== null) {
                clearInterval(intervalId);
                intervalId = null;
            }
        }

        function checkCurrentQuestion() {
            let url = `./api/session/${code}`;
            let xhr = new XMLHttpRequest();
            xhr.responseType = "json";
            xhr.open("GET", url);
            xhr.addEventListener("load", function () {

                if (xhr.status !== 200) {
                    // TODO: Handle error
                    return;
                }

                let sessionData = xhr.response;
                let slideId = sessionData.currentQuestion.slideId;
                if (currentSlideId != slideId) {
                    window.PollParty.App.navigate(window.PollParty.Views.ResponseView, sessionData);
                }
            });
            xhr.send();
        }

        this.initialize = initialize;
        this.unload = unload;
        this.templateSelector = ".confirm.view";
    };

    window.PollParty.Views.ConfirmView = ConfirmView;

})();