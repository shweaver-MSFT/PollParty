(function() {
    "use strict";

    let demoMode = true;

    let DemoView = function () {

        function initialize(view) {
            
            let toggleButton = view.querySelector(".toggle-button");
            toggleButton.addEventListener("click", window.PollParty.App.initialize);
        }

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