import { create } from "zustand";

interface BurnState {
  burnNTFcount: number;
  setBurnNTFcount: (burnNTFcount: number) => void;
  displayPotion: number;
  setDisplayPotion: (displayPotion: number) => void;
  incrementPotion: () => void;
  decrementPotion: () => void;
  chooseNFTTokenIds: string[];
  setChooseNFTTokenIds: (chooseNFTTokenIds: string[]) => void;
  reset: () => void;
}

const initialBurnState = {
  burnNTFcount: 0,
  displayPotion: 0,
  chooseNFTTokenIds: [],
};

export const useBurnStore = create<BurnState>((set) => ({
  ...initialBurnState,
  setBurnNTFcount: (burnNTFcount) => set({ burnNTFcount }),
  setDisplayPotion: (displayPotion) => set({ displayPotion }),
  incrementPotion: () =>
    set((state) => ({ displayPotion: state.displayPotion + 1 })),
  decrementPotion: () =>
    set((state) => ({ displayPotion: state.displayPotion - 1 })),
  setChooseNFTTokenIds: (chooseNFTTokenIds) => set({ chooseNFTTokenIds }),
  reset: () => set({ ...initialBurnState }),
}));
