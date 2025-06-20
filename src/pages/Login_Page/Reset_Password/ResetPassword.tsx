import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '../../../components/TextField_LoginSignUp/Textfield';
import PasswordField from '../../../components/Password_TextField/PasswordField';

const ResetPassword: React.FC = () => {
  const [step, setStep] = useState<'verifyOtp' | 'resetPassword'>('verifyOtp');
  const [otp, setOtp] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>('');
  const [error, setError] = useState<string>('');
  const passwordPattern: RegExp = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
  const navigate = useNavigate();



  const handleVerifyOtp = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (otp.length !== 4) {
      setError('Enter a 4-digit OTP.');
      return;
    }
    setError('');
    setStep('resetPassword');
  };

  const handleBackToLogin = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    let isValid = true;

    if (!passwordPattern.test(newPassword)) {
      setPasswordError(
        'Password must be at least 6 characters and include an uppercase letter, a number, and a special character.'
      );
      isValid = false;
    } else {
      setPasswordError('');
    }

    if (confirmPassword !== newPassword) {
      setConfirmPasswordError('Passwords do not match.');
      isValid = false;
    } else {
      setConfirmPasswordError('');
    }

    if (isValid) {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-[35rem] flex flex-col items-center">
        <div className="w-full h-1 bg-gray-200 rounded-sm mb-8 overflow-hidden">
          <div
            className="h-full bg-[dark] transition-all duration-300"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={0}
          />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {step === 'verifyOtp' ? 'Verify OTP' : 'Reset Password'}
        </h2>
        <form
          className={`w-full grid gap-6 transition-all duration-300 ease-in-out animate-fade-in ${
            step === 'verifyOtp' ? 'h-[23rem]' : 'h-[40rem]'
          }`}
          aria-labelledby="formTitle"
          aria-describedby="form-description"
          onSubmit={step === 'verifyOtp' ? handleVerifyOtp : handleBackToLogin}
        >
          {step === 'verifyOtp' && (
            <>
              <TextField
                label={error ? error : 'Verify Your OTP'}
                type="text"
                id="otp"
                required={true}
                autoComplete="off"
                value={otp}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOtp(e.target.value)}
              />
              <button
                type="submit"
                className="w-full h-[4.5rem] mt-[10rem] py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-400 hover:text-gray-800 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-gray-300"
              >
                Confirm
              </button>
            </>
          )}
          {step === 'resetPassword' && (
            <>
              <PasswordField
                id="new-password"
                label="New Password"
                value={newPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNewPassword(e.target.value)
                }
              />
              {passwordError && <span className="text-red-500 text-xs mt-1">{passwordError}</span>}
              <PasswordField
                id="confirm-password"
                label="Confirm Password"
                value={confirmPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setConfirmPassword(e.target.value)
                }
              />
              {confirmPasswordError && (
                <span className="text-red-500 text-xs mt-1">{confirmPasswordError}</span>
              )}
              <div
                id="password-requirements"
                className="mt-3 p-4 bg-gray-50 rounded-lg"
                aria-live="polite"
              >
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-600">At least 8 characters</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-600">One uppercase letter</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-600">One number</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-600">One special character</span>
                </div>
              </div>
              <button
                type="submit"
                className="w-full h-[4rem] mt-[4rem] py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-400 hover:text-gray-800 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-gray-300 mt-2"
              >
                Reset Password
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
