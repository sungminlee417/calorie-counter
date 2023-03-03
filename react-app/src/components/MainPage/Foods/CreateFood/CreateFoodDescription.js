const CreateFoodDescription = ({
  brandName,
  setBrandName,
  foodDesc,
  setFoodDesc,
}) => {
  const onChangeBrandName = (name) => {
    setBrandName(name);
  };

  return (
    <div className="flex flex-col gap-2 p-3">
      <div className="flex gap-4 justify-between">
        <label htmlFor="brand-name">Brand Name</label>
        <input
          id="brand-name"
          placeholder="ex. Campbell's"
          className="text-right grow"
          value={brandName}
          onChange={(e) => onChangeBrandName(e.target.value)}
        />
      </div>
    </div>
  );
};

export default CreateFoodDescription;
