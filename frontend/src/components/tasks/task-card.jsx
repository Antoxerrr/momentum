import {Checkbox} from "@heroui/checkbox";
import {Divider} from "@heroui/divider";

export function TaskCard({task}) {
  return (
    <>
      <div className="flex my-4">
        <div>
          <Checkbox radius="full" size="lg"></Checkbox>
        </div>
        <div>
          <div>
            {task.name}
          </div>
          <div className="mt-2">
            <p className="text-default-400">
              {formatDate(task.actual_deadline)}
            </p>
          </div>
        </div>
      </div>
      <Divider/>
    </>
  )
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleString('ru', {
    month: 'long',
    year: 'numeric',
    day: 'numeric'
  }).replace(' г.', '');
}
