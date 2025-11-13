import {TaskCard} from "./task-card.jsx";
import {useEffect} from "react";
import { TasksToolbar } from "./tasks-toolbar.jsx";
import { useTasksStore } from "@/store/tasks.js";
import { TbServerOff } from "react-icons/tb";
import { IoMdDoneAll } from "react-icons/io";
import { useShallow } from 'zustand/react/shallow';
import { Skeleton } from "@heroui/react";
import { Fade } from "@/components/animations/fade.jsx";


export function TasksList() {
  return (
    <div className="w-full flex flex-col items-center">
      <div className="lg:w-1/2 md:w-2/3 w-full">
        <Fade show={true} duration={0.5}>
          <TasksToolbar/>
          <TasksContainer/>
        </Fade>
      </div>
    </div>
  )
}

function TasksContainer() {
  const { tasks, error, loading, loadTasksForCurrentTab } = useTasksStore(
    useShallow(state => ({
      tasks: state.tasks,
      error: state.error,
      loading: state.listLoading,
      loadTasksForCurrentTab: state.loadTasksForCurrentTab
    }))
  );

  useEffect(() => {
    loadTasksForCurrentTab();
  }, []);

  if (loading) {
    return (
      <Fade show={loading} duration={0.7}>
        <div className="flex flex-col gap-3">
          <Skeleton className="rounded-lg h-20"/>
          <Skeleton className="rounded-lg h-20"/>
          <Skeleton className="rounded-lg h-20"/>
          <Skeleton className="rounded-lg h-20"/>
        </div>
      </Fade>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center mt-36">
        <TbServerOff className="text-[6rem] text-danger-200"/>
        <p className="mt-3 text-lg">Не удалось загрузить список задач :(</p>
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div>
        <div className="flex flex-col items-center justify-center mt-36">
          <IoMdDoneAll className="text-[6rem] text-success-400"/>
          <p className="mt-3 text-lg">На сегодня всё!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {tasks.map(task => <TaskCard key={task.id} task={task}/>)}
    </div>
  )
}