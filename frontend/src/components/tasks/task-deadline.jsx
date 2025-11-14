import { BiError } from 'react-icons/bi';
import { MdDateRange } from 'react-icons/md';
import { Chip } from '@heroui/react';

import { formatDate, getUserTimeZone } from '@/core/utils.js';

export default function TaskDeadline({ task }) {
  return (
    <Chip
      color={task.expired && !task.archived ? 'danger' : 'default'}
      radius="sm"
      variant="flat"
    >
      <div className="flex justify-center items-center gap-1">
        {task.expired && !task.archived ? <BiError /> : <MdDateRange />}
        {formatDate(task.actual_deadline, getUserTimeZone(), task.archived)}
      </div>
    </Chip>
  );
}
