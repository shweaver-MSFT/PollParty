(function () {
    "use strict";

    let PollPartyApp = function () {

        let initialize = async function () {

            // Show the loading view while we init
            navigate(window.PollParty.Views.LoadingView);

            await Office.onReady();

            try {
                let presentationId = await window.PollParty.Helpers.PowerPointHelper.getPresentationIdAsync();
                let url = `./api/questions/pid/${presentationId}`;
                let xhr = new XMLHttpRequest();
                xhr.responseType = "json";
                xhr.open("GET", url);
                xhr.addEventListener("load", function () {
                    if (xhr.status !== 200) {
                        finishSetupAsync(null);
                        return;
                    }

                    // 
                    let data = xhr.response;
                    finishSetupAsync(data);
                });
                xhr.send();
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

            async function finishSetupAsync(state) {

                // Check for existing state
                let hasExistingState = state !== null;

                // Check if presenting or not
                let isPresenting = await window.PollParty.Helpers.PowerPointHelper.isPresentingAsync();

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
                        navigate(window.PollParty.Views.LiveView, state);
                    }
                }
                else {
                    if (hasExistingState) {

                        // Get the current question
                        let slideId = await window.PollParty.Helpers.PowerPointHelper.getSelectedSlideIdAsync();
                        let question = state.questions.find((q) => q.slideId == slideId);

                        if (question != null) {

                            // Show the static/saved view
                            navigate(window.PollParty.Views.StaticView, state);
                            return;
                        }
                    }
                    
                    // Show the Edit view, empty and ready for configuration
                    navigate(window.PollParty.Views.EditView);
                }
            }
        };

        /*
            Navigate the content-root to the specified view.
                viewType: A type from window.PollParty.Views for display.
                data (optional): An object to initialize the view with.
        */
        let navigate = function (viewType, data) {

            setImmediate(function () {
                let view = new viewType();
                let template = document.querySelector(`#templates ${view.templateSelector}`).cloneNode(true);

                view.initialize(template, data);

                let contentRoot = document.querySelector("#content-root");
                while (contentRoot.firstChild) {
                    contentRoot.removeChild(contentRoot.firstChild);
                }
                contentRoot.appendChild(template);
            });
        };

        // function activeViewChanged(args) {
        //     initialize();
        // }


        // Office.context.document.addHandlerAsync(Office.EventType.ActiveViewChanged, activeViewChanged,
        //     function (asyncResult) {
        //         if (asyncResult.status === "failed") {
        //             console.log("Action failed with error: " + asyncResult.error.message);
        //         }
        //     });

        this.initialize = initialize;
        this.navigate = navigate;
    };

    // Create default namespace
    window.PollParty = {
        App: new PollPartyApp(),
        Views: {},
        Helpers: {}
    };

    // The initialize function must be run each time a new page is loaded.
    if (Office && typeof PowerPoint !== 'undefined') {
        window.PollParty.App.initialize();
    }
    else {
        window.addEventListener('DOMContentLoaded', window.PollParty.App.initialize);
    }

})();