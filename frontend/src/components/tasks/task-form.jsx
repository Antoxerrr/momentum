import {Form} from "@heroui/form";
import {Input, Textarea} from "@heroui/input";
import {useState} from "react";
import { SlideDown } from "@/components/animations/slide-down";
import { Tabs, Tab } from "@heroui/tabs";
import { Divider } from "@heroui/divider";
import { Button } from "@heroui/button";
import { addToast } from "@heroui/toast";
import { Controller, useForm } from "react-hook-form";
import { VALIDATION_MESSAGE_REQUIRED } from "@/core/const/common";
import { useTasksStore } from "@/store/tasks";
import { useShallow } from "zustand/react/shallow";

const periodTabs = {
  DATE: 'DATE',
  DAILY: 'DAILY',
  WEEKLY: 'WEEKLY',
  MONTHLY: 'MONTHLY',
};

export function TaskForm({formActive, setFormActive}) {
  const [addPenaltyTask, setAddPenaltyTask] = useState(false);
  const [selectedTaskType, setSelectedTaskType] = useState(periodTabs.DATE);
  const [loading, setLoading] = useState(false);

  const { createTask } = useTasksStore(
    useShallow(state => ({
      createTask: state.createTask
    }))
  );
  
  const {handleSubmit, control, reset} = useForm();

  const onSubmit = async data => {
    setLoading(true);

    if (selectedTaskType !== periodTabs.DATE) {
      data.period = selectedTaskType;
      data.date = undefined;
    }
    
    if (!addPenaltyTask) {
      data.penalty_task = undefined;
    }

    try {
      await createTask(data);

      addToast({
        title: 'Задача создана',
        color: 'success',
      });
      setFormActive(false);
      reset();
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
      <Form className="mb-5" onSubmit={handleSubmit(onSubmit)}>
        <Controller
          control={control}
          name="name"
          render={({field: {name, value, onChange, onBlur, ref}, fieldState: {invalid, error}}) => (
            <Input
              ref={ref}
              size="sm"
              type="text"
              autoComplete="off"
              className="flex"
              label="Имя задачи"
              labelPlacement="inside"
              isRequired
              errorMessage={error?.message}
              validationBehavior="aria"
              isInvalid={invalid}
              name={name}
              value={value}
              onBlur={onBlur}
              onChange={onChange}
            />
          )}
          rules={{required: VALIDATION_MESSAGE_REQUIRED}}
        />
        <Controller
          control={control}
          name="description"
          render={({field: {name, value, onChange, onBlur, ref}, fieldState: {invalid, error}}) => (
            <Textarea
              ref={ref}
              className="mt-3"
              label="Описание"
              errorMessage={error?.message}
              validationBehavior="aria"
              isInvalid={invalid}
              name={name}
              value={value}
              onBlur={onBlur}
              onChange={onChange}
            />
          )}
        />
        <Tabs className="mt-3" fullWidth={true} selectedKey={selectedTaskType} onSelectionChange={setSelectedTaskType}>
          <Tab key={periodTabs.DATE} title="Дата"></Tab>
          <Tab key={periodTabs.DAILY} title="Ежедневная"></Tab>
          <Tab key={periodTabs.WEEKLY} title="Еженедельная"></Tab>
          <Tab key={periodTabs.MONTHLY} title="Ежемесячная"></Tab>
        </Tabs>

        <SlideDown show={selectedTaskType === periodTabs.DATE}>
          <Controller
            control={control}
            name="date"
            render={({field: {name, value, onChange, onBlur, ref}, fieldState: {invalid, error}}) => (
              <Input
                ref={ref}
                type="date"
                className="mt-3"
                label="Дата"
                isRequired
                errorMessage={error?.message}
                validationBehavior="aria"
                isInvalid={invalid}
                name={name}
                value={value}
                onBlur={onBlur}
                onChange={onChange}
              />
            )}
            rules={{required: VALIDATION_MESSAGE_REQUIRED}}
          />
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
          <Controller
            control={control}
            name="penalty_task.name"
            render={({field: {name, value, onChange, onBlur, ref}, fieldState: {invalid, error}}) => (
              <Input
                ref={ref}
                size="sm"
                type="text"
                autoComplete="off"
                className="flex mt-3"
                label="Имя штрафной задачи"
                labelPlacement="inside"
                isRequired
                errorMessage={error?.message}
                validationBehavior="aria"
                isInvalid={invalid}
                name={name}
                value={value}
                onBlur={onBlur}
                onChange={onChange}
              />
            )}
            rules={{required: VALIDATION_MESSAGE_REQUIRED}}
          />
          <Controller
            control={control}
            name="penalty_task.description"
            render={({field: {name, value, onChange, onBlur, ref}, fieldState: {invalid, error}}) => (
              <Textarea
                ref={ref}
                className="mt-3"
                label="Описание штрафной задачи"
                errorMessage={error?.message}
                validationBehavior="aria"
                isInvalid={invalid}
                name={name}
                value={value}
                onBlur={onBlur}
                onChange={onChange}
              />
            )}
          />
        </SlideDown>

        <Button type="submit" color="primary" variant="shadow" className="w-full mt-3 shadow-md" isLoading={loading}>
          Создать
        </Button>
      </Form>
      <Divider className="mb-5"/>
    </SlideDown>
  )
}
