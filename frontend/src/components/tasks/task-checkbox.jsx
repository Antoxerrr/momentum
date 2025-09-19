import {Checkbox} from "@heroui/checkbox";
import {useState} from "react";
import {getAPI} from "@/core/api.js";

export default function TaskCheckbox({ task, className, onCompletedChange }) {
  const [isSelected, setIsSelected] = useState(false);

  const selectedChange = (newIsSelected) => {
    if (newIsSelected === isSelected) {
      return;
    }

    setIsSelected(newIsSelected);

    try {
      const api = getAPI();
      const { data } = newIsSelected ?
        api.tasks.complete(task.id) :
        api.tasks.undoComplete(task.id);

      onCompletedChange(newIsSelected, data);
    } catch (error) {
      setIsSelected(!newIsSelected);
    }
  };

  return (
    <div className={className || ""}>
      <Checkbox
        radius="full"
        size="lg"
        isDisabled={task.archived}
        isSelected={isSelected}
        onValueChange={selectedChange}
      ></Checkbox>
    </div>
  )
}
