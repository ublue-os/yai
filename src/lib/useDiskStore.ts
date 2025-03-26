import { create } from "zustand";

export const useDiskStore = create((set) => ({
  disk: "",
  setDisk: (disk: string) => set({ disk }),
}));
