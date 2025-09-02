import {Form} from "@heroui/form";
import {Input, Textarea} from "@heroui/input";
import {useState} from "react";
import { SlideDown } from "../animations/slide-down";
import { Tabs, Tab } from "@heroui/tabs";
import { Divider } from "@heroui/divider";
import { Button } from "@heroui/button";
import { getAPI } from "@/core/api";
import { addToast } from "@heroui/toast";

const periodTabs = {
  DATE: 'DATE',
  DAILY: 'DAILY',
  WEEKLY: 'WEEKLY',
  MONTHLY: 'MONTHLY',
};

export function TaskForm({formActive, onTaskCreated}) {
  const [addPenaltyTask, setAddPenaltyTask] = useState(false);
  const [selectedTaskType, setSelectedTaskType] = useState(periodTabs.DATE);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const [formValid, validationErrors] = validateForm(data, selectedTaskType, addPenaltyTask);

    setErrors(validationErrors);
    if (!formValid) {
      setLoading(false);
      return;
    }

    const payload = {
      name: data.name,
      description: data.description || null
    };

    if (selectedTaskType === periodTabs.DATE) {
      payload.date = data.date;
    } else {
      payload.period = selectedTaskType;
    }

    if (addPenaltyTask) {
      payload.penalty_task = {
        name: data.penaltyName,
        description: data.penaltyDescription
      }
    }

    try {
      const api = getAPI();
      await api.tasks.create(payload);

      addToast({
        title: 'Задача создана',
        color: 'success',
      });
      onTaskCreated(payload);
    } catch (error) {
      addToast({
        title: 'Ошибка при создании задачи',
        color: 'danger',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <SlideDown show={formActive}>
      <Form className="mb-5" onSubmit={onSubmit} validationErrors={errors}>
        <Input
          label="Имя задачи"
          labelPlacement="inside"
          name="name"
          size="sm"
          type="text"
          autoComplete="off"
          className="flex"
        />
        <Textarea 
          label="Описание"
          name="description"
          className="mt-3"
        />
        <Tabs className="mt-3" fullWidth={true} selectedKey={selectedTaskType} onSelectionChange={setSelectedTaskType}>
          <Tab key={periodTabs.DATE} title="Дата"></Tab>
          <Tab key={periodTabs.DAILY} title="Ежедневная"></Tab>
          <Tab key={periodTabs.WEEKLY} title="Еженедельная"></Tab>
          <Tab key={periodTabs.MONTHLY} title="Ежемесячная"></Tab>
        </Tabs>

        <SlideDown show={selectedTaskType === periodTabs.DATE}>
          
          <Input type="date" name="date" label="Дата" className="mt-3"/>
        </SlideDown>

        {
          addPenaltyTask ?
          <p 
            className="text-sm cursor-pointer text-primary hover:opacity-hover transition-opacity mt-2 select-none"
            onClick={() => setAddPenaltyTask(false)}
          >
            Удалить штрафную задачу
          </p>
          :
          <p 
            className="text-sm cursor-pointer text-primary hover:opacity-hover transition-opacity mt-2 select-none"
            onClick={() => setAddPenaltyTask(true)}
          >
            Добавить штрафную задачу
          </p>
        }

        <SlideDown show={addPenaltyTask}>
          <PenaltyTaskFields/>
        </SlideDown>

        <Button type="submit" color="primary" variant="shadow" className="w-full mt-3 shadow-md">
          Создать
        </Button>
      </Form>
      <Divider className="mb-5"/>
    </SlideDown>
  )
}

function PenaltyTaskFields() {
  return (
    <>
      <Input
        label="Имя задачи"
        labelPlacement="inside"
        name="penaltyName"
        size="sm"
        type="text"
        autoComplete="off"
        className="flex mt-3"
      />
      <Textarea 
        label="Описание"
        name="penaltyDescription"
        className="mt-3"
      />
    </>
  )
}

function validateForm(data, taskType, addPenaltyTask) {
  const errors = {};
  if (!data.name) {
    errors.name = 'Обязательное поле';
  }

  if (taskType === periodTabs.DATE && !data.date) {
    errors.date = "Обязательное поле";
  }

  if (addPenaltyTask && !data.penaltyName) {
    errors.penaltyName = "Обязательное поле";
  }

  return [Object.keys(errors).length === 0, errors]
}
