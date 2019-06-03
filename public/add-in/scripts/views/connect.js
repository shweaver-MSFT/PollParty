(function() {
    "use strict";

    let ConnectView = function () {

        let initialize = function (view, data) {
            
            let joinCodeDiv = view.querySelector(".join-code");
            let questionCountDiv = view.querySelector(".question-count");

            // Get the session data
            let sessionData = {
                joinCode: 1234,
                questionTotal: 1,
                currentQuestion: {
                    questionIndex: 1
                }
            }; // TODO: Replace debug data with null

            let finishSetup = function () {

                // Configure join code
                joinCodeDiv.innerText = sessionData.joinCode;

                let questionIndex = sessionData.currentQuestion.questionIndex;
                let questionTotal = sessionData.questionTotal;

                // Configure question index and total
                questionCountDiv.innerText = `${questionIndex}/${questionTotal}`;
            }

            if (sessionData !== null) {
                finishSetup();
            }
        };

        this.initialize = initialize;
        this.templateSelector = ".connect.view";
    };

    window.PollParty.Views.ConnectView = ConnectView;

})();