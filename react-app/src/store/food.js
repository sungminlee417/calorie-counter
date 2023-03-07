// constants
const LOAD_FOODS = "foods/LOAD_FOODS";
const ADD_FOOD = "foods/ADD_FOOD";

const loadFoods = (foods) => ({
  type: LOAD_FOODS,
  foods,
});

const addFood = (food) => ({
  type: ADD_FOOD,
  food,
});

export const loadFoodsThunk = () => async (dispatch) => {
  const response = await fetch("/api/foods/");

  if (response.ok) {
    const foods = await response.json();
    dispatch(loadFoods(foods));
  }
};

export const createFoodThunk = (payload) => async (dispatch) => {
  const response = await fetch("/api/foods/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (response.ok) {
    const food = await response.json();
    dispatch(addFood(food));
  }
};

const initialState = {};

export default function reducer(state = initialState, action) {
  const newState = { ...state };
  switch (action.type) {
    case LOAD_FOODS:
      return action.foods;
    case ADD_FOOD:
      console.log(newState);
      newState[action.food.id] = action.food;
      return newState;
    default:
      return state;
  }
}
