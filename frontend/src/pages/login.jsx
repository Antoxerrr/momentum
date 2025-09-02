import AuthLayout from "@/layouts/auth.jsx";
import {Link} from "@heroui/link";
import {Input} from "@heroui/input";
import {Button} from "@heroui/button";
import AuthForm from "@/components/auth/auth-form.jsx";
import {useState} from "react";
import {useDispatch} from "react-redux";
import {login} from "@/store/user.js";
import {useNavigate} from "react-router-dom";
import {getAPI} from "@/core/api.js";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [isWrongCredentials, setIsWrongCredentials] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setIsWrongCredentials(false);
    const data = Object.fromEntries(new FormData(e.currentTarget));

    try {
      const api = getAPI();
      const response = await api.users.login(data);

      dispatch(login(response.data));
      api.setAuthToken();

      navigate('/', {replace: true});
    } catch (error) {
      error.status === 400 && setIsWrongCredentials(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthForm title="Авторизация" onSubmit={onSubmit} footer={<RegistrationLink/>}>
        <Input
          isRequired
          label="Логин"
          labelPlacement="inside"
          name="username"
          type="text"
        />
        <Input
          isRequired
          label="Пароль"
          labelPlacement="inside"
          name="password"
          type="password"
        />
        <Button type="submit" color="primary" variant="shadow" className="w-full mt-3 shadow-md" isLoading={loading}>
          Войти
        </Button>
        {isWrongCredentials && <CredentialsError/>}
      </AuthForm>
    </AuthLayout>
  );
}


function RegistrationLink() {
  return (
    <>
      Нет аккаунта?&nbsp;
      <Link href="/register" underline="hover" className="text-sm">
        Зарегистрироваться
      </Link>
    </>
  )
}


function CredentialsError() {
  return (
    <p className="text-danger text-sm block mt-3">Неверный логин или пароль</p>
  )
}
