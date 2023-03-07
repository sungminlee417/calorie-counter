const CreateFoodConfirmSubmit = ({ onClose, onSubmit }) => {
  return (
    <section className="bg-white rounded-md flex flex-col justify-items-center divide-y divide-slate-200">
      <div className="flex flex-col gap-4 p-4">
        <header className="text-center">Add Nutrient Information</header>
        <div className="text-xs text-slate-500">
          Your diary is more accurate when you add nutrient details
        </div>
      </div>
      <div className="flex divide-x divide-slate-200">
        <button className="w-full p-2" onClick={onSubmit}>
          No Thanks
        </button>
        <button className="w-full p-2" onClose={onClose}>
          Add Details
        </button>
      </div>
    </section>
  );
};

export default CreateFoodConfirmSubmit;
