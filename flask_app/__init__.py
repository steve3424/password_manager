'''
Contains global setup for app
'''

from flask_app.config.env import secret_key
from flask_bcrypt import Bcrypt
from flask import Flask

# App setup
app = Flask(__name__)
app.secret_key = secret_key

# Bcrypt setup
cryptor = Bcrypt(app)