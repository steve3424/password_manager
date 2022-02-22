from flask_app.config.mysqlconnection import connectToMySQL
from flask_app.config.env import mysql_config

class VaultEntry():
    def __init__(self):
        pass

    @classmethod
    def Create(cls, data):
        query = ("INSERT INTO vault (entry,iv,user_id,created_at,updated_at) "
                 "VALUES (%(entry)s, %(iv)s, %(user_id)s, NOW(), NOW());")
        connectToMySQL(mysql_config["DB"]).query_db(query,data)

    @classmethod
    def Delete(cls, data):
        query = ("DELETE FROM vault "
                 "WHERE id=%(entry_id)s "
                 "AND user_id=%(user_id)s;")
        connectToMySQL(mysql_config["DB"]).query_db(query,data)

    @classmethod
    def GetUserVault(cls, data):
        query = ("SELECT id,entry,iv FROM vault "
                 "WHERE user_id=%(user_id)s;")
        results = connectToMySQL(mysql_config["DB"]).query_db(query, data)
        # TODO: check for any errors
        # NOTE: No need to create objects, I want these results
        #       as dictionaries anyway
        return results