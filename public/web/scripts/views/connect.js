(function() {
    "use strict";

    let ConnectView = function () {

        let initialize = function (view, data) {
            
            if (data === undefined || data.code === undefined) {
                
                // We need a code, push the user to the error view
                window.PollParty.App.navigate(window.PollParty.Views.ErrorView, {
                    message: "We need a code",
                    showCommand: true,
                    commandText: "Enter Code",
                    commandCallback: function() {
                        window.PollParty.App.navigate(window.PollParty.Views.CodeView);
                    }
                });
                return;
            }

            let code = data.code;

            // TODO: Add api call here to get the active session for this code

            // TODO: If no session, nav to error view

            // TODO: If valid session, get the question and nav to response view
        };

        this.initialize = initialize;
        this.templateSelector = ".connect.view";
    };

    window.PollParty.Views.ConnectView = ConnectView;

})();