import os
DEBUG = os.environ['DEBUG']
if DEBUG:
    TYPESCRIPT_BIN = 'node_modules/.bin/tsc'