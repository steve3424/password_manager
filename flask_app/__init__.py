'''
Contains global setup for app
'''

from flask_bcrypt import Bcrypt
from flask import Flask

# App setup
app = Flask(__name__)
app.secret_key = "-JaNcRfUjXn2r5u8x/A?D(G+KbPeSgVk"

# Bcrypt setup
cryptor = Bcrypt(app)