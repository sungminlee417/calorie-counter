import { useState } from "react";
import CreateFoodDescription from "./CreateFoodDescription";
import CreateFoodNutritionFacts from "./CreateFoodNutritionFacts";

const CreateFood = ({ onClose }) => {
  const [brandName, setBrandName] = useState();
  const [foodDescription, setFoodDescription] = useState();
  const [servingSize, setServingSize] = useState();
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

  const onNext = () => {
    setStep(2);
  };

  const onPrev = () => {
    setStep(1);
  };

  return (
    <section
      className="bg-white rounded-md w-96
      divide-y divide-slate-200"
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
        />
      )}
    </section>
  );
};

export default CreateFood;
