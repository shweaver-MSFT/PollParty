(function() {
    "use strict";

    let EditView = function () {

        let initialize = function (view, data) {
            
            let question = data["question"];

            let saveButton = view.querySelector(".save-button");
            saveButton.addEventListener("click", function () {
                // Navigate to the static view
                window.PollParty.App.navigate(window.PollParty.Views.StaticView, {
                    question: question
                });
            });
        };

        this.initialize = initialize;
        this.templateSelector = ".edit.view";
    };

    window.PollParty.Views.EditView = EditView;

})();