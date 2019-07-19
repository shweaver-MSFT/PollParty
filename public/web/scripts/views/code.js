(function() {
    "use strict";

    let CodeView = function () {

        let confirmButton = null;
        let digitSpans = null;

        function initialize(view, data) {
            
            // Disable the confirm button until we have valid input
            confirmButton = view.querySelector(".confirm-button");
            confirmButton.disabled = true;
            confirmButton.addEventListener("click", submit);

            // Handle text input for our custom input field
            document.addEventListener("keypress", handleKeypress);

            // Focus on the first digit
            digitSpans = view.querySelector(".code-panel").querySelectorAll(".digit");
            digitSpans[0].classList.add("focused");
        };

        function unload() {

            document.removeEventListener("keypress", handleKeypress);
            
            if (confirmButton) {
                confirmButton.removeEventListener("click", submit);
                confirmButton = null;
            }

            digitSpans = null;
        };

        function handleKeypress(e) {
            
            let charCode = e.keyCode;

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
            
            // Extract the code digits
            let code = "";
            for (var i = 0; i < digitSpans.length; i++) {
                let digitSpan = digitSpans[i];
                let digit = digitSpan.innerText;
                code += digit;
            }

            // Send to the connect view to handle the session connection
            window.PollParty.App.navigate(window.PollParty.Views.ConnectView, { 
                code: code 
            });
        }

        this.initialize = initialize;
        this.unload = unload;
        this.templateSelector = ".code.view";
    };

    window.PollParty.Views.CodeView = CodeView;

})();