from flask import Flask, render_template, request
from flask_assets import Environment, Bundle
from forms import ConvertForm

app = Flask(__name__)
app.config.from_object('config')

ts = Bundle('ts/app.ts', filters='typescript', output='gen/packed.js')
Environment(app).register('js_all', ts)

@app.route('/', methods=['GET', 'POST'])
def index():
    form = ConvertForm()
    return render_template('index.html', form=form)