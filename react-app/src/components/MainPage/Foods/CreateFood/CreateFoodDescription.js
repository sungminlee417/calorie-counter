const CreateFoodDescription = ({
  brandName,
  setBrandName,
  foodDescription,
  setFoodDescription,
  servingSize,
  setServingSize,
}) => {
  const onChangeBrandName = (name) => {
    setBrandName(name);
  };

  const onChangeFoodDescription = (description) => {
    setFoodDescription(description);
  };

  const onChangeServingSize = (size) => {
    setServingSize(size);
  };

  return (
    <div className="flex flex-col gap-4 p-3">
      <div className="flex gap-4 justify-between items-center">
        <label className="basis-1/4" htmlFor="brand-name">
          Brand Name
        </label>
        <input
          id="brand-name"
          placeholder="ex. Campbell's"
          className="text-right grow p-1"
          value={brandName}
          onChange={(e) => onChangeBrandName(e.target.value)}
        />
      </div>
      <div className="flex gap-4 justify-between items-center">
        <label className="basis-1/4" htmlFor="brand-name">
          Description
        </label>
        <input
          id="food-description"
          placeholder="ex. Chicken Soup"
          className="text-right grow p-1"
          value={foodDescription}
          onChange={(e) => onChangeFoodDescription(e.target.value)}
        />
      </div>
      <div className="flex gap-4 justify-between items-center">
        <label className="basis-1/4" htmlFor="brand-name">
          Serving Size
        </label>
        <input
          id="serving-size"
          placeholder="ex. 1 cup"
          className="text-right grow p-1"
          value={servingSize}
          onChange={(e) => onChangeServingSize(e.target.value)}
        />
      </div>
    </div>
  );
};

export default CreateFoodDescription;
