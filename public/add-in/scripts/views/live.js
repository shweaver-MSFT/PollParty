(function() {
    "use strict";

    let LiveView = function () {

        const syncInterval = 1000;
        
        let viewInstance = null;
        let sessionData = null;
        let questionSet = null;

        let initialize = async function (view, data) {
            viewInstance = view;

            // Get the session data from the previous view
            if (!data) {

                // TODO: handle error case
                return;
            }

            questionSet = data;
            
            let sessionData = await new Promise(function(resolve, reject) {

                let url = `./api/session/create?pid=${questionSet.presentationId}`;
                let xhr = new XMLHttpRequest();
                xhr.responseType = "json";
                xhr.open("POST", url);
                xhr.addEventListener("load", function () {
                    if (xhr.status !== 200) {
    
                        // TODO: Handle error
                        reject();
                        return;
                    }
    
                    resolve(xhr.response);
                });
                xhr.send();
            });

            let slideId = await window.PollParty.Helpers.PowerPointHelper.getSelectedSlideIdAsync();
            let currentQuestion = questionSet.questions.find((q) => q.slideId == slideId);
            let questionText = currentQuestion.questionText;
            let questionIndex = questionSet.questions.indexOf(currentQuestion);
            let questionTotal = questionSet.questions.length;
            let code = sessionData.code;

            let questionTextSpan = viewInstance.querySelector(".question-text");
            questionTextSpan.innerText = questionText;

            let joinCodeSpan = viewInstance.querySelector(".join-code");
            joinCodeSpan.innerText = code;

            let questionCountSpan = viewInstance.querySelector(".question-count");
            questionCountSpan.innerText = `${questionIndex + 1}/${questionTotal}`;

            updateProgress(0, 0);
            setInterval(syncProgress, syncInterval);
        };

        function syncProgress() {

            let url = `./api/session/${sessionData.code}`;
            let xhr = new XMLHttpRequest();
            xhr.responseType = "json";
            xhr.open("GET", url);
            xhr.addEventListener("load", function () {
                if (xhr.status !== 200) {

                    // TODO: Handle error
                    return;
                }

                sessionData = xhr.response;
                
                let trueCount = parseInt(sessionData.responseSet.trueCount);
                let falseCount = parseInt(sessionData.responseSet.falseCount);
                updateProgress(trueCount, falseCount);
            });
            xhr.send();
        }

        function updateProgress(yesCount, noCount) {

            let totalCount = yesCount + noCount;
            let yesPercentString = (totalCount > 0 ? (yesCount / totalCount) : 0) + "%";
            let noPercentString = (totalCount > 0 ? (noCount / totalCount) : 0) + "%";

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