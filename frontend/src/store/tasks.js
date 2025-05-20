import {createSelector, createSlice} from '@reduxjs/toolkit'
import {getAPI} from "@/core/api.js";

export const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    actualTasks: [],
    archivedTasks: [],
  },
  reducers: {
    setTasks(state, {payload}) {
      const {tasks, archived} = payload;
      if (archived) {
        state.archivedTasks = tasks;
      } else {
        state.actualTasks = tasks;
      }
    }
  }
});

export function loadTasks(archived = false) {
  return async function fetchTodoByIdThunk(dispatch) {
    const api = getAPI();
    const response = await api.tasks.list();
    dispatch(tasksSlice.actions.setTasks({tasks: response.data, archived}))
  }
}

const getActualTasks = state => state.tasks.actualTasks;

export const getSortedActualTasks = createSelector(
  [getActualTasks],
  tasks => {
    return [...tasks].sort((a, b) => {
      return new Date(a.actual_deadline) - new Date(b.actual_deadline);
    });
  }
);

export const { setTasks } = tasksSlice.actions;

export default tasksSlice.reducer;
