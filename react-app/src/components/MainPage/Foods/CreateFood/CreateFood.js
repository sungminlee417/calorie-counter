import { useState } from "react";
import { useDispatch } from "react-redux";
import { Modal } from "../../../../context/Modal";
import { createFoodThunk } from "../../../../store/food";
import CreateFoodConfirmSubmit from "./CreateFoodConfirmSubmit";
import CreateFoodDescription from "./CreateFoodDescription";
import CreateFoodNutritionFacts from "./CreateFoodNutritionFacts";

const CreateFood = ({ onClose }) => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [confirmationClicked, setConfirmationClicked] = useState(false);

  const [brandName, setBrandName] = useState("");
  const [foodDescription, setFoodDescription] = useState("");
  const [servingSize, setServingSize] = useState("");
  const [calories, setCalories] = useState("");
  const [totalFat, setTotalFat] = useState("");
  const [saturatedFat, setSaturatedFat] = useState("");
  const [polysaturatedFat, setPolysaturatedFat] = useState("");
  const [monounsaturatedFat, setMonounsaturatedFat] = useState("");
  const [transFat, setTransFat] = useState("");
  const [cholesterol, setCholesterol] = useState("");
  const [sodium, setSodium] = useState("");
  const [potassium, setPotassium] = useState();
  const [totalCarbohydrates, setTotalCarbohydrates] = useState("");
  const [dietaryFiber, setDietaryFiber] = useState("");
  const [sugars, setSugars] = useState("");
  const [addedSugars, setAddedSugars] = useState("");
  const [sugarAlcohols, setSugarAlcohols] = useState("");
  const [protein, setProtein] = useState("");
  const [vitaminA, setVitaminA] = useState("");
  const [vitaminC, setVitaminC] = useState("");
  const [calcium, setCalcium] = useState("");
  const [iron, setIron] = useState("");
  const [vitaminD, setVitaminD] = useState("");

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

  const onSubmit = () => {
    const payload = {
      brand_name: brandName,
      food_description: foodDescription,
      serving_size: servingSize,
      calories,
      total_fat: totalFat,
      saturated_fat: saturatedFat,
      polysaturated_fat: polysaturatedFat,
      monounsaturated_fat: monounsaturatedFat,
      trans_fat: transFat,
      cholesterol,
      sodium,
      potassium,
      total_carbohydrates: totalCarbohydrates,
      dietary_fiber: dietaryFiber,
      sugars,
      added_sugars: addedSugars,
      sugar_alcohols: sugarAlcohols,
      protein,
      vitamin_a: vitaminA,
      vitamin_c: vitaminC,
      calcium,
      iron,
      vitamin_d: vitaminD,
    };

    if (
      confirmationClicked ||
      totalFat ||
      saturatedFat ||
      polysaturatedFat ||
      monounsaturatedFat ||
      transFat ||
      cholesterol ||
      sodium ||
      potassium ||
      totalCarbohydrates ||
      dietaryFiber ||
      sugars ||
      addedSugars ||
      sugarAlcohols ||
      protein ||
      vitaminA ||
      vitaminC ||
      calcium ||
      iron ||
      vitaminD
    ) {
      dispatch(createFoodThunk(payload));
      onClose();
      return;
    } else {
      setConfirmationClicked(true);
      setShowModal(true);
    }
  };

  const onCloseConfirmation = () => {
    setShowModal(false);
  };

  return (
    <section
      className="bg-white rounded-md
      divide-y divide-slate-200 w-128"
      onClick={(e) => e.stopPropagation()}
    >
      <header className="flex items-center justify-between p-3">
        {step === 1 ? (
          <>
            <button onClick={onClose}>
              <i className="fa-solid fa-xmark w-4 h-4"></i>
            </button>
            <div>Create Food</div>

            <button onClick={onNext}>
              <i
                className="fa-solid fa-arrow-right
                  w-4 h-4"
              ></i>
            </button>
          </>
        ) : (
          <>
            <button onClick={onPrev}>
              <i
                className="fa-solid fa-arrow-left
            w-4 h-4"
              ></i>
            </button>
            <div>Create Food</div>
            <button
              className={`create-food-submit ${
                calories ? "cursor-pointer" : "cursor-not-allowed"
              }`}
              onClick={onSubmit}
              disabled={!calories}
            >
              <i
                className={`fa-solid fa-check ${
                  calories ? "text-blue-500" : "text - slate - 500"
                }`}
              ></i>
            </button>
          </>
        )}
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
      {showModal && (
        <Modal onClose={onCloseConfirmation}>
          <CreateFoodConfirmSubmit
            onClose={onCloseConfirmation}
            onSubmit={onSubmit}
          />
        </Modal>
      )}
    </section>
  );
};

export default CreateFood;
