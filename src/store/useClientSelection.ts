// src/store/useClientSelection.ts

//*******************************************************************************************/
// Zustand is a small, fast and scalable state management library for React.
// Its name means "state" in German. Here we use it to store and manage the list
// of selected client IDs globally across different pages (e.g., /clients, /generate, /edit).
// This makes it possible to preserve checkbox selections even when navigating between views.
//*******************************************************************************************/
import { create } from "zustand";

interface ClientSelectionState {
  selectedClients: number[];
  setSelectedClients: (ids: number[]) => void;
  toggleClient: (id: number) => void;
  resetSelection: () => void;
}

export const useClientSelection = create<ClientSelectionState>((set) => ({
  selectedClients: [],
  setSelectedClients: (ids) => set({ selectedClients: ids }),
  toggleClient: (id) =>
    set((state) => ({
      selectedClients: state.selectedClients.includes(id)
        ? state.selectedClients.filter((cid) => cid !== id)
        : [...state.selectedClients, id],
    })),
  resetSelection: () => set({ selectedClients: [] }),
}));
