import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {getAPI} from "@/core/api.js";
import {Fade} from "@/components/animations/fade.jsx";
import {Card, CardBody, CardFooter, CardHeader} from "@heroui/card";
import {FaArchive, FaArrowLeft} from "react-icons/fa";
import TaskCheckbox from "@/components/tasks/task-checkbox.jsx";
import TaskTypeChip from "@/components/tasks/task-type-chip.jsx";
import TaskDeadline from "@/components/tasks/task-deadline.jsx";
import {VscListSelection} from "react-icons/vsc";
import {IoIosWarning} from "react-icons/io";
import {Button} from "@heroui/button";
import ArchiveConfirmModal from "@/components/tasks/details/archive-confirm-modal.jsx";
import TaskDetailsSkeleton from "@/components/tasks/details/task-details-skeleton.jsx";
import {FaPencil} from "react-icons/fa6";

export default function TaskDetailsContainer() {
  const { taskId } = useParams();
  const navigate = useNavigate();

  const [taskData, setTaskData] = useState(null);
  const [taskCompleted, setTaskCompleted] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);

  useEffect(() => {
    getAPI().tasks.retrieve(taskId).then(({ data }) => { setTaskData(data) });
  }, []);

  const taskOnCompletedChange = (isCompleted, data) => {
    setTaskCompleted(isCompleted);
    // TODO: мб добавить больше анимаций и вывода инфы
  };

  if (!taskData) {
    return (
      <>
        <Fade show={true} duration={0.7}>
          <TaskDetailsSkeleton/>
        </Fade>
      </>
    );
  }

  return (
    <Card>
      <CardHeader className="flex-col items-start px-0 pb-4 bg-content2">
        <div className="border-b border-default-200 w-full pb-3 px-2">
          <div className="flex justify-between items-center w-full px-2 text-default-400">
            <div
              className="flex gap-2 items-center cursor-pointer font-medium hover:text-default-300 transition-all"
              onClick={() => navigate(-1)}
            >
              <FaArrowLeft/>
              Назад
            </div>
            {taskData.archived && (
              <div className="text-warning-300">
                Архивная задача
              </div>
            )}
          </div>
        </div>

        <div className="p-6 pb-0 w-full">
          <div className="flex gap-2">
            <TaskCheckbox className="pt-[7px]" task={taskData} onCompletedChange={taskOnCompletedChange}/>
            <h1 className="text-2xl font-medium py-1 px-2 ms-[-12px]">
              <span
                className={taskCompleted ? "with-line-through-animated with-line-through-animated--active" : "with-line-through-animated"}
              >
                {taskData.name}
              </span>
            </h1>
          </div>

          <div className="flex gap-3 mt-3 px-[2.18rem]">
            <TaskTypeChip task={taskData}/>
            <TaskDeadline task={taskData}/>
          </div>
        </div>
      </CardHeader>
      <CardBody className="p-5 pt-1 bg-content1">
        <div className="px-10 mt-3">
          <div>
            <div className="font-medium relative text-lg">
              Описание
              <VscListSelection className="text-xl absolute top-[2px] left-[-35px]"/>
            </div>

            <div className="py-3">
              <div className="min-h-20 py-1 px-2 ms-[-7px]">
                {taskData.description ? (
                  <p className="whitespace-pre-line">{ taskData.description }</p>
                ) : (
                  <p className="text-default-400">Без описания</p>
                )}
              </div>
            </div>

            <div className="font-medium relative mt-3 text-lg">
              Штрафная задача
              <IoIosWarning className="text-xl absolute top-[2px] left-[-34px] text-danger-400 opacity-85"/>
            </div>
            {taskData.penalty_task ? (
              <div className="mt-5">
                <h1 className="font-medium py-1 px-2 ms-[-7px] w-fit">
                  { taskData.penalty_task.name }
                </h1>
                <div className="font-medium relative mt-5 text-lg">
                  Описание штрафной задачи
                  <VscListSelection className="text-xl absolute top-[2px] left-[-35px]"/>
                </div>
                <div className="min-h-20 py-1 px-2 ms-[-7px] mt-3">
                  {taskData.penalty_task.description ? (
                    <p className="whitespace-pre-line">{ taskData.penalty_task.description }</p>
                  ) : (
                    <p className="text-default-400">Без описания</p>
                  )}
                </div>
              </div>
            ) : (
              <div>
                НЕТ
              </div>
            )}
          </div>
        </div>
      </CardBody>
      {!taskData.archived && (
        <CardFooter className="px-0">
          <div className="flex w-full justify-center gap-3 p-3 pt-5 border-t border-default-100">
            <ArchiveConfirmModal
              task={taskData}
              setTaskData={setTaskData}
              show={showArchiveModal}
              showChange={setShowArchiveModal}
            />
            <Button
              color="warning"
              variant="solid"
              startContent={<FaArchive/>}
              className="w-56"
              onPress={() => setShowArchiveModal(true)}
            >
              В архив
            </Button>
            <Button
              color="primary"
              variant="solid"
              startContent={<FaPencil/>}
              className="w-56"
              onPress={() => setShowArchiveModal(true)}
            >
              Редактировать
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
