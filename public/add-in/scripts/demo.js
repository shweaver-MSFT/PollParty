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

            let navEditButton = view.querySelector(".nav-edit-button");
            navEditButton.addEventListener("click", () => window.PollParty.App.navigate(window.PollParty.Views.EditView));

            let navErrorButton = view.querySelector(".nav-error-button");
            navErrorButton.addEventListener("click", () => window.PollParty.App.navigate(window.PollParty.Views.ErrorView));

            let navLiveButton = view.querySelector(".nav-live-button");
            navLiveButton.addEventListener("click", () => window.PollParty.App.navigate(window.PollParty.Views.LiveView));

            let navLoadingButton = view.querySelector(".nav-loading-button");
            navLoadingButton.addEventListener("click", () => window.PollParty.App.navigate(window.PollParty.Views.LoadingView));

            let navStaticButton = view.querySelector(".nav-static-button");
            navStaticButton.addEventListener("click", () => window.PollParty.App.navigate(window.PollParty.Views.StaticView));
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