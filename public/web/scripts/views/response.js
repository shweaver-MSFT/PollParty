 (function() {
    "use strict";

    let ResponseView = function () {

        let initialize = function (view, data) {
            
            let yesButton = view.querySelector(".yes-button");
            let noButton = view.querySelector(".no-button");

            yesButton.addEventListener("click", function(e) {
                updateSelection(this, noButton);
            });

            noButton.addEventListener("click", function(e) {
                updateSelection(this, yesButton);
            });
        };

        function updateSelection(onButton, offButton) {

            if (!onButton.classList.contains("selected")) {
                onButton.classList.add("selected");
                offButton.classList.remove("selected");
            }
        }

        this.initialize = initialize;
        this.templateSelector = ".response.view";
    };

    window.PollParty.Views.ResponseView = ResponseView;

})();