(function () {
    "use strict";

    let EditView = function () {

        const placeholderText = "Type Your Question";
        let viewInstance = null;

        let initialize = async function (view, data) {

            viewInstance = view;
            let saveButton = viewInstance.querySelector(".save-button");
            let questionInputSpan = viewInstance.querySelector(".question-input");

            if (data) {

                let slideId = await window.PollParty.Helpers.PowerPointHelper.getSelectedSlideIdAsync();
                let question = data.questions.find((q) => q.slideId == slideId);
                questionInputSpan.innerText = question.questionText;
            }

            // Update default state
            updatePlaceholder();

            // Handle text input for our custom input field
            document.addEventListener("keypress", function (e) {
                handleKeypress(e.keyCode);
            });

            // Handle save click
            saveButton.addEventListener("click", function () {
                saveAsync();
            });
        };

        async function saveAsync() {

            let presentationId = await window.PollParty.Helpers.PowerPointHelper.getPresentationIdAsync();
            let slideId = await window.PollParty.Helpers.PowerPointHelper.getSelectedSlideIdAsync();
            let questionInputSpan = viewInstance.querySelector(".question-input");
            let questionText = questionInputSpan.innerText;

            let url = `/api/question/save?pid=${presentationId}&sid=${slideId}&text=${questionText}`;
            let xhr = new XMLHttpRequest();
            xhr.responseType = "json";
            xhr.open("POST", url);
            xhr.addEventListener("load", function () {
                if (xhr.status !== 200) {
                    window.PollParty.App.navigate(window.PollParty.Views.ErrorView, {
                        message: "Error saving question, please try again.",
                        showButton: true,
                        commandText: "Try Again",
                        commandCallback: function () {
                            // Recursive call to try again
                            saveAsync();
                        }
                    });
                    return;
                }

                // Navigate to the static view
                let questionSet = xhr.response;
                window.PollParty.App.navigate(window.PollParty.Views.StaticView, questionSet);
            });

            xhr.send();
        };

        function handleKeypress(charCode) {

            let questionInputSpan = viewInstance.querySelector(".question-input");
            if (!questionInputSpan.classList.contains("placeholder")) {
                // Handle enter key
                if (charCode === 13) {
                    saveAsync();
                    return;
                }

                // Handle backspace
                if (charCode === 8) {
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
        };

        function updatePlaceholder() {

            let saveButton = viewInstance.querySelector(".save-button");
            let questionInputSpan = viewInstance.querySelector(".question-input");

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
        this.templateSelector = ".edit.view";
    };

    window.PollParty.Views.EditView = EditView;

})();