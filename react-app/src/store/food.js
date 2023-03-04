// constants
const LOAD_FOODS = "foods/LOAD_FOODS";
const CREATE_FOOD = "foods/CREATE_FOOD";

const loadFoods = (foods) => ({
  type: LOAD_FOODS,
  foods,
});

const createFood = (food) => ({
  type: CREATE_FOOD,
  food,
});

export const loadFoodsThunk = () => async (dispatch) => {
  const response = await fetch("/api/foods");

  if (response.ok) {
    const foods = await response.json();
    dispatch(loadFoods(foods));
  }
};

export const createFoodThunk = (payload) => async (dispatch) => {
  const response = await fetch("/api/foods", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (response.ok) {
    const food = await response.json();
    dispatch(createFood(food));
  }
};

const initialState = {};

export default function reducer(state = initialState, action) {
  const newState = { ...initialState };
  switch (action.type) {
    case LOAD_FOODS:
      return action.foods;
    case CREATE_FOOD:
      newState.action.food.id = action.food;
      return newState;
    default:
      return state;
  }
}
