from flask import Flask, render_template
from flask_assets import Environment, Bundle

app = Flask(__name__, instance_relative_config=True)
app.config.from_object('config')
app.config.from_pyfile('config.py')

assets = Environment(app)

ts = Bundle('ts/app.ts', filters='typescript', output='gen/packed.js')
assets.register('js_all', ts)

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)