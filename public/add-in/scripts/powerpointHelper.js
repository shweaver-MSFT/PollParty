(function () {
    "use strict";

    let PowerPointHelper = function () {

        let isPresentingAsync = function () {

            return new Promise(function(resolve, error) {
                try {
                    Office.context.document.getActiveViewAsync(function (asyncResult) {
                        if (asyncResult.status === "failed") {
                            error("Action getActiveViewAsync failed with error: " + asyncResult.error.message);
                        }
                        else {
                            var isPresenting = asyncResult.value === "read";
                            resolve(isPresenting);
                        }
                    });
                }
                catch(e) {
                    console.log(e.message);
                    error(e.message);
                }
            });
        };

        let getSelectedSlideIdAsync = function () {

            return new Promise(function(resolve, error) {
                try {
                    Office.context.document.getSelectedDataAsync(Office.CoercionType.SlideRange, function (asyncResult) {
                        if (asyncResult.status === "failed") {
                            error("Action getSelectedDataAsync failed with error: " + asyncResult.error.message);
                        }
                        else {
                            var slideId = asyncResult.value.slides[0].id;
                            resolve(slideId);
                        }
                    });
                }
                catch(e) {
                    console.log(e.message);
                    error(e.message);
                }
            });
        };


        // Get unique id of powerpoint document. 
        // Currently, didnt find any unique powerpoint document identifier we could use, so creating a unique guid and storing it in document settings 
        let getPresentationIdAsync = function () {
            
            return new Promise(async function(resolve, error) {
                try {
                    // check if a unique id already exists, if not create one
                    var uniqueDocumentId = Office.context.document.settings.get("PresentationId");
                    if (uniqueDocumentId === null) {
                        var uniqueDocumentId = window.PollParty.Helpers.UuidGenerator.uuidv4Crypto();
                        Office.context.document.settings.set("PresentationId", uniqueDocumentId);
                        // persist settings
                        await Office.context.document.settings.saveAsync(result => console.log("Save Setting Presentation Id: " + result.status));
                    }
                    resolve(uniqueDocumentId);
                }
                catch(e) {
                    console.log(e.message);
                    error(e.message);
                }
            });
        };

        this.isPresentingAsync = isPresentingAsync;
        this.getPresentationIdAsync = getPresentationIdAsync;
        this.getSelectedSlideIdAsync = getSelectedSlideIdAsync;
    }

    window.PollParty.Helpers.PowerPointHelper = new PowerPointHelper();

})();