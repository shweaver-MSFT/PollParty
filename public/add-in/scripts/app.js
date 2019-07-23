(function () {
    "use strict";

    let PollPartyApp = function () {

        let currentView = null;
        let activeSession = null;

        async function initialize() {

            // Show the loading view while we init
            navigate(window.PollParty.Views.LoadingView);

            try {
                await Office.onReady();

                let presentationId = await window.PollParty.Helpers.PowerPointHelper.getPresentationIdAsync();

                let url = `./api/questions/pid/${presentationId}`;
                let response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                let questionSet = null;
                if (response.status === 200) {
                    questionSet = await response.json();
                }
                let hasExistingState = questionSet !== null;

                // Check if presenting or not
                let isPresenting = await window.PollParty.Helpers.PowerPointHelper.isPresentingAsync();

                if (isPresenting) {
                    if (!hasExistingState) {

                        // In a live presentation state, but missing configuration.
                        navigate(window.PollParty.Views.ErrorView, {
                            message: "You appear to be presenting a slide that has not yet been configured."
                        });
                    }
                    else {

                        // Show the live presentation view.
                        navigate(window.PollParty.Views.LiveView, {
                            questionSet: questionSet
                        });
                    }
                }
                else {
                    if (hasExistingState) {

                        // Get the current question
                        let slideId = await window.PollParty.Helpers.PowerPointHelper.getSelectedSlideIdAsync();
                        let question = questionSet.questions.find((q) => q.slideId == slideId);

                        if (question != null) {

                            // Show the static/saved view
                            navigate(window.PollParty.Views.StaticView, {
                                questionSet: questionSet
                            });
                            return;
                        }
                    }

                    // Show the Edit view, empty and ready for configuration
                    navigate(window.PollParty.Views.EditView);
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
        function navigate(viewType, data) {

            setImmediate(function () {
                if (currentView && currentView.unload) {
                    currentView.unload();
                }

                currentView = new viewType();

                let template = document.querySelector(`#templates ${currentView.templateSelector}`).cloneNode(true);
                currentView.initialize(template, data);

                let contentRoot = document.querySelector("#content-root");
                while (contentRoot.firstChild) {
                    contentRoot.removeChild(contentRoot.firstChild);
                }
                contentRoot.appendChild(template);
            });
        };

        function setActiveSession(session) {
            activeSession = session;
        }

        async function activeViewChanged(args) {
            
            // End the active session, if any. This helps keep the server state clean.
            if (activeSession !== null) {

                let url = `./api/session/end/${activeSession.code}`;
                fetch(url, { method: 'POST' });
                activeSession = null;
            }
            
            initialize();
        }

        Office.onReady()
        .then(function () {
            Office.context.document.addHandlerAsync(Office.EventType.ActiveViewChanged, activeViewChanged, function (asyncResult) {
                    if (asyncResult.status === "failed") {
                        console.log("Action failed with error: " + asyncResult.error.message);
                    }
                });
            }
        );

        this.initialize = initialize;
        this.navigate = navigate;
        this.setActiveSession = setActiveSession;
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