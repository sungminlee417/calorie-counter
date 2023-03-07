from flask import Blueprint, request
from flask_login import login_required, current_user
from app.models import Food, db
from app.forms import FoodForm


food_routes = Blueprint('foods', __name__)


def food_owned_by_user(food):
    if food.user_id == current_user.id:
        return True
    return False


def format_serving_size(serving_size):
    amount = ""
    unit = ""

    for i in range(len(serving_size)):
        char = serving_size[i]
        # If a character exists in unit, only add to unit from then on
        if unit:
            unit += char
            continue

        # Only in the beginning if the character is numeric, add it onto the amount
        if char.isnumeric():
            amount += char
        # The first character that is not numeric will be added onto unit
        else:
            unit += char

    return amount + " " + unit


@food_routes.route('/', methods=['GET', 'POST'])
@login_required
def get_post_foods():
    form = FoodForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        serving_size = form.data['serving_size']
        food = Food(
            brand_name=form.data['brand_name'],
            description=form.data['description'],
            serving_size=format_serving_size(serving_size),
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


@food_routes.route('/<int:food_id>', methods=['PUT', 'DELETE'])
@login_required
def edit_delete_food(food_id):
    food = Food.query.get(food_id)
    if request.method == "PUT":
        if food_owned_by_user(food):
            form = FoodForm()
            form['csrf_token'].data = request.cookies['csrf_token']
            if form.validate_on_submit():
                food.brand_name = form.data['brand_name'],
                food.description = form.data['description'],
                food.serving_size = format_serving_size(form.data['serving_size']),
                food.calories = form.data['calories'],
                food.total_fat = form.data['total_fat'],
                food.saturated_fat = form.data['saturated_fat'],
                food.polysaturated_fat = form.data['polysaturated_fat'],
                food.monounsaturated_fat = form.data['monounsaturated_fat'],
                food.trans_fat = form.data['trans_fat'],
                food.cholesterol = form.data['cholesterol'],
                food.sodium = form.data['sodium'],
                food.potassium = form.data['potassium'],
                food.total_carbohydrates = form.data['total_carbohydrates'],
                food.dietary_fiber = form.data['dietary_fiber'],
                food.sugars = form.data['sugars'],
                food.added_sugars = form.data['added_sugars'],
                food.sugar_alcohols = form.data['sugar_alcohols'],
                food.protein = form.data['protein'],
                food.vitamin_a = form.data['vitamin_a'],
                food.vitamin_c = form.data['vitamin_c'],
                food.calcium = form.data['calcium'],
                food.iron = form.data['iron'],
                food.vitamin_d = form.data['vitamin_d']
                db.session.commit()
                return food.to_dict()
        else:
            return {"error": "Unauthorized user"}
    elif request.method == "DELETE":
        if food_owned_by_user(food):
            db.session.delete(food)
            db.session.commit()
            return {"message": "Food was successfully deleted"}
        else:
            return {"error": "Unauthorized"}
