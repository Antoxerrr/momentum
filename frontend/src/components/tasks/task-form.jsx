import { Form } from '@heroui/react';
import { Input, Textarea } from '@heroui/react';
import { useEffect, useState } from 'react';
import { Tabs, Tab } from '@heroui/react';
import { Button } from '@heroui/react';
import { addToast } from '@heroui/react';
import { Controller, useForm } from 'react-hook-form';
import { useShallow } from 'zustand/react/shallow';
import { useNavigate } from 'react-router-dom';

import { VALIDATION_MESSAGE_REQUIRED } from '@/core/const/common';
import { useTasksStore } from '@/store/tasks';
import { SlideDown } from '@/components/animations/slide-down';

const periodTabs = {
  DATE: 'DATE',
  DAILY: 'DAILY',
  WEEKLY: 'WEEKLY',
  MONTHLY: 'MONTHLY',
};

export function TaskForm({ setFormActive, taskData }) {
  const [addPenaltyTask, setAddPenaltyTask] = useState(false);
  const [selectedTaskType, setSelectedTaskType] = useState(periodTabs.DATE);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const isCreating = !taskData;

  const { createTask } = useTasksStore(
    useShallow((state) => ({
      createTask: state.createTask,
      editTask: state.editTask,
    })),
  );

  useEffect(() => {
    if (!isCreating) {
      reset({ name: 'fsgsdfgs' });
    }
  }, []);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)');
    const update = () => setIsMobile(media.matches);
    update();

    if (media.addEventListener) {
      media.addEventListener('change', update);
      return () => media.removeEventListener('change', update);
    }

    media.addListener(update);
    return () => media.removeListener(update);
  }, []);

  const { handleSubmit, control, reset } = useForm();

  const onSubmit = async (data) => {
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
        title: isCreating ? 'Задача создана' : 'Задача изменена',
        color: 'success',
      });
      if (isCreating) {
        setFormActive(false);
        reset();
      } else {
        navigate(`/tasks/${taskData.id}`, { replace: true });
      }
    } catch (error) {
      addToast({
        title: isCreating
          ? 'Ошибка при создании задачи'
          : 'Ошибка при редактировании задачи',
        color: 'danger',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form className="mb-5" onSubmit={handleSubmit(onSubmit)}>
      <Controller
        control={control}
        name="name"
        render={({
          field: { name, value, onChange, onBlur, ref },
          fieldState: { invalid, error },
        }) => (
          <Input
            ref={ref}
            isRequired
            autoComplete="off"
            className="flex"
            errorMessage={error?.message}
            isInvalid={invalid}
            label="Имя задачи"
            labelPlacement="inside"
            name={name}
            size="sm"
            type="text"
            validationBehavior="aria"
            value={value}
            onBlur={onBlur}
            onChange={onChange}
          />
        )}
        rules={{ required: VALIDATION_MESSAGE_REQUIRED }}
      />
      <Controller
        control={control}
        name="description"
        render={({
          field: { name, value, onChange, onBlur, ref },
          fieldState: { invalid, error },
        }) => (
          <Textarea
            ref={ref}
            className="mt-3"
            errorMessage={error?.message}
            isInvalid={invalid}
            label="Описание"
            name={name}
            validationBehavior="aria"
            value={value}
            onBlur={onBlur}
            onChange={onChange}
          />
        )}
      />
      <Tabs
        className="mt-3 w-full"
        classNames={{
          tabWrapper: "w-full",
        }}
        fullWidth={true}
        isVertical={isMobile}
        selectedKey={selectedTaskType}
        onSelectionChange={setSelectedTaskType}
      >
        <Tab key={periodTabs.DATE} title="Дата" />
        <Tab key={periodTabs.DAILY} title="Ежедневная" />
        <Tab key={periodTabs.WEEKLY} title="Еженедельная" />
        <Tab key={periodTabs.MONTHLY} title="Ежемесячная" />
      </Tabs>

      <SlideDown show={selectedTaskType === periodTabs.DATE}>
        <Controller
          control={control}
          name="date"
          render={({
            field: { name, value, onChange, onBlur, ref },
            fieldState: { invalid, error },
          }) => (
            <Input
              ref={ref}
              isRequired
              className="mt-3"
              errorMessage={error?.message}
              isInvalid={invalid}
              label="Дата"
              name={name}
              type="date"
              validationBehavior="aria"
              value={value}
              onBlur={onBlur}
              onChange={onChange}
            />
          )}
          rules={{ required: VALIDATION_MESSAGE_REQUIRED }}
        />
      </SlideDown>

      {addPenaltyTask ? (
        <p
          className="text-sm cursor-pointer text-primary hover:opacity-hover transition-opacity mt-2 select-none"
          onClick={() => setAddPenaltyTask(false)}
        >
          Удалить штрафную задачу
        </p>
      ) : (
        <p
          className="text-sm cursor-pointer text-primary hover:opacity-hover transition-opacity mt-2 select-none"
          onClick={() => setAddPenaltyTask(true)}
        >
          Добавить штрафную задачу
        </p>
      )}

      <SlideDown show={addPenaltyTask}>
        <Controller
          control={control}
          name="penalty_task.name"
          render={({
            field: { name, value, onChange, onBlur, ref },
            fieldState: { invalid, error },
          }) => (
            <Input
              ref={ref}
              isRequired
              autoComplete="off"
              className="flex mt-3"
              errorMessage={error?.message}
              isInvalid={invalid}
              label="Имя штрафной задачи"
              labelPlacement="inside"
              name={name}
              size="sm"
              type="text"
              validationBehavior="aria"
              value={value}
              onBlur={onBlur}
              onChange={onChange}
            />
          )}
          rules={{ required: VALIDATION_MESSAGE_REQUIRED }}
        />
        <Controller
          control={control}
          name="penalty_task.description"
          render={({
            field: { name, value, onChange, onBlur, ref },
            fieldState: { invalid, error },
          }) => (
            <Textarea
              ref={ref}
              className="mt-3"
              errorMessage={error?.message}
              isInvalid={invalid}
              label="Описание штрафной задачи"
              name={name}
              validationBehavior="aria"
              value={value}
              onBlur={onBlur}
              onChange={onChange}
            />
          )}
        />
      </SlideDown>

      <Button
        className="w-full mt-3 shadow-md"
        color="primary"
        isLoading={loading}
        type="submit"
        variant="shadow"
      >
        Создать
      </Button>
    </Form>
  );
}
