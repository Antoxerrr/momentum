import {TaskCard} from "./task-card.jsx";
import {useEffect} from "react";
import {getSortedActualTasks, loadTasks} from "@/store/tasks.js";
import {useDispatch, useSelector} from "react-redux";
import {Divider} from "@heroui/divider";
import {TaskForm} from "@/components/tasks/task-form.jsx";

export function TasksList() {
  const sortedActualTasks = useSelector(getSortedActualTasks);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadTasks());
  }, []);

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-1/2">
        <TaskForm/>
        <Divider/>
        {sortedActualTasks.map(task => <TaskCard key={task.id} task={task}/>)}
      </div>
    </div>
  )
}