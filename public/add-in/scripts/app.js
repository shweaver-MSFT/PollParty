(function () {
    "use strict";

    let PollPartyApp = function () {

        let initialize = function () {

            // Show the loading view while we init
            navigate(window.PollParty.Views.LoadingView);
            
            try {
                // Check for existing state
                let hasExistingState = true; // TODO: Query backend for existing state

                // Check if presenting or not
                let isPresenting = false; // TODO: Query Office.js to see if we are actively presenting

                if (isPresenting) {
                    if (!hasExistingState) {
                        
                        // In a live presentation state, but missing configuration.
                        navigate(window.PollParty.Views.ErrorView, {
                            message: "You appear to be presenting a slide that has not yet been configured.",
                            showCommand: false
                        });
                    }
                    else {
                        
                        // Show the live presentation view.
                        navigate(window.PollParty.Views.LiveView, {
                            // TODO: Populate view with existing data
                        });
                    }
                }
                else {
                    if (!hasExistingState) {
                        
                        // Show the Edit view, empty and ready for configuration
                        navigate(window.PollParty.Views.EditView);
                    }
                    else {

                        // Show the static/saved view
                        navigate(window.PollParty.Views.StaticView, {
                            // TODO: Populate view with existing data
                        });
                    }
                }
            }
            catch (e) {

                // We've failed to load a view. Show an error message.
                navigate(window.PollParty.Views.ErrorView, {
                    exception: e,
                    message: "We have encountered an error loading the Add-In. Please try again.",
                    commandText: "Refresh",
                    commandCallback: initialize
                });
            }
        };
        
        /*
            Navigate the content-root to the specified view.
                viewType: A type from window.PollParty.Views for display.
                data (optional): An object to initialize the view with.
        */
        let navigate = function (viewType, data) {

            let view = new viewType();
            let template = document.querySelector(`#templates ${view.templateSelector}`).cloneNode(true);

            view.initialize(template, data);

            let contentRoot = document.querySelector("#content-root");
            while (contentRoot.firstChild)
            {
                contentRoot.removeChild(contentRoot.firstChild);
            }
            contentRoot.appendChild(template);
        };

        this.initialize = initialize;
        this.navigate = navigate;
    };

    // Create default namespace
    window.PollParty = {
        App: new PollPartyApp(),
        Views: {}
    };

    // The initialize function must be run each time a new page is loaded.
    if (Office && typeof PowerPoint !== 'undefined') {
        Office.initialize = window.PollParty.App.initialize;
    }
    else {
        window.addEventListener('DOMContentLoaded', window.PollParty.App.initialize);
    }

})();