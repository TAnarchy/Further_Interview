//Initial method called when the 'Submit' button is clicked
function processSubmit() {
    const firstName = get_field_value("fname")
    const lastName = get_field_value("lname")
    const email = get_field_value("email")
    const phone = get_field_value("phone_number")
	const api_key = get_field_value("api_key")
    if (validate(firstName, lastName, email, phone, api_key)) {
        submit(firstName, lastName, email, phone, api_key)
    }
}

//Master validation function, calls all the other validators
function validate(firstName = "", lastName = "", email = "", phone = "", api_key = "") {
    let validated = true;

    let error_message = ""
    if (api_key.length == 0) {
        validated = false;
        error_message = `${error_message}API Key is missing, please enter a valid API Key<br>`
    }
    if (firstName.length == 0) {
        validated = false;
        error_message = `${error_message}First Name is missing, please enter a valid first name<br>`
    }

    if (lastName.length == 0) {
        validated = false;
        error_message = `${error_message}Last Name is missing, please enter a valid last name<br>`
    }


    if (!email_validator(email)) {
        validated = false;
        error_message = `${error_message}Email is invalid, please enter a valid Email<br>`
    }
    if (!phone_validator(phone)) {
        validated = false;
        error_message = `${error_message}Phone number is invalid, please make sure the phone number contains only digits and is exactly 10 digits long<br>`
    }

    if (!validated) {
        log_error(error_message, firstName, lastName, email, phone)
    }

    return validated
}

//helper function that returns the field values
function get_field_value(value_id) {
    return document.querySelector(`#${value_id}`).value.trim()
}

//Email validator based ona Regexp
function email_validator(email) {
    return email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
}

//Phone validator, ensures phone has 10 characters, and that they are all digits.
function phone_validator(phone) {
    if (phone.length != 10 || !/^\d+$/.test(phone)) {
        return false;
    }
    return true;
}

//Logs errors to the console, datadog, and displasy the error on the screen
function log_error(error = "An error has occurred", firstName = "", lastName = "", email = "", phone = "") {
    console.log(`Error message: ${error}, firstName: ${firstName}, lastName: ${lastName}, email: ${email}, phone: ${phone}`)
    try {
        window.DD_LOGS.logger.info('FURTHER test, an error has occured', {
            error_message: error,
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone
        });
    } catch (error) {
        console.log("DataDog logging has failed")
    }
	display_error(error)
}

//After all client-side validation, the function that sends the API request to further
async function submit(firstName, lastName, email, phone, api_key) {
    try {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Api-Key ${api_key}`);

        const formdata = new FormData();
        formdata.append("community_id", "142430");
        formdata.append("first_name", firstName);
        formdata.append("last_name", lastName);
        formdata.append("email", email);
        formdata.append("phone", phone);

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: formdata,
            redirect: "follow"
        };

        const response = await fetch("https://api.talkfurther.com/api/chat/leads/ingestion/zapier-webhook", requestOptions)

        const result = await response.json()
        debugger;
        if (response.ok) {
            submit_successful()
        } else {
            log_error(result.detail, firstName, lastName, email, phone)
        }
    } catch (error) {
        console.error(error)
    }
}

//Called if the submission is successful
function submit_successful() {
   document.querySelector("#result_space").innerHTML = "Submission Successful!"
   document.querySelector("#result_space").style.color="green"
}

//Called if there are any failures and displays the errors
function display_error(error)
{
	document.querySelector("#result_space").innerHTML = `Submission Failed, please fix the errors below: <br><br>${error}`
	document.querySelector("#result_space").style.color="red"
}