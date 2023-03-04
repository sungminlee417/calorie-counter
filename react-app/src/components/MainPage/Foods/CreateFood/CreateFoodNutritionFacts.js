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
          onChange={(e) => setCalories(e.target.value)}
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
          onChange={(e) => setTotalFat(e.target.value)}
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
          onChange={(e) => setSaturatedFat(e.target.value)}
        />
      </div>{" "}
      <div className="flex gap-4 justify-between items-center">
        <label className="basis-5/12" htmlFor="polysaturated-fat">
          Polysaturated Fat (g)
        </label>
        <input
          id="polysaturated-fat"
          placeholder="Optional"
          className="text-right grow p-1"
          value={polysaturatedFat}
          onChange={(e) => setPolysaturatedFat(e.target.value)}
        />
      </div>{" "}
      <div className="flex gap-4 justify-between items-center">
        <label className="basis-5/12" htmlFor="monounsaturated-fat">
          Monounsaturated Fat (g)
        </label>
        <input
          id="monounsaturated-fat"
          placeholder="Optional"
          className="text-right grow p-1"
          value={monounsaturatedFat}
          onChange={(e) => setMonounsaturatedFat(e.target.value)}
        />
      </div>{" "}
      <div className="flex gap-4 justify-between items-center">
        <label className="basis-5/12" htmlFor="trans-fat">
          Trans Fat (g)
        </label>
        <input
          id="trans-fat"
          placeholder="Optional"
          className="text-right grow p-1"
          value={transFat}
          onChange={(e) => setTransFat(e.target.value)}
        />
      </div>{" "}
      <div className="flex gap-4 justify-between items-center">
        <label className="basis-5/12" htmlFor="cholesterol-fat">
          Cholesterol (g)
        </label>
        <input
          id="cholesterol-fat"
          placeholder="Optional"
          className="text-right grow p-1"
          value={cholesterol}
          onChange={(e) => setCholesterol(e.target.value)}
        />
      </div>{" "}
      <div className="flex gap-4 justify-between items-center">
        <label className="basis-5/12" htmlFor="sodium">
          Sodium (g)
        </label>
        <input
          id="sodium"
          placeholder="Optional"
          className="text-right grow p-1"
          value={sodium}
          onChange={(e) => setSodium(e.target.value)}
        />
      </div>
    </div>
  );
};

export default CreateFoodNutritionFacts;
