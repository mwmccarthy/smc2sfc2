from flask_wtf import FlaskForm
from wtforms import FileField, SubmitField
from wtforms.validators import DataRequired

class ConvertForm(FlaskForm):
    file = FileField(id='file-field', \
        validators=[DataRequired("Please choose a ROM to convert.")])
    submit = SubmitField("Convert!", id='submit-button')