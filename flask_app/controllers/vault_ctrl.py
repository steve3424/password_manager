from flask import session, redirect, render_template, request
from flask_app import app
from flask_app.config.mysqlconnection import connectToMySQL
from flask_app.models.vault_entry import VaultEntry

@app.route("/vault")
def UserVault():
    if "user_id" in session:
        return render_template("vault.html")
    else:
        return redirect("/")

@app.route("/vault/add_entry", methods=["POST"])
def VaultAddEntry():
    if "user_id" in session:
        data = {
            "entry"   : request.form["encrypted_entry_hex"],
            "iv"      : request.form["iv_hex"],
            "user_id" : session["user_id"]
        }
        VaultEntry.Create(data)
        return redirect("/vault")
    else:
        return redirect("/")

@app.route("/logout")
def UserLogout():
    session.clear()
    return redirect("/")