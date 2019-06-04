(function() {
    "use strict";

    let EditView = function () {

        const placeholderText = "Type Your Question";
        let viewInstance = null;
        let question = null;

        let initialize = function (view, data) {
            
            viewInstance = view;
            let saveButton = viewInstance.querySelector(".save-button");
            let questionInputSpan = viewInstance.querySelector(".question-input");
            
            // Load in data immediately
            question == null;
            if (data !== undefined) {

                question = data.question;
                questionInputSpan.innerText = question.text;
            }
            else {

                question = {
                    text: null,
                    questionIndex: 1,
                    questionTotal: 1
                };
            }

            // Update default state
            updatePlaceholder();
            
            // Handle text input for our custom input field
            document.addEventListener("keypress", function (e) {
                handleKeypress(e.keyCode);
            });

            // Handle save click
            saveButton.addEventListener("click", function() {
                save();
            });
        };

        function save() {

            let questionInputSpan = viewInstance.querySelector(".question-input");
            let questionText = questionInputSpan.innerText;
            question.text = questionText;

            // Navigate to the static view
            window.PollParty.App.navigate(window.PollParty.Views.StaticView, {
                question: question
            });
        };

        function handleKeypress(charCode) {

            let questionInputSpan = viewInstance.querySelector(".question-input");
            if (!questionInputSpan.classList.contains("placeholder")) {
                // Handle enter key
                if (charCode === 13) {
                    save();
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
            if(regex.test(key)) {

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