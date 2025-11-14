import { Chip } from '@heroui/react';

import { TASK_TYPE_COLOR_MAP, TASK_TYPE_NAME_MAP } from '@/core/const/tasks.js';

export default function TaskTypeChip({ task }) {
  return (
    <Chip
      color={task.period ? TASK_TYPE_COLOR_MAP[task.period] : 'default'}
      radius="sm"
      variant="flat"
    >
      {task.period ? TASK_TYPE_NAME_MAP[task.period] : 'Дата'}
    </Chip>
  );
}
