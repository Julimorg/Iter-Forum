import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '../../../components/TextField_LoginSignUp/Textfield';


const SendEmail: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string>('');
  const emailPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const navigate = useNavigate();

  const handleSendEmail = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!emailPattern.test(email)) {
      setError('Enter a valid email address.');
      return;
    }
    setError('');
    navigate('/reset-password', { state: { email } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full w-[35rem] h-[30rem] flex flex-col items-center">
        <div className="w-full h-1 bg-gray-200 rounded-sm mb-8 overflow-hidden">
          <div
            className="h-full bg-[dark] transition-all duration-300"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={0}
          />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Send Email</h2>
        <form
          className="w-full grid gap-6 h-[20rem] transition-all duration-300 ease-in-out animate-fade-in"
          aria-labelledby="formTitle"
          aria-describedby="form-description"
          onSubmit={handleSendEmail}
        >
          <TextField
            label="Email"
            type="email"
            id="forgot-email"
            required={true}
            autoComplete="email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          />
          {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
          <button
            type="submit"
            className="w-full h-[4rem] mt-[10rem] py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-400 hover:text-gray-800 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-gray-300"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default SendEmail;
