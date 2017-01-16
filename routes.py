from flask import Flask, render_template
import json

app = Flask(__name__)
app.config.from_object('config')

@app.route('/')
def index():
    with open('./webpack-assets.json') as webpack_assets:
        assets = json.load(webpack_assets)
    return render_template('index.html', assets=assets)