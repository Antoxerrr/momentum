import { Checkbox } from "@heroui/checkbox";
import { Card, CardBody } from "@heroui/card";
import { useState } from "react";
import {useNavigate} from "react-router-dom";
import TaskTypeChip from "@/components/tasks/task-type-chip.jsx";
import TaskDeadline from "@/components/tasks/task-deadline.jsx";


export function TaskCard({task}) {
  const [showDetails, setShowDetails] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="w-full">
      <Card shadow="none" isHoverable={true} isPressable={true} onPress={() => {navigate(`/tasks/${task.id}`)}} className="w-full">
        <CardBody>
          <div className="flex">
            <div className={task.archived ? "hidden" : ""}>
              <Checkbox radius="full" size="lg"></Checkbox>
            </div>
            <div className="w-full">
              <div>
                {task.name}
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
