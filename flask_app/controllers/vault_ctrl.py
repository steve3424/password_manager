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

@app.route("/vault/delete_entry/<int:entry_id>")
def VaultDeleteEntry(entry_id):
    print(entry_id)
    return redirect("/vault")

@app.route("/get_user_vault")
def GetUserVault():
    if "user_id" in session:
        data = {
            "user_id" : session["user_id"]
        }
        vault_entries = VaultEntry.GetUserVault(data)
        return {"vault" : vault_entries}, 200
    else:
        return {"error" : "no session found"}, 401

@app.route("/logout")
def UserLogout():
    session.clear()
    return redirect("/")