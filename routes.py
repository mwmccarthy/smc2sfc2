from flask import Flask, render_template
from flask_assets import Environment, Bundle

app = Flask(__name__)
app.config.from_object('config')

assets = Environment(app)

ts = Bundle('ts/app.ts', filters='typescript', output='gen/packed.js')
assets.register('js_all', ts)

@app.route('/')
def index():
    return render_template('index.html')