import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface CardDialog {
  open: boolean;
  userId: string | null;
  currentStatus: boolean | null;
  setDialog: (userId: string, status: boolean) => void;
  setOpen: (value: boolean) => void;
  reset: () => void;
}

export const useCardDialog = create<CardDialog>()(
  devtools((set) => ({
    open: false,
    userId: null,
    currentStatus: null,
    setDialog: (userId, status) =>
      set({ userId, currentStatus: status, open: true }),
    setOpen: (value) => set({ open: value }),
    reset: () =>
      set({
        open: false,
        userId: null,
        currentStatus: null,
      }),
  }))
);
