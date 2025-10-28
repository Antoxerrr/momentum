import { Card, CardBody } from "@heroui/card";
import { useState } from "react";
import {useNavigate} from "react-router-dom";
import TaskTypeChip from "@/components/tasks/task-type-chip.jsx";
import TaskDeadline from "@/components/tasks/task-deadline.jsx";
import TaskCheckbox from "@/components/tasks/task-checkbox.jsx";


export function TaskCard({ task }) {
  const [taskCompleted, setTaskCompleted] = useState(false);
  const navigate = useNavigate();

  const taskOnCompletedChange = (isCompleted, data) => {
    setTaskCompleted(isCompleted);
    // TODO: мб добавить больше анимаций и вывода инфы
  };

  return (
    <div className="w-full">
      <Card shadow="none" isHoverable={true} isPressable={true} onPress={() => {navigate(`/tasks/${task.id}`)}} className="w-full">
        <CardBody>
          <div className="flex">
            <TaskCheckbox
              className={task.archived ? "hidden" : ""}
              task={task}
              onCompletedChange={taskOnCompletedChange}
            />
            <div className="w-full">
              <div>
                <span
                  className={taskCompleted ? "with-line-through-animated with-line-through-animated--active" : "with-line-through-animated"}
                >
                  {task.name}
                </span>
              </div>
              <div className="mt-2 flex justify-between">
                <TaskDeadline task={task}/>
                <div className="flex gap-3">
                  <TaskTypeChip task={task}/>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
