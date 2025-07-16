"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

import dayjs from "dayjs";

type DateContextType = {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  goToYesterday: () => void;
  goToTomorrow: () => void;
};

const DateContext = createContext<DateContextType | undefined>(undefined);

export const DateProvider = ({ children }: { children: ReactNode }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const goToYesterday = useCallback(() => {
    setSelectedDate((prev) => dayjs(prev).subtract(1, "day").toDate());
  }, []);

  const goToTomorrow = useCallback(() => {
    setSelectedDate((prev) => dayjs(prev).add(1, "day").toDate());
  }, []);

  return (
    <DateContext.Provider
      value={{ selectedDate, setSelectedDate, goToYesterday, goToTomorrow }}
    >
      {children}
    </DateContext.Provider>
  );
};

export const useDate = (): DateContextType => {
  const context = useContext(DateContext);
  if (!context) {
    throw new Error("useDate must be used within a DateProvider");
  }
  return context;
};
