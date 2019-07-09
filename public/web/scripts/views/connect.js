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
            let sessionData = null;

            // api call to get the active session for this code
            let url = `/api/session/${code}`;
            let xhr = new XMLHttpRequest();
            xhr.responseType = "json";
            xhr.open("GET", url);
            xhr.addEventListener("load", function() {
                if (xhr.status !== 200) {
                    return;
                }
                
                // Inspect json and populate the question object
                sessionData = xhr.response;
                finishSetup();
            });
            xhr.send();

            // Finishing function
            function finishSetup() {

                // If no session, nav to error view
                if (sessionData === null) {
                    window.PollParty.App.navigate(window.PollParty.Views.ErrorView, {
                        message: "We couldn't find a session for the code provided. Please go back and re-enter the key.",
                    });
                    return;
                }

                // If valid session, nav to response view
                let statusText = view.querySelector(".status-text");
                statusText.innerText = "Connected";

                window.PollParty.App.navigate(window.PollParty.Views.ResponseView, sessionData);
            }
        };

        this.initialize = initialize;
        this.templateSelector = ".connect.view";
    };

    window.PollParty.Views.ConnectView = ConnectView;

})();