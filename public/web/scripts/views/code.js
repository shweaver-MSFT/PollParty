(function() {
    "use strict";

    let CodeView = function () {

        let viewInstance = null;

        let initialize = function (view, data) {
            
            viewInstance = view;

            // Disable the confirm button until we have valid input
            let confirmButton = view.querySelector(".confirm-button");
            confirmButton.disabled = true;
            confirmButton.addEventListener("click", function() {
                submit();
            });

            // Handle text input for our custom input field
            document.addEventListener("keypress", function (e) {
                handleKeypress(e.keyCode);
            });

            // Focus on the first digit
            let firstDigit = view.querySelector(".code-panel").querySelector(".digit");
            firstDigit.classList.add("focused");
        };

        function handleKeypress(charCode) {
            
            let confirmButton = viewInstance.querySelector(".confirm-button");
            let digitSpans = viewInstance.querySelector(".code-panel").querySelectorAll(".digit");

            // Handle enter key
            if (charCode === 13 && confirmButton.disabled === false) {
                submit();
                return;
            }
        
            // Handle backspace
            if (charCode === 8) {
                
                // Loop backward over the digits, find the first with a non-"X" value, replace it with an "X".
                for (var i = digitSpans.length - 1; i >= 0; i--) {
                    let digitSpan = digitSpans[i];
                    let digit = digitSpan.innerText;

                    if (digit === "X") {
                        continue;
                    }

                    digitSpan.classList.add("focused");
                    digitSpan.classList.remove("valid");
                    digitSpan.innerText = "X";
                    confirmButton.disabled = true;

                    if (i != digitSpans.length - 1) {
                        digitSpans[i + 1].classList.remove("focused");
                    }

                    break;
                }
                return;
            }
            
            // Handle char keys
            let key = String.fromCharCode(charCode);
            var regex = /^[0-9]*$/;
            if(regex.test(key)) {

                for (var i = 0; i < digitSpans.length; i++) {
                    let digitSpan = digitSpans[i];
                    let digit = digitSpan.innerText;

                    if (digit !== "X") {
                        continue;
                    }

                    digitSpan.innerText = key;
                    digitSpan.classList.add("valid");
                    digitSpan.classList.remove("focused");

                    if (i === digitSpans.length - 1) {
                        confirmButton.disabled = false;
                    }
                    else {
                        digitSpans[i + 1].classList.add("focused");
                    }
                    break;
                }
            }
        };

        function submit() {
            
            let digitSpans = viewInstance.querySelector(".code-panel").querySelectorAll(".digit");
            
            // Extract the code digits
            let code = "";
            for (var i = 0; i < digitSpans.length; i++) {
                let digitSpan = digitSpans[i];
                let digit = digitSpan.innerText;
                code += digit;
            }

            // Send to the connect view to handle the session connection
            window.PollParty.App.navigate(window.PollParty.Views.ConnectView, code);
        }

        this.initialize = initialize;
        this.templateSelector = ".code.view";
    };

    window.PollParty.Views.CodeView = CodeView;

})();