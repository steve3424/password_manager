import json
from flask import session, redirect, render_template
from flask_app import app
from flask_app.config.mysqlconnection import connectToMySQL

@app.route("/vault")
def UserVault():
    if "user_id" in session:
        return render_template("vault.html")
    else:
        return redirect("/")

@app.route("/logout")
def UserLogout():
    session.clear()
    return redirect("/")