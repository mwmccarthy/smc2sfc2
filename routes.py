from flask import Flask, render_template, request
from flask_assets import Environment, Bundle
from forms import ConvertForm

app = Flask(__name__)
app.config.from_object('config')

assets = Environment(app)

@app.route('/', methods=['GET', 'POST'])
def index():
    form = ConvertForm()
    return render_template('index.html', form=form)