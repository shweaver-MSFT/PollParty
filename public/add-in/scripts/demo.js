(function() {
    "use strict";

    let demoMode = true;

    let DemoView = function () {

        let viewInstance = null;

        let initialize = function (view) {
            viewInstance = view;
            
            

        };

        this.initialize = initialize;
        this.templateSelector = ".demo.view";
    };

    if (demoMode) {
        let view = new DemoView();
        let template = document.querySelector(`#templates ${view.templateSelector}`).cloneNode(true);
        view.initialize(template);
        document.body.appendChild(view);
    }

})();