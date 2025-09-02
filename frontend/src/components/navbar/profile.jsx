import { getAPI } from "@/core/api";
import { Button } from "@heroui/button"
import { Form } from "@heroui/form"
import { Input } from "@heroui/input";
import { Modal, ModalHeader, ModalBody, ModalFooter, ModalContent } from "@heroui/modal"
import { Select, SelectItem } from "@heroui/select";
import { addToast } from "@heroui/toast";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export function UserProfileModal({isOpen, onClose}) {
  return (
    <Modal isOpen={isOpen} size="md" onClose={onClose}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Профиль</ModalHeader>
        <ModalBody>
          <UserProfileForm onClose={onClose}/>
        </ModalBody>
        {/* {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Профиль</ModalHeader>
            <ModalBody>
              <UserProfileForm onClose={onClose}/>
            </ModalBody>
          </>
        )} */}
      </ModalContent>
    </Modal>
  )
}

function UserProfileForm({onClose}) {
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [timezoneChoices, setTimezoneChoices] = useState([]);

  const userAccount = useSelector(state => state.user.account);

  useEffect(() => {
    getAPI().users.availableTimezones().then(response => {
      setTimezoneChoices(response.data.timezones);
    });
  }, []);

  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    const data = Object.fromEntries(new FormData(e.currentTarget));

    const [formValid, validationErrors] = validateForm(data);
    setErrors(validationErrors);
    if (!formValid) {
      setLoading(false);
      return;
    }

    try {
      await getAPI().users.editMe(data);
      addToast({
        title: 'Данные изменены',
        color: 'success',
      });
    } catch (error) {
      error.status === 400 && setErrors(error.response.data);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Form className="w-full items-center" onSubmit={onSubmit} validationErrors={errors}>
      <Input
          isRequired
          label="Логин"
          labelPlacement="inside"
          name="username"
          type="text"
          value={userAccount.username}
      />
      <Select
          isRequired
          label="Часовой пояс"
          name="timezone"
          value={userAccount.timezone}
      >
          <SelectItem key="1">{315}</SelectItem>
          <SelectItem key="2">{431}</SelectItem>
          <SelectItem key="3">{123}</SelectItem>
      </Select>
      {
      timezoneChoices.length > 0 &&
      <Select
          isRequired
          defaultSelectedKeys={[userAccount.timezone]}
          label="Часовой пояс"
          name="timezone"
      >
          {timezoneChoices.map((timezone) => (
            <SelectItem key={timezone}>{timezone}</SelectItem>
          ))}
      </Select>
      }
      <div className="w-full flex flex-row-reverse">
        <Button color="primary" onPress={onClose}>
          Сохранить
        </Button>
        <Button color="danger" variant="light" onPress={onClose}>
          Закрыть
        </Button>
      </div>
    </Form>
  )
}