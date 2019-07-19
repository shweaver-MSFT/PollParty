(function() {
    "use strict";

    let ConnectView = function () {

        let initialize = async function (view, data) {
            
            if (!data || data.code === undefined) {
                
                // We need a code, push the user to the error view
                window.PollParty.App.navigate(window.PollParty.Views.ErrorView, {
                    message: "A code is required to connect to an active session"
                });
                return;
            }

            let code = data.code;
            let response = await fetch(`/api/session/${code}`, {
                method: 'GET',
                headers:{
                    'Content-Type': 'application/json'
                }
            });
            let session = await response.json();
            
            // If no session, nav to error view
            if (session === null) {
                window.PollParty.App.navigate(window.PollParty.Views.ErrorView, {
                    message: "We couldn't find an active session for the code provided. Please try again."
                });
                return;
            }

            // If valid session, nav to response view
            let statusText = view.querySelector(".status-text");
            statusText.innerText = "Connected";

            window.PollParty.App.navigate(window.PollParty.Views.ResponseView, {
                session: session
            });
        };

        this.initialize = initialize;
        this.templateSelector = ".connect.view";
    };

    window.PollParty.Views.ConnectView = ConnectView;

})();