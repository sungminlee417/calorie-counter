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
    const errorArr = [];
    if (!brandName) errorArr.push("brandName");
    if (!foodDescription) errorArr.push("foodDescription");
    if (!servingSize || !servingSizeValid(servingSize))
      errorArr.push("servingSize");
    setErrors(errorArr);
  }, [brandName, foodDescription, servingSize]);

  return (
    <div className="flex flex-col gap-4 p-3">
      <div className="flex gap-4 justify-between items-center">
        <label className="basis-4/12 flex gap-0.5" htmlFor="brand-name">
          <span>Brand Name</span>
          <span className="create-food-description-error create-food-description-error-brandName text-red-600 invisible">
            *
          </span>
        </label>
        <input
          id="brand-name"
          placeholder="ex. Campbell's"
          className="text-right grow p-1"
          value={brandName}
          onChange={(e) => setBrandName(e.target.value)}
        />
      </div>
      <div className="flex gap-4 justify-between items-center">
        <label className="basis-4/12 flex gap-0.5" htmlFor="brand-name">
          <span>Description</span>
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
      <div className="flex gap-4 justify-between items-center">
        <label className="basis-4/12 flex gap-0.5" htmlFor="brand-name">
          <span>Serving Size</span>
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
