from .db import db
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin


class Food(db.Model, UserMixin):
    __tablename__ = 'foods'

    id = db.Column(db.Integer, primary_key=True)
    brand_name = db.Column(db.String(255), nullable=True)
    food_desc = db.Column(db.String(255), nullable=False)
    serving_size = db.Column(db.Integer, nullable=False)
    calories = db.Column(db.Integer, nullable=False)
    total_fat = db.Column(db.Integer, nullable=True)
    saturated_fat = db.Column(db.Integer, nullable=True)
    polysaturated_fat = db.Column(db.Integer, nullable=True)
    monounsaturated_fat = db.Column(db.Integer, nullable=True)
    trans_fat = db.Column(db.Integer, nullable=True)
    cholesterol = db.Column(db.Integer, nullable=True)
    sodium = db.Column(db.Integer, nullable=True)
    potassium = db.Column(db.Integer, nullable=True)
    total_carbohydrates = db.Column(db.Integer, nullable=True)
    dietary_fiber = db.Column(db.Integer, nullable=True)
    sugars = db.Column(db.Integer, nullable=True)
    added_sugars = db.Column(db.Integer, nullable=True)
    sugar_alcohols = db.Column(db.Integer, nullable=True)
    protein = db.Column(db.Integer, nullable=True)
    vitamin_a = db.Column(db.Integer, nullable=True)
    vitamin_c = db.Column(db.Integer, nullable=True)
    calcium = db.Column(db.Integer, nullable=True)
    iron = db.Column(db.Integer, nullable=True)
    vitamin_d = db.Column(db.Integer, nullable=True)
    
    
    def to_dict(self):
        return {
            'id': self.id,
            'brandName': self.brand_name,
            'foodDesc': self.food_desc,
            'servingSize': self.serving_size,
            'calories': self.calories,
            'totalFat': self.total_fat,
            'saturatedFat': self.saturated_fat,
            'polysaturatedFat': self.polysaturated_fat,
            'monounsaturatedFat': self.monounsaturated_fat,
            'transFat': self.trans_fat,
            'cholesterol': self.cholesterol,
            'sodium':self.sodium,
            'potassium': self.potassium,
            'totalCarbohydrates': self.total_carbohydrates,
            'dietaryFiber': self.dietary_fiber,
            'sugars': self.sugars,
            'addedSugars': self.added_sugars,
            'sugarAlcohols': self.sugar_alcohols,
            'protein': self.protein,
            'vitaminA': self.vitamin_a,
            'vitaminC': self.vitamin_c,
            'calcium': self.calcium,
            'iron': self.iron,
            'vitaminD': self.vitamin_d
        }
