import { createSlice } from '@reduxjs/toolkit'
import { getAPI } from "@/core/api.js";
import { getUserTimeZone } from '@/core/utils';

export const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    tasksList: [],
    loading: false
  },
  reducers: {
    setTasks(state, {payload}) {
      state.tasksList = payload.tasks;
    },

    setLoading(state, {payload}) {
      console.log(payload)
    }
  }
});

export function loadTasks(filters) {
  return async function (dispatch) {
    tasksSlice.actions.setLoading(true);

    try {
      const response = await getAPI().tasks.list({...filters, tz: getUserTimeZone()});
      dispatch(tasksSlice.actions.setTasks({tasks: response.data}));
    } catch (e) {
      throw e;
    } finally {
      tasksSlice.actions.setLoading(false);
    }
  }
}

export const { setTasks } = tasksSlice.actions;

export default tasksSlice.reducer;
