from flask import Flask, render_template
from flask_assets import Environment, Bundle

app = Flask(__name__)
assets = Environment(app)

#app.config['TYPESCRIPT_BIN'] = 'node_modules/typescript/bin/tsc'

#ts = Bundle('ts/app.ts', filters='typescript', output='gen/packed.js')
#assets.register('js_all', ts)

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.config['ASSETS_DEBUG'] = True
    app.run(debug=True)