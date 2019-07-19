(function() {
    "use strict";

    let LiveView = function () {

        const syncInterval = 1000;
        
        let viewInstance = null;
        let code = null;
        let intervalId = null;

        function handleError() {
            window.PollParty.App.navigate(window.PollParty.Views.ErrorView, {
                message: "You appear to be presenting a slide that has not yet been configured.",
                showCommand: false
            });
        }

        async function initialize(view, data) {
            viewInstance = view;

            // Get the session data from the previous view
            if (!data) {
                handleError();
                return;
            }

            let questionSet = data;
            let slideId = await window.PollParty.Helpers.PowerPointHelper.getSelectedSlideIdAsync();
            let url = `./api/session/live?pid=${questionSet.presentationId}&sid=${slideId}`;
            let xhr = new XMLHttpRequest();
            xhr.responseType = "json";
            xhr.open("GET", url);
            xhr.addEventListener("load", function () {

                if (xhr.status !== 200) {
                    handleError();
                    return;
                }

                finishSetup(xhr.response);
            });
            xhr.send();

            function finishSetup(sessionData) {

                let currentQuestion = sessionData.currentQuestion;
                let questionText = currentQuestion.questionText;
                let questionIndex = 0;

                for(var i = 0; i < questionSet.questions.length; i++) {
                    if (questionSet.questions[i].slideId == currentQuestion.slideId) {
                        questionIndex = i;
                        break;
                    }
                }

                let questionTotal = questionSet.questions.length;
                code = sessionData.code;

                let questionTextSpan = viewInstance.querySelector(".question-text");
                questionTextSpan.innerText = questionText;

                let joinCodeSpan = viewInstance.querySelector(".join-code");
                joinCodeSpan.innerText = code;

                let questionCountSpan = viewInstance.querySelector(".question-count");
                questionCountSpan.innerText = `${questionIndex + 1}/${questionTotal}`;

                updateProgress(0, 0);
                intervalId = setInterval(syncProgress, syncInterval);
            }
        };

        function unload() {
            if (intervalId != null) {
                clearInterval(intervalId);
                intervalId = null;
            }
        }

        function syncProgress() {

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
                let trueCount = 0;
                let falseCount = 0;
                let currentSlideId = sessionData.currentQuestion.slideId;
                let responses = sessionData.responseSet.responses;
                for(var i = 0; i <responses.length; i++) {
                    
                    let response = responses[i];
                    if (response.slideId == currentSlideId) {
                        if (response.responseBool == true) trueCount++;
                        else falseCount++;
                    }
                }

                updateProgress(trueCount, falseCount);
            });
            xhr.send();
        }

        function updateProgress(yesCount, noCount) {

            let totalCount = yesCount + noCount;

            let yesPercentString = (totalCount > 0 ? 100 * (yesCount / totalCount) : 0).toFixed(0) + "%";
            let noPercentString = (totalCount > 0 ? 100 * (noCount / totalCount) : 0).toFixed(0) + "%";

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
        this.unload = unload;
        this.templateSelector = ".live.view";
    };

    window.PollParty.Views.LiveView = LiveView;

})();