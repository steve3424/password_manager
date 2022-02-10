import re
from flask import flash
from enum import Enum
from flask_app.config.mysqlconnection import connectToMySQL
from flask_app import cryptor

db = "password_manager_db"

class User:
    email_regex = re.compile(r'^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]+$')

    # TODO: Not sure if I really need an object, since the only
    #       user information is the email address. I can just
    #       pass the string around.
    def __init__(self) -> None:
        pass

    @classmethod
    def ValidateRegistrationForm(cls, form):
        is_valid = True

        email = form["email"]
        if len(email) > 254:
            flash("* Email should be <= 254 characters *", "flash_email_too_long")
            is_valid = False
        elif not cls.email_regex.match(email):
            flash("* Invalid email address *", "flash_email_invalid")
            is_valid = False
        else:
            user_registered = cls.EmailAlreadyRegistered(form)
            # DB ERROR
            if user_registered == -1:
                flash("* There was a problem with the server *", "flash_db_error")
                is_valid = False
            elif user_registered == True:
                flash("* Email address already registered *", "flash_email_exists")
                is_valid = False

        # NOTE: If any validations fail, this flash will tell the HTML page
        #       to make the registration tab active on the redirect since
        #       by default the login tab is active
        if not is_valid:
            flash("**", "register_active")

        return is_valid

    @classmethod
    def Login(cls, form):
        query = ("SELECT * FROM users "
                 "WHERE email=%(email)s;")
        user_rows = connectToMySQL(db).query_db(query, form)

        if user_rows == False:
            flash("* There was a problem with the server *", "flash_db_error")
            return -1
        elif len(user_rows) == 0:
            flash("* User was not found *", "flash_user_not_found")
            return -1
        elif not cryptor.check_password_hash(user_rows[0]["auth_code"], form["auth_code"]):
            flash("* Password incorrect *", "flash_password_incorrect")
            return -1
        else:
            return user_rows[0]["id"]

    @classmethod
    def Add(cls, data):
        """
        Returns the table ID of newly inserted user
        """
        query = ("INSERT INTO users (email, auth_code) "
                 "VALUES (%(email)s, %(auth_code)s);")
        data["auth_code"] = cryptor.generate_password_hash(data["auth_code"])
        return connectToMySQL(db).query_db(query,data)

    @classmethod
    def EmailAlreadyRegistered(cls, form):
        query = ("SELECT * FROM users "
                 "WHERE email=%(email)s;")
        results = connectToMySQL(db).query_db(query,form)

        # DB ERROR
        if results == False:
            return -1
        else:
            return len(results) > 0