import {TaskCard} from "./task-card.jsx";
import {useEffect} from "react";
import {loadTasks} from "@/store/tasks.js";
import {useDispatch, useSelector} from "react-redux";
import { TasksToolbar } from "./tasks-toolbar.jsx";

export function TasksList() {
  const tasksList = useSelector(state => state.tasks.tasksList);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadTasks({current: true}));
  }, []);

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-1/2">
        <TasksToolbar/>
        <div className="flex flex-col gap-3">
          {tasksList.map(task => <TaskCard key={task.id} task={task}/>)}
        </div>
      </div>
    </div>
  )
}