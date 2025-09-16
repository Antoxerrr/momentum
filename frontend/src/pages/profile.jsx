import { getAPI } from "@/core/api";
import DefaultLayout from "@/layouts/default";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { addToast } from "@heroui/toast";
import { useEffect, useState } from "react";
import { useUserStore } from "@/store/user.js";


export default function ProfilePage() {
  const { account, loadUserAccount } = useUserStore();

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
    getAPI().users.availableTimezones().then(response => {
      setTimezoneChoices(response.data.timezones);
    });
  }, []);

  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    const data = Object.fromEntries(new FormData(e.currentTarget));

    try {
      await getAPI().users.editMe(data);
      addToast({
        title: 'Данные изменены',
        color: 'success',
      })
      await loadUserAccount();
    } catch (error) {
      error.status === 400 && setErrors(error.response.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DefaultLayout>
      <div className="w-full flex flex-col justify-center items-center">
        <h1 className="text-2xl font-bold mb-10">Профиль</h1>
        <Form className="items-center lg:w-1/3 md:w-1/2 w-full" onSubmit={onSubmit} validationErrors={errors}>
          <Input
            isRequired
            label="Логин"
            labelPlacement="inside"
            name="username"
            type="text"
            autoComplete="off"
            value={username}
            onValueChange={setUsername}
          />
          {
          timezoneChoices.length > 0 &&
          <Autocomplete
            isRequired
            defaultSelectedKey={account.timezone}
            label="Часовой пояс"
            name="timezone"
          >
              {timezoneChoices.map((timezone) => (
                  <AutocompleteItem key={timezone}>{timezone}</AutocompleteItem>
              ))}
          </Autocomplete>
          }
          <Button type="submit" color="primary" variant="shadow" className="w-full mt-3 shadow-md" isLoading={loading}>
            Сохранить
          </Button>
        </Form>
      </div>
    </DefaultLayout>
  );
}