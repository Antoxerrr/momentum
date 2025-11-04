import {create} from "zustand";
import {getAPI} from "@/core/api.js";
import {debounce} from "@/core/utils.js";


const defaultState = {
  listLoading: false,
  listLoadingError: false,

  snippets: [],
  categories: [],

  selectedCategories: [],
  queryString: '',
};

export const useSnippetsStore = create((set, get) => ({
  ...defaultState,

  clearState: () => {
    set(defaultState);
  },

  setQueryString: query => {
    set({queryString: query});
    get().debouncedLoadSnippets();
  },

  clearSelectedCategories: () => {
    set({selectedCategories: []});
    get().debouncedLoadSnippets();
  },

  switchCategory: categoryId => {
    const state = get();
    const categories = state.selectedCategories;
    const idx = state.selectedCategories.indexOf(categoryId);

    if (idx === -1) {
      set({selectedCategories: [...categories, categoryId]});
    } else {
      categories.splice(idx, 1);
      set({selectedCategories: categories});
    }

    state.debouncedLoadSnippets();
  },

  debouncedLoadSnippets: debounce(() => {
    get().loadSnippets();
  }, 400),

  loadSnippets: async () => {
    const state = get();
    set({listLoading: true, listLoadingError: false});
    const filters = {};

    if (state.selectedCategories.length > 0) {
      filters.category = state.selectedCategories;
    }

    if (state.queryString.length > 0) {
      filters.search = state.queryString;
    }

    try {
        const { data } = await getAPI().snippets.list(filters);
        set({snippets: data});
    } catch (e) {
        set({listLoadingError: true, snippets: []});
    } finally {
        set({listLoading: false});
    }
  },

  loadCategories: async () => {
    const { data } = await getAPI().snippetsCategories.list();
    set({categories: data});
  },
}));