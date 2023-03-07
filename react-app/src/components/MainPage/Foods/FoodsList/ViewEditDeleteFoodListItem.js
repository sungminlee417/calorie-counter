const ViewEditDeleteFoodListItem = ({ onClose }) => {
  return (
    <section className="bg-white rounded-md w-96">
      <header className="flex items-center justify-between p-3">
        <button onClick={onClose}>
          <i className="fa-solid fa-xmark w-4 h-4" />
        </button>
        <div>Add Food</div>
        <i className="fa-solid fa-check text-blue-500" />
      </header>
    </section>
  );
};

export default ViewEditDeleteFoodListItem;
