// TODO: need a way to approximate height to make 
//       transition smooth both ways
function Slide(element) {
    var form = element.nextElementSibling;
    if(form.offsetHeight > 0) {
        form.style.maxHeight = "0px";
    }
    else {
        form.style.maxHeight = "500px";
    }
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

async function SavePassword() {
    var new_entry_form = document.forms["new_entry_form"];
    // TODO: validate form

    var iv = window.crypto.getRandomValues(new Uint8Array(16));
    var iv_hex = BytesToHexString(iv);
    // var new_entry = {
    //     name:     new_entry_form["name"].value,
    //     login:    new_entry_form["login"].value,
    //     password: new_entry_form["password"].value,
    //     website:  new_entry_form["website"].value
    // };
    // var encoder = new TextEncoder();
    // var new_entry_bytes = encoder.encode(JSON.stringify(new_entry));
    // var encryption_key = await GetKeyFromSession();
    // console.log(encryption_key);
}