import DefaultLayout from "@/layouts/default.jsx";
import {Fade} from "@/components/animations/fade.jsx";
import TaskDetailsContainer from "@/components/tasks/details/task-details-container.jsx";
import {TaskForm} from "@/components/tasks/task-form.jsx";
import {useEffect, useState} from "react";
import {getAPI} from "@/core/api.js";
import {useNavigate, useParams} from "react-router-dom";

export default function TaskEditPage() {
  const { taskId } = useParams();
  const [taskData, setTaskData] = useState(null);

  useEffect(() => {
    getAPI().tasks.retrieve(taskId).then(({ data }) => { setTaskData(data) });
  }, []);

  return (
    <DefaultLayout>
      <div className="w-full flex flex-col items-center">
        <div className="md:w-1/2 w-full">
          <Fade show={true} duration={0.5}>
            <TaskForm taskData={taskData}/>
          </Fade>
        </div>
      </div>
    </DefaultLayout>
  );
}
