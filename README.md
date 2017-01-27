# smc2sfc2
SNES ROM converter

Runs on Python 2.7 and Node 7.3.0

A web app to batch convert SNES ROM formats from .smc to .sfc or vice versa.

### On Heroku

https://smc2sfc2.herokuapp.com/

### Install (dev)

```
pip install virtualenv
virtualenv venv
source venv/bin/activate
pip install -r requirements.txt
npm install -g webpack
npm install
```

### Run

```
gunicorn routes:app
```

### TODO
- [ ] Validate input files
- [ ] Support renaming files
- [ ] pull game info from thegamesdb.net
- [ ] accept ROMs inside zip archives
- [ ] serve back individually zipped ROMs