import { useState } from "react";
import CreateFoodDescription from "./CreateFoodDescription";
import CreateFoodNutritionFacts from "./CreateFoodNutritionFacts";

const CreateFood = ({ onClose }) => {
  const [brandName, setBrandName] = useState("");
  const [foodDescription, setFoodDescription] = useState("");
  const [servingSize, setServingSize] = useState("");
  const [calories, setCalories] = useState();
  const [totalFat, setTotalFat] = useState();
  const [saturatedFat, setSaturatedFat] = useState();
  const [polysaturatedFat, setPolysaturatedFat] = useState();
  const [monounsaturatedFat, setMonounsaturatedFat] = useState();
  const [transFat, setTransFat] = useState();
  const [cholesterol, setCholesterol] = useState();
  const [sodium, setSodium] = useState();
  const [potassium, setPotassium] = useState();
  const [totalCarbohydrates, setTotalCarbohydrates] = useState();
  const [dietaryFiber, setDietaryFiber] = useState();
  const [sugars, setSugars] = useState();
  const [addedSugars, setAddedSugars] = useState();
  const [sugarAlcohols, setSugarAlcohols] = useState();
  const [protein, setProtein] = useState();
  const [vitaminA, setVitaminA] = useState();
  const [vitaminC, setVitaminC] = useState();
  const [calcium, setCalcium] = useState();
  const [iron, setIron] = useState();
  const [vitaminD, setVitaminD] = useState();

  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});

  const onNext = () => {
    const secondaryLabels = document.querySelectorAll(
      ".create-food-description-input-secondary-label"
    );
    const errorLabels = document.querySelectorAll(
      ".create-food-description-error"
    );

    secondaryLabels.forEach((label) => {
      label.classList.remove("hidden");
    });

    errorLabels.forEach((label) => {
      label.classList.add("hidden");
    });

    if (Object.keys(errors).length) {
      for (const error in errors) {
        const secondaryLabel = document.querySelector(
          `.create-food-description-input-secondary-label-${error}`
        );
        const errorLabel = document.querySelector(
          `.create-food-description-error-${error}`
        );
        secondaryLabel.classList.add("hidden");
        errorLabel.classList.remove("hidden");
      }
    } else {
      setStep(2);
    }
  };

  const onPrev = () => {
    setStep(1);
  };

  return (
    <section
      className="bg-white rounded-md
      divide-y divide-slate-200 w-128"
      onClick={(e) => e.stopPropagation()}
    >
      <header className="flex items-center justify-between p-3">
        {step === 1 ? (
          <button onClick={onClose}>
            <i className="fa-solid fa-xmark w-4 h-4"></i>
          </button>
        ) : (
          <button onClick={onPrev}>
            <i
              className="fa-solid fa-arrow-left
            w-4 h-4"
            ></i>
          </button>
        )}
        <div>Create Food</div>
        <button onClick={onNext}>
          <i
            className="fa-solid fa-arrow-right
          w-4 h-4"
          ></i>
        </button>
      </header>
      {step === 1 ? (
        <CreateFoodDescription
          brandName={brandName}
          setBrandName={setBrandName}
          foodDescription={foodDescription}
          setFoodDescription={setFoodDescription}
          servingSize={servingSize}
          setServingSize={setServingSize}
          errors={errors}
          setErrors={setErrors}
        />
      ) : (
        <CreateFoodNutritionFacts
          calories={calories}
          setCalories={setCalories}
          totalFat={totalFat}
          setTotalFat={setTotalFat}
          saturatedFat={saturatedFat}
          setSaturatedFat={setSaturatedFat}
          polysaturatedFat={polysaturatedFat}
          setPolysaturatedFat={setPolysaturatedFat}
          monounsaturatedFat={monounsaturatedFat}
          setMonounsaturatedFat={setMonounsaturatedFat}
          transFat={transFat}
          setTransFat={setTransFat}
          cholesterol={cholesterol}
          setCholesterol={setCholesterol}
          sodium={sodium}
          setSodium={setSodium}
          potassium={potassium}
          setPotassium={setPotassium}
          totalCarbohydrates={totalCarbohydrates}
          setTotalCarbohydrates={setTotalCarbohydrates}
          dietaryFiber={dietaryFiber}
          setDietaryFiber={setDietaryFiber}
          sugars={sugars}
          setSugars={setSugars}
          addedSugars={addedSugars}
          setAddedSugars={setAddedSugars}
          sugarAlcohols={sugarAlcohols}
          setSugarAlcohols={setSugarAlcohols}
          protein={protein}
          setProtein={setProtein}
          vitaminA={vitaminA}
          setVitaminA={setVitaminA}
          vitaminC={vitaminC}
          setVitaminC={setVitaminC}
          calcium={calcium}
          setCalcium={setCalcium}
          iron={iron}
          setIron={setIron}
          vitaminD={vitaminD}
          setVitaminD={setVitaminD}
        />
      )}
    </section>
  );
};

export default CreateFood;
