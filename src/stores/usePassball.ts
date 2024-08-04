import { create, type StateCreator } from "zustand";
import { persist } from "zustand/middleware";

type Gender = "male" | "female";

type PassballState = {
  male: boolean;
  female: boolean;
  choice: Record<Gender, string>;
  setAnswered: (gender: Gender, state: boolean) => void;
  setChoice: (gender: Gender, selection: string) => void;
};

const createState: StateCreator<PassballState> = (set, get) => ({
  male: false,
  female: false,
  choice: { male: "", female: "" },
  setChoice: (gender, selection) => {
    if (gender === "female") {
      set({ choice: { female: selection, male: get().choice.male } });
    } else set({ choice: { male: selection, female: get().choice.female } });
  },
  setAnswered: (gender, state) => {
    set({ [gender]: state });
  },
});

export const usePassball = create(
  persist(createState, { name: "passball-state" }),
);
