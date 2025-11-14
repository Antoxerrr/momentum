import { useEffect } from 'react';

import DefaultLayout from '@/layouts/default';
import { TasksList } from '@/components/tasks/list/tasks-list.jsx';
import { setDocumentTitle } from '@/core/utils.js';

export default function TasksPage() {
  useEffect(() => {
    setDocumentTitle('Список задач');
  }, []);

  return (
    <DefaultLayout>
      <TasksList />
    </DefaultLayout>
  );
}
