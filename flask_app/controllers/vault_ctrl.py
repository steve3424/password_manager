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

@app.route("/test")
def Test():
    if "user_id" in session:
        # query = "SELECT * FROM vault WHERE user_id=%(user_id)s;"
        # data = {
        #     "user_id" : session["user_id"]
        # }
        # results = connectToMySQL("password_manager_db").query_db(query,data)

        return json.dumps([{"one" : "one"}, {"two" : "two"}])