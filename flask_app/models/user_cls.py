import re
from flask_app.config.mysqlconnection import connectToMySQL
from flask_app import cryptor
from flask import flash

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

        # TODO: Enforce 254 chars for email

        email = form["email"]
        if len(email) > 254:
            flash("* Email should be <= 254 characters *", "flash_email_too_long")
            is_valid = False
        elif not cls.email_regex.match(email):
            flash("* Invalid email address *", "flash_email_invalid")
            is_valid = False
        elif cls.EmailAlreadyRegistered(form):
            flash("* Email address already registered *", "flash_email_exists")
            is_valid = False

        return is_valid

    @classmethod
    def Login(cls, form):
        query = ("SELECT * FROM users "
                 "WHERE email=%(email)s;")
        user_rows = connectToMySQL(db).query_db(query, form)

        if len(user_rows) == 0:
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
        # TODO: should check for database issue and return error
        #       messages
        query = ("INSERT INTO users (email, auth_code) "
                 "VALUES (%(email)s, %(auth_code)s);")
        data["auth_code"] = cryptor.generate_password_hash(data["auth_code"])
        return connectToMySQL(db).query_db(query,data)

    @classmethod
    def EmailAlreadyRegistered(cls, form):
        query = ("SELECT * FROM users "
                 "WHERE email=%(email)s;")
        results = connectToMySQL(db).query_db(query,form)
        return len(results) > 0