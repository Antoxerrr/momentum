import { Autocomplete, AutocompleteItem } from '@heroui/react';
import { Button } from '@heroui/react';
import { Form } from '@heroui/react';
import { Input } from '@heroui/react';
import { addToast } from '@heroui/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import DefaultLayout from '@/layouts/default';
import { getAPI } from '@/core/api';
import { useUserStore } from '@/store/user.js';
import { setDocumentTitle } from '@/core/utils.js';

export default function ProfilePage() {
  const { account, loadUserAccount, logout } = useUserStore();
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [timezoneChoices, setTimezoneChoices] = useState([]);
  const [username, setUsername] = useState(account.username);

  useEffect(() => {
    if (account) {
      setUsername(account.username);
    }
  }, [account]);

  useEffect(() => {
    getAPI()
      .users.availableTimezones()
      .then((response) => {
        setTimezoneChoices(response.data.timezones);
      });
    setDocumentTitle('Профиль');
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    const data = Object.fromEntries(new FormData(e.currentTarget));

    try {
      await getAPI().users.editMe(data);
      addToast({
        title: 'Данные изменены',
        color: 'success',
      });
      await loadUserAccount({ force: true });
    } catch (error) {
      error.status === 400 && setErrors(error.response.data);
    } finally {
      setLoading(false);
    }
  };

  const performLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <DefaultLayout>
      <div className="w-full flex flex-col items-center flex-1 px-3 md:px-0">
        <h1 className="text-2xl font-bold mb-10">Профиль</h1>
        <Form
          className="items-center lg:w-1/3 md:w-1/2 w-full"
          validationErrors={errors}
          onSubmit={onSubmit}
        >
          <Input
            isRequired
            autoComplete="off"
            label="Логин"
            labelPlacement="inside"
            name="username"
            type="text"
            value={username}
            onValueChange={setUsername}
          />
          <Autocomplete
            isDisabled={timezoneChoices.length === 0}
            isRequired
            defaultSelectedKey={account.timezone}
            label="Часовой пояс"
            name="timezone"
          >
            {timezoneChoices.map((timezone) => (
              <AutocompleteItem key={timezone}>{timezone}</AutocompleteItem>
            ))}
          </Autocomplete>
          <Button
            className="w-full mt-3 shadow-md"
            color="primary"
            isLoading={loading}
            type="submit"
            variant="shadow"
          >
            Сохранить
          </Button>
        </Form>
        <div className="w-full mt-auto pt-6 md:hidden">
          <Button
            className="w-full"
            color="danger"
            variant="light"
            onPress={performLogout}
          >
            Выйти
          </Button>
        </div>
      </div>
    </DefaultLayout>
  );
}
