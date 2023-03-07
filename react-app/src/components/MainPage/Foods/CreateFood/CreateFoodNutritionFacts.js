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
    <div className="flex flex-col gap-4 p-3 h-128 overflow-auto">
      <div className="flex gap-4 justify-between items-center">
        <label className="basis-3/4 flex gap-0.5" htmlFor="calories">
          <div>Calories</div>
        </label>
        <input
          id="calories"
          placeholder="Required"
          className="text-right grow p-1"
          value={calories}
          onChange={(e) => setCalories(e.target.value)}
          type="number"
        />
      </div>
      <div className="flex gap-4 justify-between items-center">
        <label className="basis-3/4" htmlFor="total-fat">
          Total Fat (g)
        </label>
        <input
          id="total-fat"
          placeholder="Optional"
          className="text-right grow p-1"
          value={totalFat}
          onChange={(e) => setTotalFat(e.target.value)}
          type="number"
        />
      </div>
      <div className="flex gap-4 justify-between items-center">
        <label className="basis-3/4" htmlFor="saturated-fat">
          Saturated Fat (g)
        </label>
        <input
          id="saturated-fat"
          placeholder="Optional"
          className="text-right grow p-1"
          value={saturatedFat}
          onChange={(e) => setSaturatedFat(e.target.value)}
          type="number"
        />
      </div>
      <div className="flex gap-4 justify-between items-center">
        <label className="basis-3/4" htmlFor="polysaturated-fat">
          Polysaturated Fat (g)
        </label>
        <input
          id="polysaturated-fat"
          placeholder="Optional"
          className="text-right grow p-1"
          value={polysaturatedFat}
          onChange={(e) => setPolysaturatedFat(e.target.value)}
          type="number"
        />
      </div>
      <div className="flex gap-4 justify-between items-center">
        <label className="basis-3/4" htmlFor="monounsaturated-fat">
          Monounsaturated Fat (g)
        </label>
        <input
          id="monounsaturated-fat"
          placeholder="Optional"
          className="text-right grow p-1"
          value={monounsaturatedFat}
          onChange={(e) => setMonounsaturatedFat(e.target.value)}
          type="number"
        />
      </div>
      <div className="flex gap-4 justify-between items-center">
        <label className="basis-3/4" htmlFor="trans-fat">
          Trans Fat (g)
        </label>
        <input
          id="trans-fat"
          placeholder="Optional"
          className="text-right grow p-1"
          value={transFat}
          onChange={(e) => setTransFat(e.target.value)}
          type="number"
        />
      </div>
      <div className="flex gap-4 justify-between items-center">
        <label className="basis-3/4" htmlFor="cholesterol-fat">
          Cholesterol (mg)
        </label>
        <input
          id="cholesterol-fat"
          placeholder="Optional"
          className="text-right grow p-1"
          value={cholesterol}
          onChange={(e) => setCholesterol(e.target.value)}
          type="number"
        />
      </div>
      <div className="flex gap-4 justify-between items-center">
        <label className="basis-3/4" htmlFor="sodium">
          Sodium (mg)
        </label>
        <input
          id="sodium"
          placeholder="Optional"
          className="text-right grow p-1"
          value={sodium}
          onChange={(e) => setSodium(e.target.value)}
          type="number"
        />
      </div>
      <div className="flex gap-4 justify-between items-center">
        <label className="basis-3/4" htmlFor="potassium">
          Potassium (mg)
        </label>
        <input
          id="potassium"
          placeholder="Optional"
          className="text-right grow p-1"
          value={potassium}
          onChange={(e) => setPotassium(e.target.value)}
          type="number"
        />
      </div>
      <div className="flex gap-4 justify-between items-center">
        <label className="basis-3/4" htmlFor="total-carbohydrates">
          Total Carbohydrates (g)
        </label>
        <input
          id="total-carbohydrates"
          placeholder="Optional"
          className="text-right grow p-1"
          value={totalCarbohydrates}
          onChange={(e) => setTotalCarbohydrates(e.target.value)}
          type="number"
        />
      </div>
      <div className="flex gap-4 justify-between items-center">
        <label className="basis-3/4" htmlFor="dietary-fiber">
          Dietary Fiber (g)
        </label>
        <input
          id="dietary-fiber"
          placeholder="Optional"
          className="text-right grow p-1"
          value={dietaryFiber}
          onChange={(e) => setDietaryFiber(e.target.value)}
          type="number"
        />
      </div>
      <div className="flex gap-4 justify-between items-center">
        <label className="basis-3/4" htmlFor="sugars">
          Sugars (g)
        </label>
        <input
          id="sugars"
          placeholder="Optional"
          className="text-right grow p-1"
          value={sugars}
          onChange={(e) => setSugars(e.target.value)}
          type="number"
        />
      </div>
      <div className="flex gap-4 justify-between items-center">
        <label className="basis-3/4" htmlFor="added-sugars">
          Added Sugars (g)
        </label>
        <input
          id="added-sugars"
          placeholder="Optional"
          className="text-right grow p-1"
          value={addedSugars}
          onChange={(e) => setAddedSugars(e.target.value)}
          type="number"
        />
      </div>
      <div className="flex gap-4 justify-between items-center">
        <label className="basis-3/4" htmlFor="sugar-alcohols">
          Sugar Alcohols (g)
        </label>
        <input
          id="sugar-alcohols"
          placeholder="Optional"
          className="text-right grow p-1"
          value={sugarAlcohols}
          onChange={(e) => setSugarAlcohols(e.target.value)}
          type="number"
        />
      </div>
      <div className="flex gap-4 justify-between items-center">
        <label className="basis-3/4" htmlFor="protein">
          Protein (g)
        </label>
        <input
          id="protein"
          placeholder="Optional"
          className="text-right grow p-1"
          value={protein}
          onChange={(e) => setProtein(e.target.value)}
          type="number"
        />
      </div>
      <div className="flex gap-4 justify-between items-center">
        <label className="basis-3/4" htmlFor="vitamin-a">
          Vitamin A (%)
        </label>
        <input
          id="vitamin-a"
          placeholder="Optional"
          className="text-right grow p-1"
          value={vitaminA}
          onChange={(e) => setVitaminA(e.target.value)}
          type="number"
        />
      </div>
      <div className="flex gap-4 justify-between items-center">
        <label className="basis-3/4" htmlFor="vitamin-c">
          Vitamin C (%)
        </label>
        <input
          id="vitamin-c"
          placeholder="Optional"
          className="text-right grow p-1"
          value={vitaminC}
          onChange={(e) => setVitaminC(e.target.value)}
          type="number"
        />
      </div>
      <div className="flex gap-4 justify-between items-center">
        <label className="basis-3/4" htmlFor="calcium">
          Calcium (%)
        </label>
        <input
          id="calcium"
          placeholder="Optional"
          className="text-right grow p-1"
          value={calcium}
          onChange={(e) => setCalcium(e.target.value)}
          type="number"
        />
      </div>
      <div className="flex gap-4 justify-between items-center">
        <label className="basis-3/4" htmlFor="iron">
          Iron (%)
        </label>
        <input
          id="iron"
          placeholder="Optional"
          className="text-right grow p-1"
          value={iron}
          onChange={(e) => setIron(e.target.value)}
          type="number"
        />
      </div>
      <div className="flex gap-4 justify-between items-center">
        <label className="basis-3/4" htmlFor="vitamin-d">
          Vitamin D (%)
        </label>
        <input
          id="vitamin-d"
          placeholder="Optional"
          className="text-right grow p-1"
          value={vitaminD}
          onChange={(e) => setVitaminD(e.target.value)}
          type="number"
        />
      </div>
    </div>
  );
};

export default CreateFoodNutritionFacts;
