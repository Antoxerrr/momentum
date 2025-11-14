import { Link } from '@heroui/react';
import { Input } from '@heroui/react';
import { Button } from '@heroui/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';

import AuthForm from '@/components/auth/auth-form.jsx';
import AuthLayout from '@/layouts/auth.jsx';
import { useUserStore } from '@/store/user.js';
import { setDocumentTitle } from '@/core/utils.js';

export default function LoginPage() {
  useEffect(() => {
    setDocumentTitle('Авторизация');
  }, []);

  const [loading, setLoading] = useState(false);
  const [isWrongCredentials, setIsWrongCredentials] = useState(false);
  const { login } = useUserStore(
    useShallow((state) => ({ login: state.login })),
  );
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setIsWrongCredentials(false);
    const data = Object.fromEntries(new FormData(e.currentTarget));

    try {
      await login(data);

      navigate('/', { replace: true });
    } catch (error) {
      error.status === 400 && setIsWrongCredentials(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthForm
        footer={<RegistrationLink />}
        title="Авторизация"
        onSubmit={onSubmit}
      >
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
        <Button
          className="w-full mt-3 shadow-md"
          color="primary"
          isLoading={loading}
          type="submit"
          variant="shadow"
        >
          Войти
        </Button>
        {isWrongCredentials && <CredentialsError />}
      </AuthForm>
    </AuthLayout>
  );
}

function RegistrationLink() {
  return (
    <>
      Нет аккаунта?&nbsp;
      <Link className="text-sm" href="/register" underline="hover">
        Зарегистрироваться
      </Link>
    </>
  );
}

function CredentialsError() {
  return (
    <p className="text-danger text-sm block mt-3">Неверный логин или пароль</p>
  );
}
