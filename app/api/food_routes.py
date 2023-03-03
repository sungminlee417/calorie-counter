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
            calories=form.data['calories']

        )
        db.session.add(food)
        db.session.commit()
        return food.to_dict()
    
    foods = Food.query.all()
    
    
    return {food.id: food.to_dict() for food in foods}


@food_routes.route('/<int:id>')
@login_required
def user(id):
    user = User.query.get(id)
    return user.to_dict()
