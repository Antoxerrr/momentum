import { useState } from 'react';
import { addToast } from '@heroui/react';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react';
import { Button } from '@heroui/react';

import { getAPI } from '@/core/api.js';

export default function ArchiveConfirmModal({
  show,
  showChange,
  task,
  setTaskData,
}) {
  const [loading, setLoading] = useState(false);
  const onOpenChange = (v) => showChange(v);

  const sendRequest = async () => {
    setLoading(true);

    try {
      const { data } = await getAPI().tasks.archive(task.id);

      setTaskData(data);
      showChange(false);
    } catch {
      addToast({
        color: 'danger',
        title: 'Не удалось архивировать задачу',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={show}
      placement="center"
      size="md"
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Архивирование задачи
            </ModalHeader>
            <ModalBody>
              Поместить задачу в архив? Это действие нельзя отменить.
            </ModalBody>
            <ModalFooter className="w-full">
              <Button
                color="danger"
                loading={loading}
                size="sm"
                variant="solid"
                onPress={sendRequest}
              >
                В архив
              </Button>
              <Button
                color="primary"
                size="sm"
                variant="solid"
                onPress={onClose}
              >
                Отмена
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
