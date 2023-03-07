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
  const [description, setDescription] = useState("");
  const [servingSize, setServingSize] = useState("");
  const [calories, setCalories] = useState("");
  const [totalFat, setTotalFat] = useState("");
  const [saturatedFat, setSaturatedFat] = useState("");
  const [polysaturatedFat, setPolysaturatedFat] = useState("");
  const [monounsaturatedFat, setMonounsaturatedFat] = useState("");
  const [transFat, setTransFat] = useState("");
  const [cholesterol, setCholesterol] = useState("");
  const [sodium, setSodium] = useState("");
  const [potassium, setPotassium] = useState("");
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
      description: description,
      serving_size: servingSize,
      calories: calories,
      total_fat: totalFat || 0,
      saturated_fat: saturatedFat || 0,
      polysaturated_fat: polysaturatedFat || 0,
      monounsaturated_fat: monounsaturatedFat || 0,
      trans_fat: transFat || 0,
      cholesterol: cholesterol || 0,
      sodium: sodium || 0,
      potassium: potassium || 0,
      total_carbohydrates: totalCarbohydrates || 0,
      dietary_fiber: dietaryFiber || 0,
      sugars: sugars || 0,
      added_sugars: addedSugars || 0,
      sugar_alcohols: sugarAlcohols || 0,
      protein: protein || 0,
      vitamin_a: vitaminA || 0,
      vitamin_c: vitaminC || 0,
      calcium: calcium || 0,
      iron: iron || 0,
      vitamin_d: vitaminD || 0,
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
              <i className="fa-solid fa-xmark w-4 h-4" />
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
              />
            </button>
          </>
        )}
      </header>
      {step === 1 ? (
        <CreateFoodDescription
          brandName={brandName}
          setBrandName={setBrandName}
          description={description}
          setDescription={setDescription}
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
