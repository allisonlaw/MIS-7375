 /*
    Program name: patient-form.html
    Author: Allison Lawrence
    Date created:3/5/2025
    Date last edited:3/7/2025
    Version: 3.1
    Description: This is the javacsript file for Lavender holistic clinic */
  

document.addEventListener("DOMContentLoaded", function () {
    // dynamic Date
    document.getElementById("dynamicdate").innerHTML = new Date().toLocaleDateString();
    // elements
    const form = document.getElementById("registrationForm");
    const reviewButton = document.getElementById("reviewbutton");
    const reviewSection = document.getElementById("reviewForm");
    const reviewContent = document.getElementById("reviewContent");
    const feelingSlider = document.getElementById("feelingSlider");
    const sliderValue = document.getElementById("sliderValue");
    const birthdayInput = document.getElementById("birthday");
    const birthdayError = document.getElementById("birthdayError");
    // dynamic date min/max for birthday
    let today = new Date();
    let todayFormatted = today.toISOString().split("T")[0];
    let minBirthDate = new Date();
    minBirthDate.setFullYear(today.getFullYear() - 120);
    let minBirthFormatted = minBirthDate.toISOString().split("T")[0];
    birthdayInput.setAttribute("max", todayFormatted);
    birthdayInput.setAttribute("min", minBirthFormatted);
    // function: validate birthday
    function validateBirthday() {
        let birthdayValue = birthdayInput.value;
        let birthdayDate = new Date(birthdayValue);
        if (!birthdayValue) {
            birthdayError.textContent = "Please enter your date of birth.";
            birthdayInput.style.border = "2px solid red";
            return false;
        }
        if (birthdayDate > today) {
            birthdayError.textContent = "Birthday cannot be in the future.";
            birthdayInput.style.border = "2px solid red";
            return false;
        }
        if (birthdayDate < minBirthDate) {
            birthdayError.textContent = "Birthday cannot be more than 120 years ago.";
            birthdayInput.style.border = "2px solid red";
            return false;
        }
        birthdayError.textContent = "";
        birthdayInput.style.border = "2px solid green";
        return true;
    }
    birthdayInput.addEventListener("input", validateBirthday);
    // function: update slider display
    function updateSliderValue() {
        sliderValue.textContent = feelingSlider.value;
    }
    feelingSlider.addEventListener("input", updateSliderValue);
    updateSliderValue(); // Initialize slider display
    // field name mapping
    const fieldNames = {
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
        fitness: "Do you maintain an active lifestyle?",
    };
    // function: show review section with filtered data
if (reviewButton) {
    reviewButton.addEventListener("click", function () {
        reviewSection.style.display = "block";
        reviewContent.innerHTML = ""; // clear previous content
        let reviewList = document.createElement("ul");
        let groupedCheckboxes = {}; // store grouped checkboxes
        form.querySelectorAll("input, select, textarea").forEach(input => {
            if (input.type === "submit" || input.type === "reset") return;
            let id = input.id || input.name;
            let label = fieldNames[input.name] || fieldNames[id] || id;
            let value = "";
            // handle checkboxes correctly
            if (input.type === "checkbox") {
                if (input.checked) {
                    if (input.id === "notapp") {
                        groupedCheckboxes["Herbal Medication"] = ["None of the Above"];
                    } else if (input.name.startsWith("herbalmed")) {
                        // if "none of the above" is not selected, group herbal medications
                        if (!groupedCheckboxes["Herbal Medication"]) {
                            groupedCheckboxes["Herbal Medication"] = [];
                        }
                        // only add if "none of the above" wasn't already chosen
                        if (!groupedCheckboxes["Herbal Medication"].includes("None of the Above")) {
                            groupedCheckboxes["Herbal Medication"].push(input.value);
                        }
                    } else {
                        // handle other grouped checkboxes normally
                        if (!groupedCheckboxes[label]) {
                            groupedCheckboxes[label] = [];
                        }
                        groupedCheckboxes[label].push(input.value);
                    }
                }
                return; // skip adding individual checkboxes
            }
            // properly handle radio buttons (only selected one)
            else if (input.type === "radio") {
                if (!input.checked) return;
                value = input.value;
            }
            // handle dropdowns
            else if (input.tagName === "SELECT") {
                value = input.options[input.selectedIndex].text;
            }
            // handle text fields and textareas
            else {
                if (!input.value.trim()) {
                    value = (input.hasAttribute("required")) 
                        ? `<span style="color:red;">Missing Required Field</span>` 
                        : "Not provided";
                } else {
                    value = input.value.trim();
                }
            }
            // add review item
            let listItem = document.createElement("li");
            listItem.innerHTML = `<strong>${label}:</strong> ${value}`;
            reviewList.appendChild(listItem);
        });
        // add grouped checkboxes to review output
        for (let [label, values] of Object.entries(groupedCheckboxes)) {
            let listItem = document.createElement("li");
            listItem.innerHTML = `<strong>${label}:</strong> ${values.join(", ")}`;
            reviewList.appendChild(listItem);
        }
        reviewContent.appendChild(reviewList);
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}
    // function: validate input fields
    function validateInput(input, errorElement, regex, errorMessage) {
        if (!regex.test(input.value)) {
            errorElement.textContent = errorMessage;
            input.style.border = "2px solid red";
            return false;
        }
        errorElement.textContent = "";
        input.style.border = "2px solid green";
        return true;
    }
    function validateState() {
        let stateInput = document.getElementById("state");
        let stateError = document.getElementById("stateError");
        if (stateInput.value === "") {
            stateError.textContent = "Please select a state.";
            stateInput.style.border = "2px solid red";
            return false;
        }
        stateError.textContent = "";
        stateInput.style.border = "2px solid green";
        return true;
    }
    // attach event listeners for validation
    const validationFields = [
        { input: "fname", regex: /^[A-Za-z'-]{1,30}$/, error: "fnameError", message: "First name can only contain letters, apostrophes ('), and dashes (-)." },
        { input: "mname", regex: /^[A-Za-z]?$/, error: "mnameError", message: "Middle initial must be a single letter (A-Z) or left blank." },
        { input: "lname", regex: /^[A-Za-z' -]*(?:\b[2-5]\b)?$/, error: "lnameError", message: "Last name can contain letters, apostrophes ('), dashes (-), and numbers (2-5)." },
        { input: "emailaddress", regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, error: "emailError", message: "Invalid email format (name@domain.tld)." },
        { input: "phonenumber", regex: /^\d{3}-\d{3}-\d{4}$/, error: "phoneError", message: "Phone number must be in 000-000-0000 format." },
    ];
    validationFields.forEach(({ input, regex, error, message }) => {
        let element = document.getElementById(input);
        let errorElement = document.getElementById(error);
        element.addEventListener("input", () => validateInput(element, errorElement, regex, message));
    });
    // email validation (real-time)
document.getElementById("emailaddress").addEventListener("input", function () {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const emailError = document.getElementById("emailError");
    if (!emailRegex.test(this.value)) {
        emailError.textContent = "Invalid email format. Please enter a valid email (name@domain.tld).";
        this.style.border = "2px solid red";
    } else {
        emailError.textContent = "";
        this.style.border = "2px solid green";
    }
});
    document.getElementById("state").addEventListener("change", validateState);
    // prevent form submission if validation fails
    form.addEventListener("submit", function (event) {
        let valid = validationFields.every(({ input, regex, error, message }) =>
            validateInput(document.getElementById(input), document.getElementById(error), regex, message));
        valid &= validateState();
        valid &= validateBirthday();
        if (!valid) event.preventDefault();
    });
});
// Function to validate if passwords match
function validatePasswords() {
    const password = document.getElementById("password");
    const repeatPassword = document.getElementById("repeatpassword");
    const repeatPasswordError = document.getElementById("repeatPasswordError");

    if (password.value !== repeatPassword.value) {
        repeatPasswordError.textContent = "Passwords do not match!";
        repeatPassword.style.border = "2px solid red";
        return false;
    } else {
        repeatPasswordError.textContent = "";
        repeatPassword.style.border = "2px solid green";
        return true;
    }
}

// Attach event listeners for real-time validation
document.getElementById("password").addEventListener("input", validatePasswords);
document.getElementById("repeatpassword").addEventListener("input", validatePasswords);

// Prevent form submission if passwords don't match
form.addEventListener("submit", function (event) {
    let valid = validationFields.every(({ input, regex, error, message }) =>
        validateInput(document.getElementById(input), document.getElementById(error), regex, message)
    );
    valid &= validateState();
    valid &= validateBirthday();
    valid &= validatePasswords(); // Ensure passwords match before submission

    if (!valid) {
        event.preventDefault(); // Stop form submission
    }
});
// validating social security format
document.getElementById("socialsecurity").addEventListener("input", function () {
    const ssnRegex = /^\d{9}$/;
    const ssnError = document.getElementById("ssnError");
    if (!ssnRegex.test(this.value)) {
        ssnError.textContent = "SSN must be 9 digits.";
        this.style.border = "2px solid red";
    } else {
        ssnError.textContent = "";
        this.style.border = "2px solid green";
    }
});


