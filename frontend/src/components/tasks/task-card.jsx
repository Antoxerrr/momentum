import {Checkbox} from "@heroui/checkbox";
import {Divider} from "@heroui/divider";
import {Card, CardBody} from "@heroui/card";
import {MdDateRange} from "react-icons/md";
import { useSelector } from "react-redux";
import { DateTime } from "luxon";
import { getUserTimeZone } from "@/core/utils";

export function TaskCard({task}) {
  const userAccount = useSelector(state => state.user.account);

  return (
    <>
      <Card shadow="none" isHoverable={true} isPressable={true} onPress={() => {console.log(1)}}>
        <CardBody>
          <div className="flex">
            <div>
              <Checkbox radius="full" size="lg"></Checkbox>
            </div>
            <div>
              <div>
                {task.name}
              </div>
              <div className="mt-2">
                <p className="text-default-400 inline-flex items-center gap-1">
                  <MdDateRange/>
                  {formatDate(task.actual_deadline, getUserTimeZone())}
                </p>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  )
}

function formatDate(dateString, timezone) {
  const today = DateTime.fromISO(new Date().toISOString(), {zone: timezone});
  const taskDate = DateTime.fromISO(dateString, { zone: timezone });

  if (taskDate.toISODate() === today.toISODate()) {
    return 'Сегодня';
  }

  return taskDate.setLocale('ru').toLocaleString({
    month: 'long',
    year: 'numeric',
    day: 'numeric',
  }).replace(' г.', '');
}
