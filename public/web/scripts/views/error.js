(function() {
    "use strict";

    let ErrorView = function () {

        /*
            Example data parameters
            {
                exception: e,
                message: "",
                showCommand: false,
                commandText: "",
                commandCallback: function() {

                }
            }
        */
        let initialize = function (view, data) {

            let codeButton = view.querySelector(".code-button");
            let commandButton = view.querySelector(".command-button");
            let errorTextSpan = view.querySelector(".description-text");

            if (data !== undefined) {
                
                // Update the error text
                errorTextSpan.innerText = data["message"];

                // Configure the button
                if (data["showCommand"] === true) {
                    
                    commandButton.classList.remove("hidden");
                    commandButton.innerHTML = data["commandText"];
                    commandButton.addEventListener("click", function() {
                        data["commandCallback"]();
                    });
                }
            } 
            else {

                // Default config for when error data isn't provided
                commandButton.addEventListener("click", function() {
                    window.PollParty.App.initialize();
                });
            }

            // Code button takes us to code view
            codeButton.addEventListener("click", function() {
                window.PollParty.App.navigate(window.PollParty.Views.CodeView);
            });
        };

        this.initialize = initialize;
        this.templateSelector = ".error.view";
    };

    window.PollParty.Views.ErrorView = ErrorView;

})();