import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TextField from '../../components/TextField_LoginSignUp/Textfield';
import PasswordField from '../../components/Password_TextField/PasswordField';
import { useLogin } from './Hooks/useLogin';
import { toast } from 'react-toastify';
import { LoginRequest } from '../../interface/Auth/Login';
import LoadingBus from '../../components/Loader/LoadingBus';

const Login: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const emailPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const navigate = useNavigate();

  const loginMutation = useLogin();

  const submitLogin = (values: { email: string; password: string }) => {
    setIsLoading(true);
    loginMutation.mutate(
      {
        email: values.email,
        password: values.password,
      },
      {
        onSuccess: () => {
          setIsLoading(false);
          toast.success('Login Successfully');
          navigate('/home');
        },
        onError: (error: any) => {
          setIsLoading(false);
          toast.error('Login failed');
          console.error(error.message);
        },
      }
    );
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!emailPattern.test(email) && password.length === 0) {
      setPasswordError('Password must not empty!');
      console.log('error');
      return;
    }
    setPasswordError('');
    console.log('Login successful with:', email);
    const data: LoginRequest = { email, password };
    await submitLogin(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100  ">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-[35rem]  flex flex-col items-center">
        <div className="w-full h-1 bg-gray-200 rounded-sm mb-8 overflow-hidden">
          <div
            className="h-full bg-[dark] transition-all duration-300"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={0}
          />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Log In</h2>

        <form
          className="w-full grid gap-6 h-[30rem] transition-all duration-300 ease-in-out animate-fade-in"
          aria-labelledby="formTitle"
          aria-describedby="form-description"
          onSubmit={handleLogin}
        >
          {isLoading ? (
            <>
              <div className="flex items-center justify-center h-[15rem]">
                <LoadingBus />
              </div>
              <h1 className='flex items-center justify-center text-2xl font-bold text-gray-800 mb-6'>
                  Vui lòng đợi ...
              </h1>
            </>
          ) : (
            <>
              <TextField
                label="Email"
                type="email"
                id="name"
                required={true}
                autoComplete="email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              />
              <div className="mb-6">
                <PasswordField
                  id="password"
                  label="Password"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                />
                {passwordError && (
                  <span className="text-red-500 text-xs mt-1">{passwordError}</span>
                )}
              </div>
            </>
          )}
          <button
            type="submit"
            className="w-[30rem] h-[3rem] py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-400 hover:text-gray-800 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-gray-300"
            aria-describedby="submit-description"
          >
            Log in
          </button>
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center gap-2">
              <p className="text-gray-600">New to IT-er?</p>
              <Link to="/sign-up" className="text-indigo-500 hover:text-indigo-700">
                Sign-Up
              </Link>
            </div>
            {/* <Link to="/send-email" className="text-indigo-500 hover:text-indigo-700">
              Forgot Password?
            </Link> */}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
