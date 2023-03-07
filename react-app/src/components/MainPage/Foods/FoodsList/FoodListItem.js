import { useState } from "react";
import { Modal } from "../../../../context/Modal";
import ViewEditDeleteFoodListItem from "./ViewEditDeleteFoodListItem";

const FoodListItem = ({ food, index }) => {
  const [showModal, setShowModal] = useState(false);
  const onClose = () => {
    setShowModal(false);
  };
  return (
    <>
      <li
        className="p-2 bg-slate-100 hover:bg-slate-200 rounded-md cursor-pointer"
        key={index}
        onClick={() => setShowModal(true)}
      >
        <h4>{food.description}</h4>
        <p className="text-xs text-slate-500">
          {food.calories} cal, {food.servingSize}, {food.brandName}
        </p>
      </li>
      {showModal && (
        <Modal onClose={onClose}>
          <ViewEditDeleteFoodListItem food={food} onClose={onClose} />
        </Modal>
      )}
    </>
  );
};

export default FoodListItem;
