import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadFoodsThunk } from "../../../../store/food";
import CreateFoodModal from "../CreateFoodModal/CreateFoodModal";

const FoodsList = () => {
  const dispatch = useDispatch();
  const foods = Object.values(useSelector((state) => state.foods));

  useEffect(() => {
    dispatch(loadFoodsThunk());
  }, [dispatch]);

  return (
    <section className="divide-y flex flex-col gap-2 w-80 m-10 shadow-md rounded-md">
      <header className="flex gap-2 items-center p-2">
        <i className="fa-solid fa-magnifying-glass text-slate-500"></i>
        <input className="w-full p-1" placeholder="Search"></input>
      </header>
      <div className="p-2">
        <ul className="flex flex-col gap-2">
          {foods.map((food, i) => {
            return (
              <li className="p-2 bg-slate-100 rounded-md" key={i}>
                <h4>{food.description}</h4>
                <p className="text-xs text-slate-500">
                  {food.calories} cal, {food.servingSize}, {food.brandName}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
      <footer className="flex justify-end p-2">
        <CreateFoodModal />
      </footer>
    </section>
  );
};

export default FoodsList;
