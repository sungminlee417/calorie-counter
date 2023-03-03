import { useState } from "react";
import { Modal } from "../../../../context/Modal";
import CreateFood from "../CreateFood/CreateFood";

const CreateFoodModal = () => {
  const [showModal, setShowModal] = useState(false);

  const onClick = () => {
    setShowModal(true);
  };

  return (
    <>
      <button
        className="p-2 bg-blue-500 rounded-md text-white"
        onClick={onClick}
      >
        Create food
      </button>
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <CreateFood />
        </Modal>
      )}
    </>
  );
};

export default CreateFoodModal;
