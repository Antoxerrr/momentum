import {Form} from "@heroui/form";
import {Input, Textarea} from "@heroui/input";
import {useState} from "react";
import {motion, AnimatePresence} from "framer-motion";

const DEFAULT_NAME_FIELD_LABEL = 'Создать задачу';
const FOCUSED_NAME_FIELD_LABEL = 'Имя задачи';
const FORM_DEFAULT_TASK = {
  name: '',
  description: '',
  date: '',
  period: ''
};
const FORM_DEFAULT = {
  ...FORM_DEFAULT_TASK,
  penalty_task: null
};

export function TaskForm() {
  const [nameFieldLabel, setNameFieldLabel] = useState(DEFAULT_NAME_FIELD_LABEL);
  const [taskCreation, setTaskCreation] = useState(false);
  const [formData, setFormData] = useState(FORM_DEFAULT);

  const nameFieldOnFocus = () => {
    setNameFieldLabel(FOCUSED_NAME_FIELD_LABEL);
    setTaskCreation(true);
  };
  const nameFieldOnBlur = () => {
    setNameFieldLabel(DEFAULT_NAME_FIELD_LABEL);
    setTaskCreation(false);
  };

  return (
    <Form className="mb-5">
      <Input
        label={nameFieldLabel}
        labelPlacement="inside"
        name="name"
        size="sm"
        type="text"
        autoComplete="off"
        onFocus={nameFieldOnFocus}
        onBlur={nameFieldOnBlur}
      />
      <AnimatePresence>
        {taskCreation && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <Textarea label="Описание" className="mt-3"/>
            <Input type="date" label="Дата" className="mt-3" />
          </motion.div>
        )}
      </AnimatePresence>
    </Form>
  )
}
