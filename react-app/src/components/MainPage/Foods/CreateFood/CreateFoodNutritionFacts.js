const CreateFoodNutritionFacts = ({
  calories,
  setCalories,
  totalFat,
  setTotalFat,
}) => {
  const onChangeCalories = (caloriesInput) => {
    setCalories(caloriesInput);
  };

  const onChangeTotalFat = (totalFatInput) => {
    setTotalFat(totalFatInput);
  };

  return (
    <div className="flex flex-col gap-4 p-3">
      <div className="flex gap-4 justify-between items-center">
        <label className="basis-1/4" htmlFor="calories">
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
        <label className="basis-1/4" htmlFor="total-fat">
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
