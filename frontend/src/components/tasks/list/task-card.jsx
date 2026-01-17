import {
  Button,
  Card,
  CardBody,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@heroui/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BsThreeDotsVertical } from 'react-icons/bs';

import TaskTypeChip from '@/components/tasks/task-type-chip.jsx';
import TaskDeadline from '@/components/tasks/task-deadline.jsx';
import TaskCheckbox from '@/components/tasks/task-checkbox.jsx';

export function TaskCard({ task }) {
  const [taskCompleted, setTaskCompleted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  const taskOnCompletedChange = (isCompleted) => {
    setTaskCompleted(isCompleted);
    // TODO: мб добавить больше анимаций и вывода инфы
  };

  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)');
    const update = () => setIsMobile(media.matches);
    update();

    if (media.addEventListener) {
      media.addEventListener('change', update);
      return () => media.removeEventListener('change', update);
    }

    media.addListener(update);
    return () => media.removeListener(update);
  }, []);

  return (
    <div className="w-full border-b border-default-50 last:border-b-0 md:border-0">
      <Card
        className="w-full rounded-none bg-transparent md:rounded-lg md:bg-content1"
        isHoverable={!isMobile}
        isPressable={!isMobile}
        shadow="none"
        onClick={() => {
          if (!isMobile) {
            navigate(`/tasks/${task.id}`);
          }
        }}
      >
        <CardBody className="relative">
          {isMobile && (
            <div className="absolute right-2 top-2">
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <Button
                    isIconOnly
                    aria-label="Действия"
                    size="sm"
                    variant="light"
                    disableAnimation
                  >
                    <BsThreeDotsVertical className="w-4 h-4" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownItem
                    key="view"
                    onPress={() => navigate(`/tasks/${task.id}`)}
                  >
                    Просмотр
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          )}
          <div className="flex">
            <TaskCheckbox
              className={task.archived ? 'hidden' : ''}
              task={task}
              onCompletedChange={taskOnCompletedChange}
            />
            <div className="w-full">
              <div>
                <span
                  className={
                    taskCompleted
                      ? 'with-line-through-animated with-line-through-animated--active'
                      : 'with-line-through-animated'
                  }
                >
                  {task.name}
                </span>
              </div>
              <div className="mt-5 flex justify-between">
                <TaskDeadline task={task} />
                <div className="flex gap-3">
                  <TaskTypeChip task={task} />
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
