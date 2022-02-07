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