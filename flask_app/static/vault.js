// TODO: need a way to approximate height to make 
//       transition smooth both ways
// TODO: Instead of changing styles individually
//       just add and remove class here
// TODO: Add shadow on bottom of title
// function Slide() {
//     var form = this.nextElementSibling;
//     if(form.offsetHeight > 0) {
//         form.style.maxHeight = "0px";
//     }
//     else {
//         form.style.maxHeight = "500px";
//     }
// }

// TESTING
function Slide(e) {
    var form = e.nextElementSibling;
    if(form.offsetHeight > 0) {
        form.style.maxHeight = "0px";
        form.style.padding = "0px";
    }
    else {
        form.style.maxHeight = "500px";
        form.style.padding = "15px";
    }
}

// Save prev values for discarding edits
var prev_values = {};

// Set up buttons to swap
var edit_discard_btns = document.createElement("a");
edit_discard_btns.setAttribute("id", "discard-btn");
edit_discard_btns.classList.add("button");
edit_discard_btns.innerHTML = "Discard";
edit_discard_btns.onclick = function() {
    // Restore all values
    var form_inputs = this.parentNode.querySelectorAll(".vault-entry__input");
    for(var i = 0; i < form_inputs.length; ++i) {
        form_inputs[i].disabled = true;
        form_inputs[i].style.border = "2px solid transparent";
        form_inputs[i].value = prev_values[form_inputs[i].id];
    }

    // Swap buttons
    var discard_btn = document.querySelector("#discard-btn");
    discard_btn.parentNode.replaceChild(edit_discard_btns, discard_btn);
    edit_discard_btns = discard_btn;
    var save_btn = document.querySelector("#save-btn");
    save_btn.parentNode.replaceChild(save_delete_btns, save_btn);
    save_delete_btns = save_btn;
};

var save_delete_btns = document.createElement("a");
save_delete_btns.setAttribute("id", "save-btn");
save_delete_btns.classList.add("button");
save_delete_btns.innerHTML = "Save";
save_delete_btns.onclick = function() {
    console.log(this.innerHTML);
};

function BeginEdit(el) {
    var form_inputs = el.parentNode.querySelectorAll(".vault-entry__input");
    for(var i = 0; i < form_inputs.length; ++i) {
        form_inputs[i].disabled = false;
        form_inputs[i].style.border = "2px solid black";
        // Need to cache the previous values in 
        // case user wants to discard changes
        prev_values[form_inputs[i].id] = form_inputs[i].value;
    }

    // Swap buttons
    var edit_btn = document.querySelector("#edit-btn");
    edit_btn.parentNode.replaceChild(edit_discard_btns, edit_btn);
    edit_discard_btns = edit_btn;
    var delete_btn = document.querySelector("#delete-btn");
    delete_btn.parentNode.replaceChild(save_delete_btns, delete_btn);
    save_delete_btns = delete_btn;
}

function EndEdit(el) {
    // Make editable inputs un-editable again
    var form_inputs = el.parentNode.querySelectorAll(".vault-entry__input");
    for(var i = 0; i < form_inputs.length; ++i) {
        // form_inputs[i].style.backgroundColor = "#009879";
        form_inputs[i].disabled = true;
        // Restore prev values from dictionary cache
        form_inputs[i].value = prev_values[form_inputs[i].id];
    }

    // Change discard back to edit
    var edit_btn = document.querySelector("#edit-btn");
    edit_btn.innerHTML = "Edit";
    edit_btn.onclick = BeginEdit;

    // // Swap save w/ delete btn
    // var save_btn = document.querySelector("#save-btn");
    // save_btn.parentNode.replaceChild(temp_btn, save_btn);
    // temp_btn = save_btn;
}

var add_section = document.querySelector(".new-entry");
var add_section_offset = add_section.offsetTop;
function Stick() {
    if(window.pageYOffset > add_section_offset) {
        add_section.classList.add("sticky")
        document.querySelector("#vault-entries").style.marginTop = add_section.offsetHeight + "px";
    }
    else {
        add_section.classList.remove("sticky")
        document.querySelector("#vault-entries").style.marginTop = "0px";
    }
}
window.onscroll = Stick;

var new_entry_form = document.querySelector(".new-entry__form");
var new_entry_toggle = document.querySelector(".new-entry__toggle");
function ToggleNewEntryForm() {
    // NOTE: There is a weird bug if I open or close the form
    //       then add the sticky class by scrolling
    //       then try and close the form, it won't close properly
    //       I have to re-add the sticky class by calling Stick() each time
    if(new_entry_form.offsetHeight > 0) {
        new_entry_form.classList.add("new-entry__form--hidden");
        new_entry_toggle.innerHTML = "Add Entry +";
        Stick();
    }
    else {
        new_entry_form.classList.remove("new-entry__form--hidden");
        new_entry_toggle.innerHTML = "Close entry -";
        Stick();
    }
}

// TODO: Do this once on load...
function GetKeyFromSession() {
    var encryption_key_jwk = JSON.parse(sessionStorage.getItem("AES_KEY"));
    return crypto.subtle.importKey(
        "jwk",
        encryption_key_jwk,
        "AES-GCM",
        true,
        ["encrypt", "decrypt"]
    );
}

function ValidateNewEntryForm() {
    var new_entry_form = document.forms["new_entry_form"];
    var is_valid = true;

	// Get rid of all error messages to start, 
	// the checks below will re-display if necessary
	var name_too_short_error = document.querySelector("#name_too_short_error");
	var name_too_long_error = document.querySelector("#name_too_long_error");
	var login_too_short_error = document.querySelector("#login_too_short_error");
	var login_too_long_error = document.querySelector("#login_too_long_error");
	var password_too_short_error = document.querySelector("#password_too_short_error");
	var password_too_long_error = document.querySelector("#password_too_long_error");
	var website_too_short_error = document.querySelector("#website_too_short_error");
	var website_too_long_error = document.querySelector("#website_too_long_error");
	name_too_short_error.style.display = "none";
	name_too_long_error.style.display = "none";
	login_too_short_error.style.display = "none";
	login_too_long_error.style.display = "none";
	password_too_short_error.style.display = "none";
	password_too_long_error.style.display = "none";
	website_too_short_error.style.display = "none";
	website_too_long_error.style.display = "none";

    var name = new_entry_form["name"].value;
    if(name.length === 0) {
        name_too_short_error.style.display = "block";
        is_valid = false;
    }
    else if(name.length > 64) {
        name_too_long_error.style.display = "block";
        is_valid = false;
    }

    var login = new_entry_form["login"].value;
    if(login.length === 0) {
        login_too_short_error.style.display = "block";
        is_valid = false;
    }
    else if(login.length > 64) {
        login_too_long_error.style.display = "block";
        is_valid = false;
    }

    var password = new_entry_form["password"].value;
    if(password.length === 0) {
        password_too_short_error.style.display = "block";
        is_valid = false;
    }
    else if(password.length > 64) {
        password_too_long_error.style.display = "block";
        is_valid = false;
    }

    var website = new_entry_form["website"].value;
    if(website.length === 0) {
        website_too_short_error.style.display = "block";
        is_valid = false;
    }
    else if(website.length > 64) {
        website_too_long_error.style.display = "block";
        is_valid = false;
    }

    return is_valid;
}

async function SavePassword() {
    var new_entry_form = document.forms["new_entry_form"];
    var is_valid = ValidateNewEntryForm();

    if(is_valid) {
        // Turn new entry form into Javascript object
        var new_entry = {
            name:     new_entry_form["name"].value,
            login:    new_entry_form["login"].value,
            password: new_entry_form["password"].value,
            website:  new_entry_form["website"].value
        };
        var encoder = new TextEncoder();
        // TODO: what is the max length here ??
        var new_entry_json_string = JSON.stringify(new_entry);
        var new_entry_bytes = encoder.encode(new_entry_json_string);
    
        var encryption_key = await GetKeyFromSession();
        var iv = window.crypto.getRandomValues(new Uint8Array(12));
        var new_entry_encrypted = await crypto.subtle.encrypt(
            {
                name: "AES-GCM",
                iv: iv 
            },
            encryption_key,
            new_entry_bytes
        );
        var new_entry_encrypted_bytes = new Uint8Array(new_entry_encrypted);

        // Clear form so no plaintext gets sent
        new_entry_form["name"].value = "";
        new_entry_form["login"].value = "";
        new_entry_form["password"].value = "";
        new_entry_form["website"].value = "";

        // Add encrypted entry and IV to form
        new_entry_form["encrypted_entry_hex"].value = BytesToHexString(new_entry_encrypted_bytes);
        new_entry_form["iv_hex"].value = BytesToHexString(iv);
    
        new_entry_form.submit();
    }
}

async function GetUsersVault() {
    // TODO: Get Key will eventually be done once on load
    var decryption_key = await GetKeyFromSession();

    var vault = await fetch(window.location.host + "/get_user_vault");
    var vault_json = await vault.json();

    var decoder = new TextDecoder();
    var entries = vault_json["vault"];
    var vault_entries_dom = document.querySelector("#vault-entries");
    // TODO: These should probably be put into an array
    //       so they can be manipulated in memory
    for(var i = 0; i < entries.length; ++i) {
        var entry_bytes = HexStringToBytes(entries[i]["entry"]);
        var iv_bytes    = HexStringToBytes(entries[i]["iv"]);
        var entry_decrypted = await crypto.subtle.decrypt(
            {
                name: "AES-GCM",
                iv: iv_bytes 
            },
            decryption_key,
            entry_bytes
        );
        var entry_json_string = decoder.decode(entry_decrypted);
        var entry_json = JSON.parse(entry_json_string);

        // Create vault-entry
        var vault_entry_div = document.createElement("div");
        vault_entry_div.classList.add("vault-entry");

        // Create vault-entry__title
        var vault_entry_title = document.createElement("h2");
        vault_entry_title.classList.add("vault-entry__title");
        vault_entry_title.innerHTML = entry_json["name"];
        vault_entry_title.addEventListener("click", Slide);
        vault_entry_div.appendChild(vault_entry_title);

        // Create vault-entry__form
        var vault_entry_form = document.createElement("form");
        vault_entry_form.classList.add("vault-entry__form");
        vault_entry_div.appendChild(vault_entry_form);

        var vault_entry_form_name = document.createElement("p");
        var vault_entry_form_login = document.createElement("p");
        var vault_entry_form_password = document.createElement("p");
        var vault_entry_form_website = document.createElement("p");
        vault_entry_form_name.innerHTML = entry_json["name"];
        vault_entry_form_login.innerHTML = entry_json["login"];
        vault_entry_form_password.innerHTML = entry_json["password"];
        vault_entry_form_website.innerHTML = entry_json["website"];
        vault_entry_form.appendChild(vault_entry_form_name);
        vault_entry_form.appendChild(vault_entry_form_login);
        vault_entry_form.appendChild(vault_entry_form_password);
        vault_entry_form.appendChild(vault_entry_form_website);

        vault_entries_dom.appendChild(vault_entry_div);
    }

    var spacer_div = document.createElement("div");
    spacer_div.setAttribute("id", "spacer");
    vault_entries_dom.appendChild(spacer_div);
}

GetUsersVault();