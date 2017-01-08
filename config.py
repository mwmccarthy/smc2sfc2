import os
if os.environ['ENV'] == 'development':
    TYPESCRIPT_BIN = 'node_modules/.bin/'