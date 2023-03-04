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
    <div className="grid grid-cols-2 gap-1 p-3">
      <div className="flex gap-1 justify-between items-center p-1">
        <label className="basis-5/12 text-sm" htmlFor="calories">
          Calories
        </label>
        <input
          id="calories"
          placeholder="Required"
          className="text-right w-full"
          value={calories}
          onChange={(e) => setCalories(e.target.value)}
        />
      </div>
      <div className="flex gap-4 justify-between items-center">
        <label className="basis-5/12 text-sm" htmlFor="total-fat">
          Total Fat (g)
        </label>
        <input
          id="total-fat"
          placeholder="Optional"
          className="text-right grow"
          value={totalFat}
          onChange={(e) => setTotalFat(e.target.value)}
        />
      </div>
      <div className="flex gap-4 justify-between items-center">
        <label className="basis-5/12 text-sm" htmlFor="saturated-fat">
          Saturated Fat (g)
        </label>
        <input
          id="saturated-fat"
          placeholder="Optional"
          className="text-right grow"
          value={saturatedFat}
          onChange={(e) => setSaturatedFat(e.target.value)}
        />
      </div>
      <div className="flex gap-4 justify-between items-center">
        <label className="basis-5/12 text-sm" htmlFor="polysaturated-fat">
          Polysaturated Fat (g)
        </label>
        <input
          id="polysaturated-fat"
          placeholder="Optional"
          className="text-right grow"
          value={polysaturatedFat}
          onChange={(e) => setPolysaturatedFat(e.target.value)}
        />
      </div>
      <div className="flex gap-4 justify-between items-center">
        <label className="basis-5/12 text-sm" htmlFor="monounsaturated-fat">
          Monounsaturated Fat (g)
        </label>
        <input
          id="monounsaturated-fat"
          placeholder="Optional"
          className="text-right grow"
          value={monounsaturatedFat}
          onChange={(e) => setMonounsaturatedFat(e.target.value)}
        />
      </div>
      <div className="flex gap-4 justify-between items-center">
        <label className="basis-5/12 text-sm" htmlFor="trans-fat">
          Trans Fat (g)
        </label>
        <input
          id="trans-fat"
          placeholder="Optional"
          className="text-right grow"
          value={transFat}
          onChange={(e) => setTransFat(e.target.value)}
        />
      </div>
      <div className="flex gap-4 justify-between items-center">
        <label className="basis-5/12 text-sm" htmlFor="cholesterol-fat">
          Cholesterol (mg)
        </label>
        <input
          id="cholesterol-fat"
          placeholder="Optional"
          className="text-right grow"
          value={cholesterol}
          onChange={(e) => setCholesterol(e.target.value)}
        />
      </div>
      <div className="flex gap-4 justify-between items-center">
        <label className="basis-5/12 text-sm" htmlFor="sodium">
          Sodium (mg)
        </label>
        <input
          id="sodium"
          placeholder="Optional"
          className="text-right grow"
          value={sodium}
          onChange={(e) => setSodium(e.target.value)}
        />
      </div>
      <div className="flex gap-4 justify-between items-center">
        <label className="basis-5/12 text-sm" htmlFor="potassium">
          Potassium (mg)
        </label>
        <input
          id="potassium"
          placeholder="Optional"
          className="text-right grow"
          value={potassium}
          onChange={(e) => setPotassium(e.target.value)}
        />
      </div>
      <div className="flex gap-4 justify-between items-center">
        <label className="basis-5/12 text-sm" htmlFor="total-carbohydrates">
          Total Carbohydrates (g)
        </label>
        <input
          id="total-carbohydrates"
          placeholder="Optional"
          className="text-right grow"
          value={totalCarbohydrates}
          onChange={(e) => setTotalCarbohydrates(e.target.value)}
        />
      </div>
      <div className="flex gap-4 justify-between items-center">
        <label className="basis-5/12 text-sm" htmlFor="dietary-fiber">
          Dietary Fiber (g)
        </label>
        <input
          id="dietary-fiber"
          placeholder="Optional"
          className="text-right grow"
          value={dietaryFiber}
          onChange={(e) => setDietaryFiber(e.target.value)}
        />
      </div>
      <div className="flex gap-4 justify-between items-center">
        <label className="basis-5/12 text-sm" htmlFor="sugars">
          Sugars (g)
        </label>
        <input
          id="sugars"
          placeholder="Optional"
          className="text-right grow"
          value={sugars}
          onChange={(e) => setSugars(e.target.value)}
        />
      </div>
      <div className="flex gap-4 justify-between items-center">
        <label className="basis-5/12 text-sm" htmlFor="added-sugars">
          Added Sugars (g)
        </label>
        <input
          id="added-sugars"
          placeholder="Optional"
          className="text-right grow"
          value={addedSugars}
          onChange={(e) => setAddedSugars(e.target.value)}
        />
      </div>
      <div className="flex gap-4 justify-between items-center">
        <label className="basis-5/12 text-sm" htmlFor="sugar-alcohols">
          Sugar Alcohols (g)
        </label>
        <input
          id="sugar-alcohols"
          placeholder="Optional"
          className="text-right grow"
          value={sugarAlcohols}
          onChange={(e) => setSugarAlcohols(e.target.value)}
        />
      </div>
      <div className="flex gap-4 justify-between items-center">
        <label className="basis-5/12 text-sm" htmlFor="protein">
          Protein (g)
        </label>
        <input
          id="protein"
          placeholder="Optional"
          className="text-right grow"
          value={protein}
          onChange={(e) => setProtein(e.target.value)}
        />
      </div>
      <div className="flex gap-4 justify-between items-center">
        <label className="basis-5/12 text-sm" htmlFor="vitamin-a">
          Vitamin A (%)
        </label>
        <input
          id="vitamin-a"
          placeholder="Optional"
          className="text-right grow"
          value={vitaminA}
          onChange={(e) => setVitaminA(e.target.value)}
        />
      </div>
      <div className="flex gap-4 justify-between items-center">
        <label className="basis-5/12 text-sm" htmlFor="vitamin-c">
          Vitamin C (%)
        </label>
        <input
          id="vitamin-c"
          placeholder="Optional"
          className="text-right grow"
          value={vitaminC}
          onChange={(e) => setVitaminC(e.target.value)}
        />
      </div>
      <div className="flex gap-4 justify-between items-center">
        <label className="basis-5/12 text-sm" htmlFor="calcium">
          Calcium (%)
        </label>
        <input
          id="calcium"
          placeholder="Optional"
          className="text-right grow"
          value={calcium}
          onChange={(e) => setCalcium(e.target.value)}
        />
      </div>
      <div className="flex gap-4 justify-between items-center">
        <label className="basis-5/12 text-sm" htmlFor="iron">
          Iron (%)
        </label>
        <input
          id="iron"
          placeholder="Optional"
          className="text-right grow"
          value={iron}
          onChange={(e) => setIron(e.target.value)}
        />
      </div>
      <div className="flex gap-4 justify-between items-center">
        <label className="basis-5/12 text-sm" htmlFor="vitamin-d">
          Vitamin D (%)
        </label>
        <input
          id="vitamin-d"
          placeholder="Optional"
          className="text-right grow"
          value={vitaminD}
          onChange={(e) => setVitaminD(e.target.value)}
        />
      </div>
    </div>
  );
};

export default CreateFoodNutritionFacts;
