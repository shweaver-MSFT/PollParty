(function() {
    "use strict";

    let LiveView = function () {

        let viewInstance = null;

        let initialize = function (view, data) {
            viewInstance = view;

            updateProgress("75%", "25%");
        };

        /* 
            Pass in string percentages; e.g. "25%" Preferrably adding up to 100% total.
            This string is used to populate the span inner text as well 
            as the progress width value.

            TODO: Make this function more reliable. It's mostly for demo use currently.
        */
        function updateProgress(yesPercentString, noPercentString) {
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

            if (yesProgressBar.style.width > noProgressBar.style.width) {
                yesPercentSpan.style.fontWeight = "bold";
            } else if (yesProgressBar.style.width < noProgressBar.style.width) {
                noPercentSpan.style.fontWeight = "bold";
            }
        };

        function updateNoProgress(percentString) {
            let noProgressBar = viewInstance.querySelector(".answer-no .meter .progress");
            let noPercentSpan = viewInstance.querySelector(".answer-no .percent-text");
            
        };

        this.initialize = initialize;
        this.templateSelector = ".live.view";
    };

    window.PollParty.Views.LiveView = LiveView;

})();