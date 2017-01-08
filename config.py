from os import environ

DEBUG = environ['DEBUG']

if DEBUG:
    TYPESCRIPT_BIN = 'node_modules/.bin/tsc'
