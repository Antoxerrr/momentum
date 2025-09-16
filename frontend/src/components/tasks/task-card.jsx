import { Checkbox } from "@heroui/checkbox";
import { Card, CardBody } from "@heroui/card";
import { BiError } from "react-icons/bi";
import { MdDateRange } from "react-icons/md";
import { DateTime } from "luxon";
import { getUserTimeZone } from "@/core/utils";
import { Chip } from "@heroui/chip";
import { TASK_TYPE_COLOR_MAP, TASK_TYPE_NAME_MAP } from "@/core/const/tasks";
import { useState } from "react";
import { Button } from "@heroui/button";
import { RiEdit2Fill } from "react-icons/ri";
import { FaArchive } from "react-icons/fa";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/modal";
import { useMediaQuery } from "react-responsive";
import { getAPI } from "@/core/api";
import { addToast } from "@heroui/toast";


export function TaskCard({task}) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="w-full">
      <Card shadow="none" isHoverable={true} isPressable={true} onPress={() => {setShowDetails(true)}} className="w-full">
        <CardBody>
          <div className="flex">
            <div className={task.archived ? "hidden" : ""}>
              <Checkbox radius="full" size="lg"></Checkbox>
            </div>
            <div className="w-full">
              <div>
                {task.name}
              </div>
              <div className="mt-2 flex justify-between">
                <p className={`${task.expired && !task.archived ? "text-danger-400" : "text-default-400"} inline-flex items-center gap-1`}>
                  {task.expired && !task.archived ? <BiError/> : <MdDateRange/>}
                  {formatDate(task.actual_deadline, getUserTimeZone())}
                </p>
                <div className="flex gap-3">
                  <Chip radius="sm" color={task.period ? TASK_TYPE_COLOR_MAP[task.period] : "default"} variant="flat">
                    {task.period ? TASK_TYPE_NAME_MAP[task.period] : "Дата"}
                  </Chip>
                </div>
              </div>
            </div>
          </div>
          <TaskDetailsModal show={showDetails} showChange={setShowDetails} task={task}/>
        </CardBody>
      </Card>
    </div>
  )
}


function TaskDetailsModal({show, showChange, task}) {
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
  const isMobile = useMediaQuery({ query: '(max-width: 640px)' })
  const onOpenChange = v => showChange(v);
  const onTaskArchived = () => showChange(false);

  return (
    <Modal
      isOpen={show}
      onOpenChange={onOpenChange}
      size={isMobile ? "full" : "lg"}
      placement="center"
      backdrop="blur"
      disableAnimation={true}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Просмотр задачи</ModalHeader>
            <ModalBody>
              <p className="my-1 font-semibold">{task.name}</p>
              {
                task.description ?
                <p className="whitespace-pre-line">{task.description}</p> :
                <p className="text-default-400">Описание отсутствует</p>
              }
            </ModalBody>
            <ModalFooter className="w-full">
              <div className="w-full flex justify-between">
                <div>
                  <Button color="danger" variant="light" size="sm" onPress={onClose}>
                    Закрыть
                  </Button>
                </div>
                <div className={task.archived ? "hidden" : "flex gap-3"}>
                   <Button color="danger" variant="solid" size="sm" startContent={<FaArchive/>} onPress={() => setShowArchiveConfirm(true)}>
                    В архив
                  </Button>
                  <Button color="primary" variant="solid" size="sm" startContent={<RiEdit2Fill/>}>
                    Редактировать
                  </Button>
                </div>
              </div>
              <ArchiveConfirmModal
                show={showArchiveConfirm}
                showChange={setShowArchiveConfirm}
                task={task}
                onTaskArchived={onTaskArchived}
              />
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}


function ArchiveConfirmModal({show, showChange, task, onTaskArchived}) {
  const [loading, setLoading] = useState(false);
  const onOpenChange = v => showChange(v);

  const sendRequest = async () => {
    setLoading(true);

    try {
      const api = getAPI();
      await api.tasks.archive(task.id);
      showChange(false);
      onTaskArchived();
    } catch {
      addToast({
        color: 'danger',
        title: 'Не удалось архивировать задачу'
      })
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={show} onOpenChange={onOpenChange} size="md" placement="center" disableAnimation={true}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Архивирование задачи</ModalHeader>
            <ModalBody>
              Поместить задачу в архив? Это действие нельзя отменить.
            </ModalBody>
            <ModalFooter className="w-full">
              <Button color="danger" variant="solid" size="sm" loading={loading} onPress={sendRequest}>
                В архив
              </Button>
              <Button color="primary" variant="solid" size="sm" onPress={onClose}>
                Отмена
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}


function formatDate(dateString, timezone) {
  const today = DateTime.fromISO(new Date().toISOString(), {zone: timezone});
  const taskDate = DateTime.fromISO(dateString, { zone: timezone });

  if (taskDate.toISODate() === today.toISODate()) {
    return 'Сегодня';
  }

  const dateFormatted = taskDate.setLocale('ru').toLocaleString({
    month: 'short',
    year: 'numeric',
    day: 'numeric',
  }).replace(' г.', '');

  return taskDate > today ? `До ${dateFormatted}` : dateFormatted;
}
