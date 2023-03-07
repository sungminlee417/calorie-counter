const ViewEditDeleteFoodListItem = ({ food, onClose }) => {
  return (
    <section className="bg-white rounded-md w-96">
      <header className="bg-slate-100 flex items-center justify-between p-3 rounded-t-md">
        <button onClick={onClose}>
          <i className="fa-solid fa-xmark w-4 h-4" />
        </button>
        <div>Add Food</div>
        <i className="fa-solid fa-check text-blue-500" />
      </header>
      <div className="divide-y">
        <div className="p-3 ">
          <div>{food.description}</div>
          <div className="text-slate-500 text-xs">{food.brandName}</div>
        </div>
      </div>
    </section>
  );
};

export default ViewEditDeleteFoodListItem;
