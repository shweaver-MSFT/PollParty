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
            
            // Update the error message
            let p = view.querySelector("p");
            p.innerHTML = data["message"];

            // Configure the button
            let button = view.querySelector("button");
            if (data["showButton"] === false) {
                button.classList.add("hidden");
            }
            else {
                button.innerHTML = data["commandText"];
                button.addEventListener("click", data["commandCallback"]);
            }
        };

        this.initialize = initialize;
        this.templateSelector = ".error.view";
    };

    window.PollParty.Views.ErrorView = ErrorView;

})();