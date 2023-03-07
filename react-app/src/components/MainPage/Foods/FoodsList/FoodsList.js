import CreateFoodModal from "../CreateFoodModal/CreateFoodModal";

const FoodsList = () => {
  return (
    <section className="w-80 m-10 shadow-md rounded-md">
      <header className="flex gap-2 items-center p-2">
        <i className="fa-solid fa-magnifying-glass text-slate-500"></i>
        <input className="h-10 w-full" placeholder="Search"></input>
      </header>
      <footer className="flex justify-end p-2">
        <CreateFoodModal />
      </footer>
    </section>
  );
};

export default FoodsList;
