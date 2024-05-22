import { Button, Modal, ModalContent, Spinner } from '@nextui-org/react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router';

export const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, error, setError } = useAuth(); // Updated to include setError
  const navigate = useNavigate();
  document.title = 'Вход в систему | iRocket';

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    const success = await login(username, password);
    setIsLoading(false);
    if (success) {
      navigate('/dashboard');
    } else {
      console.error(error);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === 'Enter') {
      handleSubmit(event);
    }
  };

  return (
    <div className="grid justify-center items-center gap-5 mt-[5em]">
      <div>
        <h2 className="text-3xl font-semibold text-center">Добро пожаловать</h2>
        <p className="font-semibold text-center text-sm text-gray-500 mt-1">
          Укажите данные для входа
        </p>
      </div>
      <form onKeyDown={handleKeyDown} onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <p className="font-semibold text-start text-sm text-gray-500">Имя пользователя</p>
          <input
            className="grid border rounded-xl p-2 min-w-72 mt-1"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Имя пользователя"
          />
        </div>
        <div>
          <p className="font-semibold text-start text-sm text-gray-500">Пароль</p>
          <input
            className="grid border rounded-xl p-2 min-w-72 mt-1"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="пароль"
          />
        </div>
        <div>
          <Button
            color="danger"
            variant="shadow"
            className="min-w-72 font-semibold"
            onClick={handleSubmit}
            isDisabled={!username || !password}
          >
            Войти
          </Button>
        </div>
      </form>
      <div className="flex gap-4 justify-center">
        <p className="font-semibold text-sm text-gray-500">У Вас нет аккаунта?</p>
        <a className="font-semibold text-sm text-blue-700" href="/register">
          Создать аккаунт
        </a>
      </div>
      <Modal
        isOpen={isLoading || error !== null}
        onClose={() => {
          setIsLoading(false);
          setError(null); // Clear error when modal is closed
        }}
      >
        <ModalContent>
          <div className="flex justify-center items-center gap-3 p-5">
            {isLoading ? (
              <>
                <Spinner />
                <h3>Загрузка...</h3>
              </>
            ) : (
              <h3>{error}</h3>
            )}
          </div>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default LoginPage;
