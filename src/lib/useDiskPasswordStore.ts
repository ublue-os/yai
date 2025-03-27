import { create } from "zustand";

interface DiskEncryptionState {
  password: string;
  setPassword: (password: string) => void;
}

export const useDiskPasswordStore = create<DiskEncryptionState>((set) => ({
  password: "",
  setPassword: (password: string) => set({ password }),
}));
