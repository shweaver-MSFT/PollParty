(function() {
    "use strict";

    let ConfirmView = function () {

        let initialize = function (view, data) {

            // Wire up code button
            let codeButton = view.querySelector(".code-button");
            codeButton.addEventListener("click", function() {
                window.PollParty.App.navigate(window.PollParty.Views.CodeView);
            });

            // Get response data from the previous view
            let sessionData = data !== undefined ? data.session : null;
            if (sessionData !== null) {
                
                // TODO: setInterval check for next question
            }
        };

        this.initialize = initialize;
        this.templateSelector = ".confirm.view";
    };

    window.PollParty.Views.ConfirmView = ConfirmView;

})();