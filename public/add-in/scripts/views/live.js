(function() {
    "use strict";

    let LiveView = function () {

        const syncInterval = 1000;
        
        let code = null;
        let intervalId = null;
        let yesProgressBar = null;
        let yesPercentSpan = null;
        let noProgressBar = null;
        let noPercentSpan = null;

        async function initialize(view, data) {

            try {
                
                if (!data || !data.questionSet) {
                    handleError();
                    return;
                }

                let questionSet = data.questionSet;
                let slideId = await window.PollParty.Helpers.PowerPointHelper.getSelectedSlideIdAsync();
                let url = `./api/session/live?pid=${questionSet.presentationId}&sid=${slideId}`;
                
                let response = await fetch(url, {
                    method: 'GET',
                    headers:{
                        'Content-Type': 'application/json'
                    }
                });

                let sessionData = await response.json();
                let currentQuestion = sessionData.currentQuestion;
                let questionText = currentQuestion.questionText;
                let questionIndex = 0;

                for (let i = 0; i < questionSet.questions.length; i++) {
                    if (questionSet.questions[i].slideId == currentQuestion.slideId) {
                        questionIndex = i;
                        break;
                    }
                }

                let questionTotal = questionSet.questions.length;
                code = sessionData.code;

                let questionTextSpan = view.querySelector(".question-text");
                questionTextSpan.innerText = questionText;

                let joinCodeSpan = view.querySelector(".join-code");
                joinCodeSpan.innerText = code;

                let questionCountSpan = view.querySelector(".question-count");
                questionCountSpan.innerText = `${questionIndex + 1}/${questionTotal}`;

                yesProgressBar = view.querySelector(".answer-yes .meter .progress");
                yesPercentSpan = view.querySelector(".answer-yes .percent-text");
                noProgressBar = view.querySelector(".answer-no .meter .progress");
                noPercentSpan = view.querySelector(".answer-no .percent-text");

                updateProgress(0, 0);
                intervalId = setInterval(syncProgress, syncInterval);
            }
            catch(e) {
                handleError(e);
            }
        };

        function unload() {

            if (intervalId != null) {
                clearInterval(intervalId);
                intervalId = null;
            }

            code = null;
            yesProgressBar = null;
            yesPercentSpan = null;
            noProgressBar = null;
            noPercentSpan = null;
        }

        function handleError(e) {

            window.PollParty.App.navigate(window.PollParty.Views.ErrorView, {
                message: "You appear to be presenting a slide that has not yet been configured."
            });
        }

        async function syncProgress() {

            let url = `./api/session/${code}`;
            let response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            let session = await response.json();
            let trueCount = 0;
            let falseCount = 0;
            let currentSlideId = session.currentQuestion.slideId;
            let responses = session.responseSet.responses;

            for (var i = 0; i < responses.length; i++) {
                
                let response = responses[i];
                if (response.slideId == currentSlideId) {
                    
                    if (response.responseBool == true) {
                        trueCount++;
                    }
                    else {
                        falseCount++;
                    }
                }
            }

            updateProgress(trueCount, falseCount);
        }

        function updateProgress(yesCount, noCount) {

            let totalCount = yesCount + noCount;
            let yesPercentString = (totalCount > 0 ? 100 * (yesCount / totalCount) : 0).toFixed(0) + "%";
            let noPercentString = (totalCount > 0 ? 100 * (noCount / totalCount) : 0).toFixed(0) + "%";

            yesProgressBar.style.width = yesPercentString;
            yesPercentSpan.innerText = yesPercentString;
            noProgressBar.style.width = noPercentString;
            noPercentSpan.innerText = noPercentString;

            if (yesProgressBar.style.width > noProgressBar.style.width) {

                yesPercentSpan.classList.add('highlight');
                noPercentSpan.classList.remove('highlight');
            } 
            else if (yesProgressBar.style.width < noProgressBar.style.width) {

                yesPercentSpan.classList.remove('highlight');
                noPercentSpan.classList.add('highlight');
            }
            else {

                yesPercentSpan.classList.remove('highlight');
                noPercentSpan.classList.remove('highlight');
            }
        }

        this.initialize = initialize;
        this.unload = unload;
        this.templateSelector = ".live.view";
    };

    window.PollParty.Views.LiveView = LiveView;

})();