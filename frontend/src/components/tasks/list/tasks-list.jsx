import { useEffect } from 'react';
import { TbServerOff } from 'react-icons/tb';
import { IoMdDoneAll } from 'react-icons/io';
import { useShallow } from 'zustand/react/shallow';
import { Skeleton } from '@heroui/react';

import { TasksToolbar } from './tasks-toolbar.jsx';
import { TaskCard } from './task-card.jsx';

import { useTasksStore } from '@/store/tasks.js';
import { Fade } from '@/components/animations/fade.jsx';

export function TasksList() {
  return (
    <div className="w-full flex flex-col items-center">
      <div className="lg:w-1/2 md:w-2/3 w-full">
        <Fade duration={0.5} show={true}>
          <TasksToolbar />
          <TasksContainer />
        </Fade>
      </div>
    </div>
  );
}

function TasksContainer() {
  const { tasks, error, loading, loadTasksForCurrentTab, currentTab } = useTasksStore(
    useShallow((state) => ({
      tasks: state.tasks,
      error: state.error,
      loading: state.listLoading,
      loadTasksForCurrentTab: state.loadTasksForCurrentTab,
      currentTab: state.currentTab,
    })),
  );

  useEffect(() => {
    loadTasksForCurrentTab();
  }, []);

  if (loading) {
    return (
      <Fade duration={0.7} show={loading}>
        <div className="flex flex-col gap-3">
          <Skeleton className="rounded-lg h-20" />
          <Skeleton className="rounded-lg h-20" />
          <Skeleton className="rounded-lg h-20" />
          <Skeleton className="rounded-lg h-20" />
        </div>
      </Fade>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center mt-36">
        <TbServerOff className="text-[6rem] text-danger-200" />
        <p className="mt-3 text-lg">Не удалось загрузить список задач :(</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div>
        <div className="flex flex-col items-center justify-center mt-36">
          <IoMdDoneAll className="text-[6rem] text-success-400" />
          <p className="mt-3 text-lg">На сегодня всё!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:gap-3">
      <span>12345246</span>
      {currentTab === 'archived' && tasks.length > 0 && (
        <div className="text-center text-sm text-default-400 mb-3">
          В архиве отображаются только последние <b>15</b> архивных задач
        </div>
      )}
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}
