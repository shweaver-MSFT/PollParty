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
            
            let commandButton = view.querySelector(".command-button");
            let errorTextSpan = view.querySelector(".error-text");

            // Disable the button during configuration
            commandButton.disabled = true;

            if (data !== undefined) {
                
                // Update the error text
                errorTextSpan.innerText = data["message"];

                // Configure the button
                if (data["showButton"] === false) {
                    commandButton.classList.add("hidden");
                }
                else {
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
            
            // Reenable the button post configuration
            commandButton.disabled = false;
        };

        this.initialize = initialize;
        this.templateSelector = ".error.view";
    };

    window.PollParty.Views.ErrorView = ErrorView;

})();