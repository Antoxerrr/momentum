import {BiError} from "react-icons/bi";
import {MdDateRange} from "react-icons/md";
import {formatDate, getUserTimeZone} from "@/core/utils.js";
import {Chip} from "@heroui/chip";

export default function TaskDeadline({ task }) {
  return (
    <Chip radius="sm" color={task.expired && !task.archived ? "danger" : "default"} variant="flat">
      <div className="flex justify-center items-center gap-1">
        {task.expired && !task.archived ? <BiError/> : <MdDateRange/>}
        {formatDate(task.actual_deadline, getUserTimeZone())}
      </div>
    </Chip>
  );
}
