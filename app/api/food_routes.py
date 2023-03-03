from flask import Blueprint, jsonify, request
from flask_login import login_required
from app.models import Food, db
from app.forms import FoodForm


food_routes = Blueprint('foods', __name__)


@food_routes.route('/', methods=['GET', 'POST'])
@login_required
def foods():
    form = FoodForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        food = Food(
            brand_name=form.data['brand_name'],
            food_desc=form.data['food_desc'],
            serving_size=form.data['serving_size'],
            calories=form.data['calories'],
            total_fat=form.data['total_fat'],
            saturated_fat=form.data['saturated_fat'],
            polysaturated_fat=form.data['polysaturated_fat'],
            monounsaturated_fat=form.data['monounsaturated_fat'],
            trans_fat=form.data['trans_fat'],
            cholesterol=form.data['cholesterol'],
            sodium=form.data['sodium'],
            potassium=form.data['potassium'],
            total_carbohydrates=form.data['total_carbohydrates'],
            dietary_fiber=form.data['dietary_fiber'],
            sugars=form.data['sugars'],
            added_sugars=form.data['added_sugars'],
            sugar_alcohols=form.data['sugar_alcohols'],
            protein=form.data['protein'],
            vitamin_a=form.data['vitamin_a'],
            vitamin_c=form.data['vitamin_c'],
            calcium=form.data['calcium'],
            iron=form.data['iron'],
            vitamin_d=form.data['vitamin_d']
        )

        db.session.add(food)
        db.session.commit()
        return food.to_dict()

    foods = Food.query.all()
    return {food.id: food.to_dict() for food in foods}
