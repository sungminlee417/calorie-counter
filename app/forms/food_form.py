from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField
from wtforms.validators import DataRequired, ValidationError


def number_followed_by_string(form, field):
    serving_size = field.data
    first_char_number = True
    alpha_exists = True

    # Check that the first character is a number
    if not serving_size[0].isnumeric():
        valid = False

    # Check that an alpha exists in the string
    for char in range(len(serving_size)):
        if not char.isalpha():
            valid = False
        else:
            valid = True
            break

    if not first_char_number or not alpha_exists:
        raise ValidationError('Please provide serving size in the proper format. Ex: 3 cups')


class FoodForm(FlaskForm):
    brand_name = StringField('brand_name')
    food_desc = StringField('food_desc', validators=[DataRequired("Food description required.")])
    serving_size = StringField('serving_size', validators=[DataRequired("Serving size required."), number_followed_by_string])
    calories = IntegerField('calories', validators=[DataRequired("Calories required.")])
    total_fat = IntegerField('total_fat')
    saturated_fat = IntegerField('saturated_fat')
    polysaturated_fat = IntegerField('polysaturated_fat')
    monounsaturated_fat = IntegerField('monounsaturated_fat')
    trans_fat = IntegerField('trans_fat')
    cholesterol = IntegerField('cholesterol')
    sodium = IntegerField('sodium')
    potassium = IntegerField('potassium')
    total_carbohydrates = IntegerField('total_carbohydrates')
    dietary_fiber = IntegerField('dietary_fiber')
    sugars = IntegerField('sugars')
    added_sugars = IntegerField('added_sugars')
    sugar_alcohols = IntegerField('sugar_alcohols')
    protein = IntegerField('protein')
    vitamin_a = IntegerField('vitamin_a')
    vitamin_c = IntegerField('vitamin_c')
    calcium = IntegerField('calcium')
    iron = IntegerField('iron')
    vitamin_d = IntegerField('vitamin_d')
