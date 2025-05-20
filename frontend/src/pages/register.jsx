import AuthLayout from "@/layouts/auth.jsx";
import {Link} from "@heroui/link";
import {Input} from "@heroui/input";
import {Button} from "@heroui/button";
import AuthForm from "@/components/auth/auth-form.jsx";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {addToast} from "@heroui/toast";
import {getAPI} from "@/core/api.js";

export default function RegisterPage() {
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    const data = Object.fromEntries(new FormData(e.currentTarget));

    const [formValid, validationErrors] = validateForm(data);
    setErrors(validationErrors);
    if (!formValid) {
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
          label="Пожтверждение пароля"
          labelPlacement="inside"
          name="password_confirm"
          type="password"
        />
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