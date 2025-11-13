import {TASK_TYPE_COLOR_MAP, TASK_TYPE_NAME_MAP} from "@/core/const/tasks.js";
import { Chip } from "@heroui/react";

export default function TaskTypeChip({ task }) {
  return (
    <Chip radius="sm" color={task.period ? TASK_TYPE_COLOR_MAP[task.period] : "default"} variant="flat">
      {task.period ? TASK_TYPE_NAME_MAP[task.period] : "Дата"}
    </Chip>
  )
}
