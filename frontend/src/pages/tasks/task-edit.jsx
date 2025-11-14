import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import DefaultLayout from '@/layouts/default.jsx';
import { Fade } from '@/components/animations/fade.jsx';
import { TaskForm } from '@/components/tasks/task-form.jsx';
import { getAPI } from '@/core/api.js';
import { setDocumentTitle } from '@/core/utils.js';

export default function TaskEditPage() {
  const { taskId } = useParams();
  const [taskData, setTaskData] = useState(null);

  useEffect(() => {
    getAPI()
      .tasks.retrieve(taskId)
      .then(({ data }) => {
        setTaskData(data);
      });
    setDocumentTitle('Редактирование задачи');
  }, []);

  return (
    <DefaultLayout>
      <div className="w-full flex flex-col items-center">
        <div className="md:w-1/2 w-full">
          <Fade duration={0.5} show={true}>
            <TaskForm taskData={taskData} />
          </Fade>
        </div>
      </div>
    </DefaultLayout>
  );
}
