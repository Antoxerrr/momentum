import { getAPI } from '@/core/api';
import { TASKS_LIST_TABS } from '@/core/const/tasks';
import { create } from 'zustand';

const tabsToFilters = {
  [TASKS_LIST_TABS.CURRENT]: {
    current: true
  },
  [TASKS_LIST_TABS.UPCOMING]: {
    current: false
  },
  [TASKS_LIST_TABS.ARCHIVED]: {
    archived: true
  }
};

const defaultState = {
  tasks: [],
  listLoading: false,
  currentTab: TASKS_LIST_TABS.CURRENT,
  error: false,
};

export const useTasksStore = create((set, get) => ({
  ...defaultState,
  setTab: (tab) => set({currentTab: tab}),
  clearState: () => set({...defaultState}),
  loadTasksForCurrentTab: async () => {
    const state = get();
    set({listLoading: true, error: false});
    const filters = tabsToFilters[state.currentTab];

    try {
        const { data } = await getAPI().tasks.list(filters);
        set({tasks: data});
    } catch (e) {
        set({error: true, tasks: []});
    } finally {
        set({listLoading: false});
    }
  },
  createTask: async (data) => {
    await getAPI().tasks.create(data);

    let targetTab = TASKS_LIST_TABS.CURRENT;
    
    if (data.period) {
      targetTab = TASKS_LIST_TABS.CURRENT;
    } else if (data.date) {
      const taskDate = new Date(data.date);
      const today = new Date();
      
      today.setHours(0, 0, 0, 0);
      taskDate.setHours(0, 0, 0, 0);
      
      if (taskDate > today) {
        targetTab = TASKS_LIST_TABS.UPCOMING;
      }
    }

    set({ currentTab: targetTab });

    await get().loadTasksForCurrentTab();
  },
  editTask: async (taskId, data) => {
    await getAPI().tasks.update(taskId, data);
  },
}));