import { create } from "zustand";

interface UserState {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
  username: string;
  setUsername: (username: string) => void;
  password: string;
  setPassword: (password: string) => void;
  unixname: string;
  setUnixname: (unixname: string) => void;
}

export const useUsersStore = create<UserState>((set) => ({
  enabled: false,
  setEnabled: (enabled: boolean) => set({ enabled }),
  username: "",
  setUsername: (username: string) => set({ username }),
  password: "",
  setPassword: (password: string) => set({ password }),
  unixname: "",
  setUnixname: (unixname: string) => set({ unixname }),
}));
