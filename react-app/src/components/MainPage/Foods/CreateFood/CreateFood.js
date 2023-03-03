import { useState } from "react";
import CreateFoodDescription from "./CreateFoodDescription";

const CreateFood = ({ onClose }) => {
  const [brandName, setBrandName] = useState("");
  const [foodDesc, setFoodDesc] = useState("");
  const [servingSize, setServingSize] = useState("");
  const [calories, setCalories] = useState(0);
  const [totalFat, setTotalFat] = useState(0);
  const [saturatedFat, setSaturatedFat] = useState(0);
  const [polysaturatedFat, setPolysaturatedFat] = useState(0);
  const [monounsaturatedFat, setMonounsaturatedFat] = useState(0);
  const [transFat, setTransFat] = useState(0);
  const [cholesterol, setCholesterol] = useState(0);
  const [sodium, setSodium] = useState(0);
  const [potassium, setPotassium] = useState(0);
  const [totalCarbohydrates, setTotalCarbohydrates] = useState(0);
  const [dietaryFiber, setDietaryFiber] = useState(0);
  const [sugars, setSugars] = useState(0);
  const [addedSugars, setAddedSugars] = useState(0);
  const [sugarAlcohols, setSugarAlcohols] = useState(0);
  const [protein, setProtein] = useState(0);
  const [vitaminA, setVitaminA] = useState(0);
  const [vitaminC, setVitaminC] = useState(0);
  const [calcium, setCalcium] = useState(0);
  const [iron, setIron] = useState(0);
  const [vitaminD, setVitaminD] = useState(0);

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
        {step === 1 && (
          <button onClick={onClose}>
            <i className="fa-solid fa-xmark w-4 h-4"></i>
          </button>
        )}
        {step === 2 && (
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
      {step === 1 && (
        <CreateFoodDescription
          brandName={brandName}
          setBrandName={setBrandName}
          foodDesc={foodDesc}
          setFoodDesc={setFoodDesc}
        />
      )}
    </section>
  );
};

export default CreateFood;
