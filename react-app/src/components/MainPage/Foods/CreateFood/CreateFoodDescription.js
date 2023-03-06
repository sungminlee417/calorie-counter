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
    const checkCharIsNumber = /^\d/;

    const servingSizeArr = servingSizeInput.split(" ");
    const servingSizeAmount = servingSizeArr[0];
    const servingSizeUnit = servingSizeArr[1];

    let firstCharNumber = checkCharIsNumber.test(servingSizeAmount[0]);
    let nonNumberExists = true;

    // If there a serving size unit exists after a space, or if there is no space an possibly a unit following the number
    if (!servingSizeUnit && servingSizeAmount.length <= 1) {
      nonNumberExists = false;
    }

    // Check that the unit has a non number as it's first character
    if (servingSizeUnit) {
      if (checkCharIsNumber.test(servingSizeUnit[0])) nonNumberExists = false;
    } else {
      // If there is no space between the unit and amount, make sure that a non number exists
      for (let i = 1; i < servingSizeAmount.length; i++) {
        const char = servingSizeInput[i];
        if (!checkCharIsNumber.test(char)) {
          nonNumberExists = true;
          break;
        } else {
          nonNumberExists = false;
        }
      }
    }

    return firstCharNumber && nonNumberExists;
  };

  useEffect(() => {
    const errorObj = {};
    if (!foodDescription)
      errorObj["foodDescription"] = "Food description required.";
    if (!servingSize || !servingSizeValid(servingSize))
      errorObj["servingSize"] =
        "Provide serving size in proper format. Ex. 3 cups.";
    setErrors(errorObj);
  }, [brandName, foodDescription, servingSize]);

  return (
    <div className="flex flex-col gap-4 p-3">
      <div className="flex gap-4 justify-between">
        <label className="basis-3/4" htmlFor="brand-name">
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
        <label className="basis-3/4 gap-0.5" htmlFor="food-description">
          <div>Description</div>
          <div
            className={`create-food-description-input-secondary-label create-food-description-input-secondary-label-foodDescription text-xs text-slate-500`}
          >
            Required
          </div>
          <div className="create-food-description-error create-food-description-error-foodDescription text-red-600 text-xs hidden">
            *Food description required.
          </div>
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
        <label className="basis-3/4" htmlFor="serving-size">
          <div>Serving Size</div>
          <div
            className={`create-food-description-input-secondary-label create-food-description-input-secondary-label-servingSize text-xs text-slate-500`}
          >
            Required
          </div>
          <div className="create-food-description-error create-food-description-error-servingSize text-red-600 text-xs hidden">
            *Provide serving size in proper format. Ex. 3 cups.
          </div>
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
