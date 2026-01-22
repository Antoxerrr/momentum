import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import DefaultLayout from '@/layouts/default.jsx';
import { Fade } from '@/components/animations/fade.jsx';
import { TaskForm } from '@/components/tasks/task-form.jsx';
import { getAPI } from '@/core/api.js';
import { setDocumentTitle } from '@/core/utils.js';
import LoadingSpinner from '@/components/loading-spinner.jsx';

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
      <div className="w-full flex flex-col items-center p-5 md:px-10 md:py-0">
        <div className="md:w-1/2 w-full">
          <Fade duration={0.5} show={true}>
            {taskData ? (
              <TaskForm taskData={taskData} />
            ) : (
              <div className="w-full flex justify-center py-12">
                <LoadingSpinner />
              </div>
            )}
          </Fade>
        </div>
      </div>
    </DefaultLayout>
  );
}
