import { useEffect } from "react";

const CreateFoodDescription = ({
  brandName,
  setBrandName,
  foodDescription,
  setFoodDescription,
  servingSize,
  setServingSize,
  errors,
  setErrors,
}) => {
  const servingSizeValid = (servingSizeInput) => {
    let firstCharNumber = true;
    let nonNumberExists = true;

    const checkCharIsNumber = /^\d/;
    if (!checkCharIsNumber.test(servingSizeInput[0])) firstCharNumber = false;

    for (let i = 1; i < servingSizeInput.length; i++) {
      const char = servingSizeInput[i];
      if (!checkCharIsNumber.test(char)) {
        nonNumberExists = true;
        break;
      } else {
        nonNumberExists = false;
      }
    }

    if (!firstCharNumber || !nonNumberExists) {
      return false;
    }

    return true;
  };

  useEffect(() => {
    const errorArr = {};
    if (!foodDescription) errorArr["foodDescription"] = "error";
    if (!servingSize || !servingSizeValid(servingSize))
      errorArr["servingSize"] = "error";
    setErrors(errorArr);
  }, [brandName, foodDescription, servingSize]);

  return (
    <div className="flex flex-col gap-4 p-3">
      <div className="flex gap-4 justify-between">
        <label className="basis-4/12 gap-0.5" htmlFor="brand-name">
          <div>Brand Name</div>
          <div className="text-xs text-slate-500">Optional</div>
        </label>
        <input
          id="brand-name"
          placeholder="ex. Campbell's"
          className="text-right grow p-1"
          value={brandName}
          onChange={(e) => setBrandName(e.target.value)}
        />
      </div>
      <div className="flex gap-4 justify-between">
        <label className="basis-4/12 gap-0.5" htmlFor="brand-name">
          <div>Description</div>
          <div className="text-xs text-slate-500">Required</div>
          <span className="create-food-description-error create-food-description-error-foodDescription text-red-600 invisible">
            *
          </span>
        </label>
        <input
          id="food-description"
          placeholder="ex. Chicken Soup"
          className="text-right grow p-1"
          value={foodDescription}
          onChange={(e) => setFoodDescription(e.target.value)}
        />
      </div>
      <div className="flex gap-4 justify-between">
        <label className="basis-4/12" htmlFor="brand-name">
          <div>Serving Size</div>
          <div className="text-xs text-slate-500">Required</div>
          <span className="create-food-description-error create-food-description-error-servingSize text-red-600 invisible">
            *
          </span>
        </label>
        <input
          id="serving-size"
          placeholder="ex. 1 cup"
          className="text-right grow p-1"
          value={servingSize}
          onChange={(e) => setServingSize(e.target.value)}
        />
      </div>
    </div>
  );
};

export default CreateFoodDescription;
