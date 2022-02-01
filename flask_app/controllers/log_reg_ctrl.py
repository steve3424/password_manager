import imp
from flask import request, redirect, session
from flask_app import app
from flask_app.models.user_cls import User

# TODO: Implement refresh tokens ??https://www.rfc-editor.org/rfc/rfc6749#section-10.4 
#https://stackoverflow.com/questions/48235441/flask-use-session-value-can-be-copied-to-another-computer-and-used-is-this-ok 

@app.route("/user/register", methods=["POST"])
def UserRegister():
    if not User.ValidateRegistrationForm(request.form):
        return redirect("/")
    else:
        # Request.form is immutable so stick it into data dict so
        # the password can be hashed before storage.
        data = {
            "email" : request.form["email"],
            "auth_code" : request.form["auth_code"]
        }
        # TODO: make sure user was properly added
        user_id = User.Add(data)
        session["user_id"] = user_id
        session["user_email"] = request.form["email"]
        return redirect(f"/user/vault")

@app.route("/user/login", methods=["POST"])
def UserLogin():
    user_id = User.Login(request.form)
    if user_id < 0:
        return redirect("/")
    else:
        session["user_id"] = user_id
        session["user_email"] = request.form["email"]
        return redirect(f"/user/vault")