from os import environ
from sys import modules

attrs = ['DEBUG']

for attr in attrs:
    setattr(modules[__name__], attr, environ[attr])
