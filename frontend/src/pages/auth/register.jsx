import AuthLayout from "@/layouts/auth.jsx";
import {Link} from "@heroui/link";
import {Input} from "@heroui/input";
import {Button} from "@heroui/button";
import AuthForm from "@/components/auth/auth-form.jsx";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {addToast} from "@heroui/toast";
import { getAPI } from "@/core/api.js";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import {setDocumentTitle} from "@/core/utils.js";


export default function RegisterPage() {
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  let [timezoneChoices, setTimezoneChoices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getAPI().users.availableTimezones().then(response => {
      setTimezoneChoices(response.data.timezones);
    });

    setDocumentTitle("Регистрация");
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
      await getAPI().users.register(data);
      addToast({
        title: 'Успешная регистрация',
        description: 'Авторизуйтесь для продолжения',
        color: 'success',
      })
      navigate('/login', {replace: true});
    } catch (error) {
      error.status === 400 && setErrors(error.response.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthForm title="Регистрация" onSubmit={onSubmit} footer={<LoginLink/>} errors={errors}>
        <Input
          isRequired
          label="Логин"
          labelPlacement="inside"
          name="username"
          type="text"
        />
        <Input
          isRequired
          label="E-mail"
          labelPlacement="inside"
          name="email"
          type="email"
        />
        <Input
          isRequired
          label="Пароль"
          labelPlacement="inside"
          name="password"
          type="password"
        />
        <Input
          isRequired
          label="Подтверждение пароля"
          labelPlacement="inside"
          name="password_confirm"
          type="password"
        />

        {
        timezoneChoices.length > 0 &&
        <Autocomplete
          isRequired
          defaultSelectedKeys="UTC"
          label="Часовой пояс"
          name="timezone"
        >
          {timezoneChoices.map((timezone) => (
            <AutocompleteItem key={timezone}>{timezone}</AutocompleteItem>
          ))}
        </Autocomplete>
        }

        <Button type="submit" color="primary" variant="shadow" className="w-full mt-3 shadow-md" isLoading={loading}>
          Регистрация
        </Button>
      </AuthForm>
    </AuthLayout>
  );
}


function LoginLink() {
  return (
    <>
      Уже есть аккаунт?&nbsp;
      <Link href="/login" underline="hover" className="text-sm">
        Войти
      </Link>
    </>
  )
}


function validateForm(data) {
  const errors = {};
  if (data.password !== data.password_confirm) {
    errors.password_confirm = 'Пароли не совпадают';
  } else if (data.password.length < 8) {
    errors.password = "Минимальная длина - 8";
  }

  if (data.email.length < 3) {
    errors.email = "Минимальная длина - 3";
  }

  if (data.username.length < 3) {
    errors.username = "Минимальная длина - 3";
  }

  return [Object.keys(errors).length === 0, errors]
}