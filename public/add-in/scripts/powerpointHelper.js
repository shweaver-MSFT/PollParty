(function () {
    "use strict";

    let PowerPointHelper = function () {

        let isPresenting = function () {
            var isPresenting = false;
            Office.context.document.getActiveViewAsync(function (asyncResult) {
                if (asyncResult.status === "failed") {
                    console.log("Action getActiveViewAsync failed with error: " + asyncResult.error.message);
                }
                else {
                    isPresenting = asyncResult.value === "read";
                }
            });

            return isPresenting;
        }

        let getSelectedSlideId = function () {
            return getSelectedSlide().id;
        }

        function getSelectedSlide() {
            var slide = {};
            Office.context.document.getSelectedDataAsync(Office.CoercionType.SlideRange, function (asyncResult) {
                if (asyncResult.status == "failed") {
                    console.log("Action getSelectedDataAsync failed with error: " + asyncResult.error.message);
                }
                else {
                    slide = asyncResult.value.slides[0];
                }
            });
            return slide;
        }

        // Get unique id of powerpoint document. 
        // Currently, didnt find any unique powerpoint document identifier we could use, so creating a unique guid and storing it in document settings 
        let getPresentationId = function () {
            // check if a unique id already exists, if not create one
            var uniqueDocumentId = Office.context.document.settings.get("PresentationId");
            if (uniqueDocumentId === null) {
                var uuid = window.PollParty.Helpers.UuidGenerator.uuidv4Crypto();
                Office.context.document.settings.set("PresentationId", uuid);
                // persist settings
                Office.context.document.settings.saveAsync(result => console.log("Save Setting Presentation Id: " + result));
            }
            return uniqueDocumentId;
        }

        this.isPresenting = isPresenting;
        this.getPresentationId = getPresentationId;
        this.getSelectedSlideId = getSelectedSlideId;
    }

    window.PollParty.Helpers.PowerPointHelper = new PowerPointHelper();

})();