(function () {
    "use strict";

    let EditView = function () {

        const placeholderText = "Type Your Question";

        let saveButton = null;
        let questionInputSpan = null;

        async function initialize(view, data) {

            try {
                saveButton = view.querySelector(".save-button");
                questionInputSpan = view.querySelector(".question-input");

                if (data && data.questionSet) {

                    let questionSet = data.questionSet;
                    let slideId = await window.PollParty.Helpers.PowerPointHelper.getSelectedSlideIdAsync();
                    let question = questionSet.questions.find((q) => q.slideId == slideId);
                    questionInputSpan.innerText = question.questionText;
                }

                // Update default state
                updatePlaceholder();

                // Handle text input for our custom input field
                document.addEventListener("keypress", handleKeypress);

                // Handle save click
                saveButton.addEventListener("click", handleSaveButtonClick);
            }
            catch(e) {
                window.PollParty.App.navigate(window.PollParty.Views.ErrorView);
            }
        }

        function unload() {

            document.removeEventListener("keypress", handleKeypress);

            if (saveButton) {
                saveButton.removeEventListener("click", handleSaveButtonClick);
                saveButton = null;
            }

            questionInputSpan = null;
        }

        function handleSaveButtonClick() {
            saveAsync();
        }

        async function saveAsync() {

            let presentationId = await window.PollParty.Helpers.PowerPointHelper.getPresentationIdAsync();
            let slideId = await window.PollParty.Helpers.PowerPointHelper.getSelectedSlideIdAsync();
            let questionText = questionInputSpan.innerText;

            let url = `/api/question/save?pid=${presentationId}&sid=${slideId}&text=${questionText}`;
            let response = await fetch(url, {
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json'
                }
            });
            
            let questionSet = await response.json();

            window.PollParty.App.navigate(window.PollParty.Views.StaticView, {
                questionSet: questionSet
            });
        }

        function handleKeypress(e) {

            let charCode = e.keyCode;

            if (!questionInputSpan.classList.contains("placeholder")) {

                switch(charCode) {

                    // Handle enter key
                    case 13:
                        saveAsync();
                        return;

                    // Handle backspace
                    case 8:
                        questionInputSpan.innerText = questionInputSpan.innerText.slice(0, -1);
                        updatePlaceholder();
                        return; 
                }
            }

            // Handle char keys
            let key = String.fromCharCode(charCode);
            var regex = /^[\x20-\x7F]*$/;
            if (regex.test(key)) {

                if (questionInputSpan.classList.contains("placeholder")) {
                    questionInputSpan.innerText = "";
                }

                questionInputSpan.innerText += key;
                updatePlaceholder();
            }
        }

        function updatePlaceholder() {

            let questionText = questionInputSpan.innerText;

            if (questionText.length === 0) {
                questionInputSpan.innerText = placeholderText;
                questionInputSpan.classList.add("placeholder");
                saveButton.disabled = true;
            }
            else {
                questionInputSpan.classList.remove("placeholder");
                saveButton.disabled = false;
            }
        }

        this.initialize = initialize;
        this.unload = unload;
        this.templateSelector = ".edit.view";
    };

    window.PollParty.Views.EditView = EditView;

})();