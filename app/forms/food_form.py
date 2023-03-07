from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField
from wtforms.validators import DataRequired, ValidationError


def number_followed_by_string(form, field):
    serving_size = field.data
    first_char_number = True
    non_number_exists = True
    print(serving_size)

    # Check that the first character is a number
    if not serving_size[0].isnumeric():
        first_char_number = False

    # Check that an alpha exists in the string
    for char in range(len(serving_size)):
        if char.isnumeric():
            non_number_exists = False
        else:
            non_number_exists = True
            break

    if not first_char_number or not non_number_exists:
        raise ValidationError('Please provide serving size in the proper format. Ex: 3 cups')


class FoodForm(FlaskForm):
    brand_name = StringField('brand_name')
    food_description = StringField('food_description', validators=[DataRequired("Food description required.")])
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
