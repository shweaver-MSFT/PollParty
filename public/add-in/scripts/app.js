(function () {
    "use strict";

    window.App = new function () {

        var initialize = function () {
            let contentRoot = document.querySelector("#content-root");

            let newView = document.querySelector("#templates .new").cloneNode(true);

            contentRoot.innerHTML = newView.outerHTML;
        };

        this.initialize = initialize;
    };

    // The initialize function must be run each time a new page is loaded.
    if (Office && typeof PowerPoint !== 'undefined') {
        Office.initialize = App.initialize;
    }
    else {
        window.addEventListener('DOMContentLoaded', App.initialize);
    }

})();