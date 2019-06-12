(function() {
    "use strict";

    let LiveView = function () {

        const syncInterval = 1000;
        
        let viewInstance = null;
        let sessionData = null;

        let initialize = function (view, data) {
            viewInstance = view;

            // Get the session data from the previous view
            sessionData = data && data.session ? data.session : null;
            if (sessionData === null) {

                // TODO: Handle error
                return;
            }

            let questionTextSpan = view.querySelector(".question-text");
            questionTextSpan.innerText = sessionData.currentQuestion.text;

            let joinCodeSpan = view.querySelector(".join-code");
            joinCodeSpan.innerText = sessionData.code;

            let questionCountSpan = view.querySelector(".question-count");
            questionCountSpan.innerText = `${sessionData.currentQuestionIndex}/${sessionData.questionTotal}`;

            updateProgress(0, 0);
            setInterval(syncProgress, syncInterval);
        };

        function syncProgress() {

            let url = `./api/session?code=${sessionData.code}`;
            let xhr = new XMLHttpRequest();
            xhr.responseType = "json";
            xhr.open("GET", url);
            xhr.addEventListener("load", function () {
                if (xhr.status !== 200) {
                    return;
                }

                // 
                sessionData = xhr.response;
                
                let yesCount = sessionData.currentResponses.yes;
                let noCount = sessionData.currentResponses.no;
                updateProgress(yesCount, noCount);
            });
            xhr.send();
        }

        function updateProgress(yesCount, noCount) {

            let totalCount = yesCount + noCount;
            let yesPercentString = (yesCount / totalCount) + "%";
            let noPercentString = (noCount / totalCount) + "%";

            let yesProgressBar = viewInstance.querySelector(".answer-yes .meter .progress");
            let yesPercentSpan = viewInstance.querySelector(".answer-yes .percent-text");
            let noProgressBar = viewInstance.querySelector(".answer-no .meter .progress");
            let noPercentSpan = viewInstance.querySelector(".answer-no .percent-text");

            yesProgressBar.style.width = yesPercentString;
            yesPercentSpan.innerText = yesPercentString;
            noProgressBar.style.width = noPercentString;
            noPercentSpan.innerText = noPercentString;

            yesPercentSpan.style.fontWeight = "normal";
            noPercentSpan.style.fontWeight = "normal";

            // TODO: Replace hard style setters with a css class
            if (yesProgressBar.style.width > noProgressBar.style.width) {
                yesPercentSpan.style.fontWeight = "bold";
            } else if (yesProgressBar.style.width < noProgressBar.style.width) {
                noPercentSpan.style.fontWeight = "bold";
            }
        }

        this.initialize = initialize;
        this.templateSelector = ".live.view";
    };

    window.PollParty.Views.LiveView = LiveView;

})();