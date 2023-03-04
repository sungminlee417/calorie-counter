const CreateFoodNutritionFacts = ({
  calories,
  setCalories,
  totalFat,
  setTotalFat,
  saturatedFat,
  setSaturatedFat,
  polysaturatedFat,
  setPolysaturatedFat,
  monounsaturatedFat,
  setMonounsaturatedFat,
  transFat,
  setTransFat,
  cholesterol,
  setCholesterol,
  sodium,
  setSodium,
  potassium,
  setPotassium,
  totalCarbohydrates,
  setTotalCarbohydrates,
  dietaryFiber,
  setDietaryFiber,
  sugars,
  setSugars,
  addedSugars,
  setAddedSugars,
  sugarAlcohols,
  setSugarAlcohols,
  protein,
  setProtein,
  vitaminA,
  setVitaminA,
  vitaminC,
  setVitaminC,
  calcium,
  setCalcium,
  iron,
  setIron,
  vitaminD,
  setVitaminD,
}) => {
  const onChangeCalories = (caloriesInput) => {
    setCalories(caloriesInput);
  };

  const onChangeTotalFat = (totalFatInput) => {
    setTotalFat(totalFatInput);
  };

  const onChangeSaturatedFat = (saturatedFatInput) => {
    setSaturatedFat(saturatedFatInput);
  };

  return (
    <div className="flex flex-col gap-4 p-3">
      <div className="flex gap-4 justify-between items-center">
        <label className="basis-5/12" htmlFor="calories">
          Calories
        </label>
        <input
          id="calories"
          placeholder="Required"
          className="text-right grow p-1"
          value={calories}
          onChange={(e) => onChangeCalories(e.target.value)}
        />
      </div>
      <div className="flex gap-4 justify-between items-center">
        <label className="basis-5/12" htmlFor="total-fat">
          Total Fat (g)
        </label>
        <input
          id="total-fat"
          placeholder="Optional"
          className="text-right grow p-1"
          value={totalFat}
          onChange={(e) => onChangeTotalFat(e.target.value)}
        />
      </div>
      <div className="flex gap-4 justify-between items-center">
        <label className="basis-5/12" htmlFor="saturated-fat">
          Saturated Fat (g)
        </label>
        <input
          id="saturated-fat"
          placeholder="Optional"
          className="text-right grow p-1"
          value={saturatedFat}
          onChange={(e) => onChangeSaturatedFat(e.target.value)}
        />
      </div>{" "}
      <div className="flex gap-4 justify-between items-center">
        <label className="basis-5/12" htmlFor="total-fat">
          Total Fat (g)
        </label>
        <input
          id="total-fat"
          placeholder="Optional"
          className="text-right grow p-1"
          value={totalFat}
          onChange={(e) => onChangeTotalFat(e.target.value)}
        />
      </div>{" "}
      <div className="flex gap-4 justify-between items-center">
        <label className="basis-5/12" htmlFor="total-fat">
          Total Fat (g)
        </label>
        <input
          id="total-fat"
          placeholder="Optional"
          className="text-right grow p-1"
          value={totalFat}
          onChange={(e) => onChangeTotalFat(e.target.value)}
        />
      </div>{" "}
      <div className="flex gap-4 justify-between items-center">
        <label className="basis-5/12" htmlFor="total-fat">
          Total Fat (g)
        </label>
        <input
          id="total-fat"
          placeholder="Optional"
          className="text-right grow p-1"
          value={totalFat}
          onChange={(e) => onChangeTotalFat(e.target.value)}
        />
      </div>{" "}
      <div className="flex gap-4 justify-between items-center">
        <label className="basis-5/12" htmlFor="total-fat">
          Total Fat (g)
        </label>
        <input
          id="total-fat"
          placeholder="Optional"
          className="text-right grow p-1"
          value={totalFat}
          onChange={(e) => onChangeTotalFat(e.target.value)}
        />
      </div>{" "}
      <div className="flex gap-4 justify-between items-center">
        <label className="basis-5/12" htmlFor="total-fat">
          Total Fat (g)
        </label>
        <input
          id="total-fat"
          placeholder="Optional"
          className="text-right grow p-1"
          value={totalFat}
          onChange={(e) => onChangeTotalFat(e.target.value)}
        />
      </div>
    </div>
  );
};

export default CreateFoodNutritionFacts;
