(function () {
    "use strict";

    let PowerPointHelper = function () {

        let isPresenting = function () {
            return new Promise(resolve => {
                Office.context.document.getActiveViewAsync(function (asyncResult) {
                    if (asyncResult.status === "failed") {
                        console.log("Action getActiveViewAsync failed with error: " + asyncResult.error.message);
                    }
                    else {
                        var isPresenting = asyncResult.value === "read";
                        resolve(isPresenting);
                    }
                });
            });
        };

        let getSelectedSlideId = function () {
            return new Promise(resolve => {
                Office.context.document.getSelectedDataAsync(Office.CoercionType.SlideRange, function (asyncResult) {
                    if (asyncResult.status === "failed") {
                        console.log("Action getSelectedDataAsync failed with error: " + asyncResult.error.message);
                    }
                    else {
                        var slideId = asyncResult.value.slides[0].id;
                        resolve(slideId);
                    }
                });
            });
        };


        // Get unique id of powerpoint document. 
        // Currently, didnt find any unique powerpoint document identifier we could use, so creating a unique guid and storing it in document settings 
        let getPresentationId = function () {
            // check if a unique id already exists, if not create one
            var uniqueDocumentId = Office.context.document.settings.get("PresentationId");
            if (uniqueDocumentId === null) {
                var uniqueDocumentId = window.PollParty.Helpers.UuidGenerator.uuidv4Crypto();
                Office.context.document.settings.set("PresentationId", uniqueDocumentId);
                // persist settings
                Office.context.document.settings.saveAsync(result => console.log("Save Setting Presentation Id: " + result.status));
            }
            return uniqueDocumentId;
        };

        this.isPresenting = isPresenting;
        this.getPresentationId = getPresentationId;
        this.getSelectedSlideId = getSelectedSlideId;
    }

    window.PollParty.Helpers.PowerPointHelper = new PowerPointHelper();

})();