async function CreateKeyObject(key_bytes) {
    return crypto.subtle.importKey(
      "raw",                       // raw is just byte array
	  key_bytes,
      "PBKDF2",                    // algorithm this key object will be used for
      false,                       // Don't allow plaintext password to be exported from this CryptoKey object
      ["deriveKey"]  			   // this key will only be used to generate the authentication code
    );
}

async function GenerateKey(key_bytes, salt_bytes, iterations) {
	var password_key = await CreateKeyObject(key_bytes);
	return crypto.subtle.deriveKey(
		{
			"name" : "PBKDF2",
			salt : salt_bytes,
			"iterations" : iterations,
			"hash" : "SHA-256"
		},
		password_key,
		{ 
			"name" : "AES-GCM",
			"length" : 256
	 	},
		true,
		["encrypt", "decrypt"]
	);
}

// Generates both keys and stores them in local storage for later use
async function GenerateEncryptionKeyAndAuthCode(form) {
   	var encoder = new TextEncoder();
	var	email_bytes = encoder.encode(form["email"].value);
	var	password_bytes = encoder.encode(form["password"].value);
	var encryption_key = await GenerateKey(password_bytes, email_bytes, 100100);
	// STORE AES KEY FOR LATER USE WITH VAULT
	var jwk_string = JSON.stringify(await crypto.subtle.exportKey('jwk', encryption_key));
	window.sessionStorage.setItem("AES_KEY", jwk_string);

	var encryption_key_bytes = await crypto.subtle.exportKey("raw", encryption_key);
	var auth_code = await GenerateKey(encryption_key_bytes, password_bytes, 1);
	var auth_code_bytes = await crypto.subtle.exportKey("raw", auth_code);
	return auth_hex_string = BytesToHexString(new Uint8Array(auth_code_bytes));
}

function LoginTabActivate(clicked_tab) {
    var active_tab = document.querySelector(".login__tab--active");
    active_tab.classList.remove("login__tab--active");
    clicked_tab.classList.add("login__tab--active");
  
    if(clicked_tab.id === "login_tab") {
        document.querySelector("#login_form").style.display = "block";
        document.querySelector("#register_form").style.display = "none";
    }
    else {
        document.querySelector("#login_form").style.display = "none";
        document.querySelector("#register_form").style.display = "block";
    }
}

async function ValidateRegistrationForm() {
	var register_form = document.forms["register_form"];
	var is_valid = true;

	// Get rid of all error messages to start, 
	// the checks below will re-display if necessary
	var email_error = document.querySelector("#reg_email_error");
	var email_length_error = document.querySelector("#reg_email_length_error");
	var password_length_error = document.querySelector("#reg_password_length_error");
	var password_match_error = document.querySelector("#reg_password_match_error");
	email_error.style.display = "none";
	email_length_error.display = "none";
	password_length_error.style.display = "none";
	password_match_error.style.display = "none";

	var email = register_form["email"].value;
	if(email.length > 254) {
		email_length_error.style.display = "block";
		is_valid = false;
	}
	else if (!/^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]+$/.test(email)) {
		email_error.style.display = "block";
		is_valid = false;
	}
	
	var password = register_form["password"].value;
	if (password.length < 8 || 32 <= password.length) {
		password_length_error.style.display = "block";
		is_valid = false;
	}
	
	var confirm_password = register_form["confirm_password"].value;
	if (password !== confirm_password) {
		password_match_error.style.display = "block";
		is_valid = false;
	}
	
	if(is_valid) {
		// Clear password fields and stick auth code in as hex string
		document.querySelector("#auth_code_registration").value = await GenerateEncryptionKeyAndAuthCode(register_form);
		register_form["password"].value = "";
		register_form["confirm_password"].value = "";
		register_form.submit();
	}
}

async function ValidateLoginForm() {
	var login_form = document.forms["login_form"];
	var is_valid = true;
	
	// Get rid of all error messages to start, 
	// the checks below will re-display if necessary
	var email_length_error = document.querySelector("#email_length_error");
	var password_length_error = document.querySelector("#login_password_length_error");
	email_length_error.style.display = "none";
	password_length_error.style.display = "none";
	
	var email = login_form["email"].value;
	if (email.length === 0) {
		email_length_error.style.display = "block";
		is_valid = false;
	}

	var password = login_form["password"].value;
	if (password.length === 0) {
		password_length_error.style.display = "block";
		is_valid = false;
	}
	
	if(is_valid) {
		// Clear password fields and stick auth code in as hex string
		document.querySelector("#auth_code_login").value = await GenerateEncryptionKeyAndAuthCode(login_form)
		login_form["password"].value = "";

		login_form.submit();
	}
}