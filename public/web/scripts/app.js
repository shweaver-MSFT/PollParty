(function () {
    "use strict";

    window.App = new function () {

        var initialize = function () {
            let contentRoot = document.querySelector("#content-root");

            let mainView = document.querySelector("#templates .main").cloneNode(true);

            contentRoot.innerHTML = mainView.outerHTML;
        };

        this.initialize = initialize;
    };

    // The initialize function must be run each time a new page is loaded.
    window.addEventListener('DOMContentLoaded', App.initialize);

})();