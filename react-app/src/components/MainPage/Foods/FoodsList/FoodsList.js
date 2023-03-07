import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadFoodsThunk } from "../../../../store/food";
import CreateFoodModalButton from "../CreateFoodModalButton/CreateFoodModalButton";
import FoodListItem from "./FoodListItem";

const FoodsList = () => {
  const dispatch = useDispatch();
  const foods = Object.values(useSelector((state) => state.foods));

  useEffect(() => {
    dispatch(loadFoodsThunk());
  }, [dispatch]);

  return (
    <section className="divide-y flex flex-col w-80 h-96 m-10 shadow-md rounded-md">
      <header className="flex gap-2 items-center p-2">
        <i className="fa-solid fa-magnifying-glass text-slate-500"></i>
        <input className="w-full p-1" placeholder="Search"></input>
      </header>
      <div className="p-2 overflow-auto">
        <ul className="flex flex-col gap-2">
          {foods.map((food, i) => {
            return <FoodListItem food={food} index={i} />;
          })}
        </ul>
      </div>
      <footer className="flex justify-end p-2">
        <CreateFoodModalButton />
      </footer>
    </section>
  );
};

export default FoodsList;
