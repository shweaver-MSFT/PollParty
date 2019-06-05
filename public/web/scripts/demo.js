(function() {
    "use strict";

    let demoMode = true;

    let DemoView = function () {

        let viewInstance = null;

        let initialize = function (view) {
            
            let toggleButton = view.querySelector(".toggle-button");
            let debugPanel = view.querySelector(".debug-panel");

            toggleButton.addEventListener("click", function() {
                if (debugPanel.classList.contains("hidden")) {
                    debugPanel.classList.remove("hidden")
                } 
                else {
                    debugPanel.classList.add("hidden")
                }
            });

            let resetButton = view.querySelector(".reset-button");
            resetButton.addEventListener("click", window.PollParty.App.initialize);

            let navCodeButton = view.querySelector(".nav-code-button");
            navCodeButton.addEventListener("click", () => window.PollParty.App.navigate(window.PollParty.Views.CodeView));
            
            let navConnectButton = view.querySelector(".nav-connect-button");
            navConnectButton.addEventListener("click", () => window.PollParty.App.navigate(window.PollParty.Views.ConnectView));

            let navResponseButton = view.querySelector(".nav-response-button");
            navResponseButton.addEventListener("click", () => window.PollParty.App.navigate(window.PollParty.Views.ResponseView));

            let navErrorButton = view.querySelector(".nav-error-button");
            navErrorButton.addEventListener("click", () => window.PollParty.App.navigate(window.PollParty.Views.ErrorView));

            let navLoadingButton = view.querySelector(".nav-loading-button");
            navLoadingButton.addEventListener("click", () => window.PollParty.App.navigate(window.PollParty.Views.LoadingView));
        };

        this.initialize = initialize;
        this.templateSelector = ".demo.view";
    };

    if (demoMode) {
        let demoView = new DemoView();
        let template = document.querySelector(`#templates ${demoView.templateSelector}`).cloneNode(true);
        demoView.initialize(template);
        document.body.appendChild(template);
    }

})();