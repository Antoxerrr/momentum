import {useState} from "react";
import {getAPI} from "@/core/api.js";
import {addToast} from "@heroui/react";
import {Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@heroui/react";
import {Button} from "@heroui/react";


export default function ArchiveConfirmModal({show, showChange, task, setTaskData}) {
  const [loading, setLoading] = useState(false);
  const onOpenChange = v => showChange(v);

  const sendRequest = async () => {
    setLoading(true);

    try {
      const { data } = await getAPI().tasks.archive(task.id);
      setTaskData(data);
      showChange(false);
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
    <Modal isOpen={show} onOpenChange={onOpenChange} size="md" placement="center">
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
