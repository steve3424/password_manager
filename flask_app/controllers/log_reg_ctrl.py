from flask import request, redirect, session, flash
from flask_app import app
from flask_app.models.user_cls import User

# TODO: Implement refresh tokens ??https://www.rfc-editor.org/rfc/rfc6749#section-10.4 
#https://stackoverflow.com/questions/48235441/flask-use-session-value-can-be-copied-to-another-computer-and-used-is-this-ok 

@app.route("/register", methods=["POST"])
def Register():
    if not User.ValidateRegistrationForm(request.form):
        return redirect("/")
    else:
        # Request.form is immutable so stick it into data dict so
        # the auth code can be hashed before storage.
        data = {
            "email" : request.form["email"],
            "auth_code" : request.form["auth_code"]
        }

        user_id = User.Add(data)
        if user_id == False:
            flash("**", "register_active")
            flash("* There was a problem with the server *", "flash_db_error")
            return redirect("/")
        else:
            session["user_id"] = user_id
            session["user_email"] = request.form["email"]
            return redirect(f"/vault")

@app.route("/login", methods=["POST"])
def Login():
    user_id = User.Login(request.form)
    if user_id < 0:
        return redirect("/")
    else:
        session["user_id"] = user_id
        session["user_email"] = request.form["email"]
        return redirect(f"/vault")