 /*
    Program name: patient-form.html
    Author: Allison Lawrence
    Date created:3/5/2025
    Date last edited:3/7/2025
    Version: 3.1
    Description: This is the javacsript file for Lavender holistic clinic */
  

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("registrationForm");
    const touchedFields = {}; //tracks field the user has interacted with

    //set valid date range for birthday input
    const today = new Date();
    const minBirthDate = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate());

    const birthdayInput = document.getElementById("birthday");
    birthdayInput.setAttribute("max", today.toISOString().split("T")[0]);
    birthdayInput.setAttribute("min", minBirthDate.toISOString().split("T")[0]);

    //dynamically updates the slider value display
    const feelingSlider = document.getElementById("feelingSlider");
    const sliderValue = document.getElementById("sliderValue");
    feelingSlider.addEventListener("input", () => {
        sliderValue.textContent = feelingSlider.value;
    });

    //show error message and apply red border from css file
    function showError(input, errorElement, message) {
        errorElement.textContent = message;
        input.classList.remove("valid-border");
        input.classList.add("error-border");
        return false;
    }
    //clear error message and apply green border from css file
    function clearError(input, errorElement) {
        errorElement.textContent = "";
        input.classList.remove("error-border");
        input.classList.add("valid-border");
        return true;
    }
    //returns true if the user has interacted with the field
    function shouldValidate(id) {
        return touchedFields[id];
    }
    //regex-based validation function
    function validateRegex(id, regex, errorId, message) {
        const input = document.getElementById(id);
        const error = document.getElementById(errorId);
        if (!shouldValidate(id)) return true;
        return regex.test(input.value.trim())
            ? clearError(input, error)
            : showError(input, error, message);
    }
    //validation of birthday range
    function validateBirthday() {
        const input = document.getElementById("birthday");
        const error = document.getElementById("birthdayError");
        if (!shouldValidate("birthday")) return true;
        if (!input.value) return showError(input, error, "Please enter your date of birth.");
        const date = new Date(input.value);
        if (date > today) return showError(input, error, "Birthday cannot be in the future.");
        if (date < minBirthDate) return showError(input, error, "Birthday cannot be more than 120 years ago.");
        return clearError(input, error);
    }
    //ensures a state is selected
    function validateState() {
        const input = document.getElementById("state");
        const error = document.getElementById("stateError");
        if (!shouldValidate("state")) return true;
        return input.value
            ? clearError(input, error)
            : showError(input, error, "Please select a state.");
    }
    //compare password and repeat password fields
    function validatePasswordsMatch() {
        const pw1 = document.getElementById("password");
        const pw2 = document.getElementById("repeatpassword");
        const error = document.getElementById("repeatPasswordError");
        if (!shouldValidate("repeatpassword")) return true;
        return pw1.value === pw2.value
            ? clearError(pw2, error)
            : showError(pw2, error, "Passwords do not match.");
    }
    //check if password meets strength criteria
    function validatePasswordStrength() {
        const input = document.getElementById("password");
        const error = document.getElementById("passwordError");
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!shouldValidate("password")) return true;
        return regex.test(input.value)
            ? clearError(input, error)
            : showError(input, error, "Must include uppercase, lowercase, digit, and 8+ chars.");
    }
    //check if username is valid format
    function validateUserId() {
        const input = document.getElementById("username");
        const error = document.getElementById("usernameError");
        const regex = /^[a-zA-Z][a-zA-Z0-9_-]{4,29}$/;
        if (!shouldValidate("username")) return true;
        return regex.test(input.value)
            ? clearError(input, error)
            : showError(input, error, "Must be 5 - 30 characters, start with a letter.");
    }
    //ensure password doesn't match the username
    function validatePasswordNotUserId() {
        const user = document.getElementById("username").value;
        const pass = document.getElementById("password").value;
        const error = document.getElementById("passwordError");
        if (!shouldValidate("password")) return true;
        if (user === pass) {
            return showError(document.getElementById("password"), error, "Password cannot match User ID.");
        }
        return true;
    }
    //format SSN as user types and validate 9 digit rule
    function formatAndValidateSSN() {
        const input = document.getElementById("socialsecurity");
        const error = document.getElementById("ssnError");
        let digits = input.value.replace(/\D/g, "").slice(0, 9);
        let formatted = digits;
        if (digits.length > 5) {
            formatted = `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`;
        } else if (digits.length > 3) {
            formatted = `${digits.slice(0, 3)}-${digits.slice(3)}`;
        }
        const start = input.selectionStart;
        input.value = formatted;
        input.setSelectionRange(start, start);

        if (!shouldValidate("socialsecurity")) return true;
        return digits.length === 9
            ? clearError(input, error)
            : showError(input, error, "Must be exactly 9 digits.");
    }
    //field-specific validations using regex
    function validateZip() {
        return validateRegex("zipcode", /^\d{5}(-\d{4})?$/, "zipError", "Invalid zip format.");
    }

    function validatePhone() {
        return validateRegex("phonenumber", /^\d{3}-\d{3}-\d{4}$/, "phoneError", "Use 000-000-0000 format.");
    }

    function validateEmail() {
        return validateRegex("emailaddress", /^[^\s@]+@[^\s@]+\.[^\s@]+$/, "emailError", "Invalid email format.");
    }
    //run all validations and return if everything is valid
    function validateAllFields() {
        const allValid = [
            validateRegex("fname", /^[A-Za-z'-]{1,30}$/, "fnameError", "First name invalid."),
            validateRegex("mname", /^[A-Za-z]?$/, "mnameError", "Middle initial invalid."),
            validateRegex("lname", /^[A-Za-z' -]{1,30}$/, "lnameError", "Last name invalid."),
            validateRegex("addressline1", /^[A-Za-z0-9\s\-,.]{2,30}$/, "address1Error", "Address invalid."),
            validateState(),
            validateRegex("city", /^[A-Za-z\s\-']{2,30}$/, "cityError", "City name invalid."),
            validateZip(),
            validatePhone(),
            validateEmail(),
            validateBirthday(),
            formatAndValidateSSN(),
            validateUserId(),
            validatePasswordStrength(),
            validatePasswordsMatch(),
            validatePasswordNotUserId()
        ].every(Boolean);
        return allValid;
    }
    //attach event listeners to fields for real-time validation
    const eventPairs = [
        ["fname", validateAllFields],
        ["mname", validateAllFields],
        ["lname", validateAllFields],
        ["addressline1", validateAllFields],
        ["addressline2", validateAllFields],
        ["city", validateAllFields],
        ["zipcode", validateAllFields],
        ["phonenumber", validateAllFields],
        ["emailaddress", validateAllFields],
        ["birthday", validateAllFields],
        ["username", validateAllFields],
        ["password", validateAllFields],
        ["repeatpassword", validateAllFields],
        ["socialsecurity", formatAndValidateSSN],
        ["state", validateAllFields]
    ];

    eventPairs.forEach(([id, handler]) => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener("input", () => {
                touchedFields[id] = true;
                handler();
            });
            el.addEventListener("blur", () => {
                touchedFields[id] = true;
                handler();
            });
        }
    });
    //logic for the validate button: validates input and conditionally shows submit
    const validateBtn = document.getElementById("validateBtn");
    validateBtn.addEventListener("click", function (e) {
        e.preventDefault();
        const allValid = validateAllFields();
        const existingSubmit = document.getElementById("realSubmit");

        if (allValid) {
            if (!existingSubmit) {
                const submitBtn = document.createElement("button");
                submitBtn.type = "submit";
                submitBtn.textContent = "Submit Form";
                submitBtn.id = "realSubmit";
                validateBtn.parentNode.insertBefore(submitBtn, validateBtn.nextSibling);
            }
        } else {
            if (existingSubmit) existingSubmit.remove();
        }
    });
    //prevent submission if fields invalid
    form.addEventListener("submit", function (e) {
        if (!validateAllFields()) e.preventDefault();
    });
    //clear button logic: clears all borders and hides submit
    document.querySelector('input[type="reset"]').addEventListener("click", () => {
        form.querySelectorAll(".error").forEach(span => span.textContent = "");
        form.querySelectorAll("input, select, textarea").forEach(input => {
            input.classList.remove("error-border", "valid-border");
            input.classList.add("default-border");
        });
        const realSubmit = document.getElementById("realSubmit");
        if (realSubmit) realSubmit.remove();
    });

    // review button logic: gathers and displays user inputs
    const reviewButton = document.getElementById("reviewbutton");
    const reviewSection = document.getElementById("reviewForm");
    const reviewContent = document.getElementById("reviewContent");

    const fieldNames = {  //same as before
        fname: "First Name",
        mname: "Middle Initial",
        lname: "Last Name",
        addressline1: "Address Line 1",
        addressline2: "Address Line 2",
        city: "City",
        state: "State",
        zipcode: "Zip Code",
        phonenumber: "Phone Number",
        emailaddress: "Email Address",
        birthday: "Date of Birth",
        socialsecurity: "Social Security Number",
        username: "User Name",
        password: "Password",
        repeatpassword: "Repeat Password",
        feelingSlider: "How do you feel today?",
        patientmed: "Medications",
        smoke: "Do you smoke?",
        alcohol: "Do you drink alcohol?",
        fitness: "Do you maintain an active lifestyle?"
    };

    if (reviewButton) {
        reviewButton.addEventListener("click", function () {
            reviewSection.style.display = "block";
            reviewContent.innerHTML = "";

            let reviewList = document.createElement("ul");
            let groupedCheckboxes = {};

            form.querySelectorAll("input, select, textarea").forEach(input => {
                if (["submit", "reset", "button"].includes(input.type)) return;

                let id = input.id || input.name;
                let label = fieldNames[input.name] || fieldNames[id] || id;
                let value = "";
                //handles grouped checkboxes
                if (input.type === "checkbox") {
                    if (input.checked) {
                        if (input.id === "notapp") {
                            groupedCheckboxes["Herbal Medication"] = ["None of the Above"];
                        } else if (input.name.startsWith("herbalmed")) {
                            if (!groupedCheckboxes["Herbal Medication"]) {
                                groupedCheckboxes["Herbal Medication"] = [];
                            }
                            if (!groupedCheckboxes["Herbal Medication"].includes("None of the Above")) {
                                groupedCheckboxes["Herbal Medication"].push(input.value);
                            }
                        } else {
                            if (!groupedCheckboxes[label]) {
                                groupedCheckboxes[label] = [];
                            }
                            groupedCheckboxes[label].push(input.value);
                        }
                    }
                    return;
                }

                if (input.type === "radio") {
                    if (!input.checked) return;
                    value = input.value;
                } else if (input.tagName === "SELECT") {
                    value = input.options[input.selectedIndex].text;
                } else {
                    value = input.value.trim() || (input.required ? "<span style='color:red;'>Missing</span>" : "Not provided");
                }

                if (["password", "repeatpassword", "socialsecurity"].includes(input.id)) {
                    value = input.value.trim() ? "********" : "Not provided";
                }

                let item = document.createElement("li");
                item.innerHTML = `<strong>${label}:</strong> ${value}`;
                reviewList.appendChild(item);
            });

            for (let [label, values] of Object.entries(groupedCheckboxes)) {
                let item = document.createElement("li");
                item.innerHTML = `<strong>${label}:</strong> ${values.join(", ")}`;
                reviewList.appendChild(item);
            }

            reviewContent.appendChild(reviewList);
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }
});