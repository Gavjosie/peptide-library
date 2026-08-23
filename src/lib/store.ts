import { create } from "zustand";

const STORAGE_KEY = "peptide-library-v1";

type LibraryState = {
  favorites: string[];
  compare: string[];
  hydrated: boolean;
  setHydrated: (value: boolean) => void;
  toggleFavorite: (slug: string) => void;
  toggleCompare: (slug: string) => void;
  clearCompare: () => void;
  removeCompare: (slug: string) => void;
};

function readStorage(): { favorites: string[]; compare: string[] } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { favorites: [], compare: [] };
    const parsed = JSON.parse(raw) as { favorites?: unknown; compare?: unknown };
    return {
      favorites: Array.isArray(parsed.favorites)
        ? parsed.favorites.filter((item): item is string => typeof item === "string")
        : [],
      compare: Array.isArray(parsed.compare)
        ? parsed.compare.filter((item): item is string => typeof item === "string")
        : [],
    };
  } catch {
    return { favorites: [], compare: [] };
  }
}

function writeStorage(state: { favorites: string[]; compare: string[] }) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ favorites: state.favorites, compare: state.compare }),
    );
  } catch {
    /* ignore quota */
  }
}

export const useLibraryStore = create<LibraryState>((set) => ({
  favorites: [],
  compare: [],
  hydrated: false,
  setHydrated: (value) => set({ hydrated: value }),
  toggleFavorite: (slug) =>
    set((state) => ({
      favorites: state.favorites.includes(slug)
        ? state.favorites.filter((item) => item !== slug)
        : [...state.favorites, slug],
    })),
  toggleCompare: (slug) =>
    set((state) =>
      state.compare.includes(slug)
        ? { compare: state.compare.filter((item) => item !== slug) }
        : state.compare.length >= 4
          ? state
          : { compare: [...state.compare, slug] },
    ),
  clearCompare: () => set({ compare: [] }),
  removeCompare: (slug) =>
    set((state) => ({
      compare: state.compare.filter((item) => item !== slug),
    })),
}));

export function hydrateLibraryStore() {
  if (typeof window === "undefined") return;
  const stored = readStorage();
  useLibraryStore.setState({ ...stored, hydrated: true });
}

if (typeof window !== "undefined") {
  useLibraryStore.subscribe((state) => {
    if (state.hydrated) {
      writeStorage({ favorites: state.favorites, compare: state.compare });
    }
  });
}
