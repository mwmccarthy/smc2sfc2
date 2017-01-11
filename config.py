from os import environ
from sys import modules

attrs = ['DEBUG', 'SECRET_KEY', 'TYPESCRIPT_BIN']

for attr in attrs:
    setattr(modules[__name__], attr, environ[attr])

TYPESCRIPT_CONFIG = "--removeComments true --target ES6"
