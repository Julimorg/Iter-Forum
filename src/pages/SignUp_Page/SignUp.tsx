import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input, Button, Modal } from 'antd';
import { LockOutlined, UserOutlined, MailOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useSignUp } from './Hook/useSignUp';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import LoadingBus from '../../components/Loader/LoadingBus';

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [isVerify, setIsVerify] = useState<boolean>(false);
  const [user_name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [age, setAge] = useState<number>(0);
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [ageError, setAgeError] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>('');

  const emailPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordPattern: RegExp = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

  const { mutate, isPending } = useSignUp({
    onSuccess: () => {
      toast.success('You have registered successfully!');
      navigate('/login');
      // setIsVerify(true);
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error('Registration failed');
      console.log(err);
    },
  });

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    let isValid = true;

    if (isNaN(age) || age < 13 || age > 101) {
      setAgeError('Age must be between 13 and 101.');
      isValid = false;
    } else {
      setAgeError('');
    }

    if (!email) {
      setEmailError('Email cannot be empty.');
      isValid = false;
    } else if (!emailPattern.test(email)) {
      setEmailError('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Password cannot be empty.');
      isValid = false;
    } else if (!passwordPattern.test(password)) {
      setPasswordError(
        'Password must be at least 6 characters long and include an uppercase letter, a number, and a special character.'
      );
      isValid = false;
    } else {
      setPasswordError('');
    }

    if (confirmPassword !== password) {
      setConfirmPasswordError('Passwords do not match.');
      isValid = false;
    } else {
      setConfirmPasswordError('');
    }

    if (isValid) {
      mutate({ user_name, email, age, password });
    }
  };

  const handleVerify = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!verificationCode) {
      toast.error('Please enter the verification code.');
      return;
    }
    toast.success('Email verified successfully!');
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-200 p-4">
      <motion.div
        className="bg-white p-8 rounded-2xl shadow-2xl w-[35rem] flex flex-col items-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="w-full h-1 bg-gray-200 rounded-sm mb-8 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-blue-700 transition-all duration-300"
            initial={{ width: '50%' }}
            animate={{ width: isVerify ? '100%' : '50%' }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-6 font-sans">Create Account</h2>
        <form
          id="registrationForm"
          aria-labelledby="form-title"
          aria-describedby="form-description"
          className="w-full grid gap-6 h-[30rem] transition-all duration-300"
          onSubmit={isVerify ? handleVerify : handleSignUp}
        >
          {isVerify ? (
            <Modal
              open={isVerify}
              onCancel={() => setIsVerify(false)}
              footer={null}
              centered
              className="max-w-md mx-4 sm:mx-auto rounded-2xl shadow-2xl"
              styles={{
                content: { background: 'linear-gradient(135deg, #f9fafb 0%, #e5e7eb 100%)' },
                header: { borderBottom: '1px solid #e5e7eb' },
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-800 font-sans">Verify Your Email</h3>
                  <p className="text-gray-600 mt-2">
                    We have sent a verification code to <strong>{email}</strong>
                  </p>
                </div>
                <Input
                  prefix={<MailOutlined className="text-gray-400" />}
                  placeholder="Verification Code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 text-base"
                  size="large"
                />
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full mt-6 h-[3rem] bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-400 hover:text-gray-800 transition-all duration-300"
                  size="large"
                  onClick={() => handleVerify}
                >
                  Verify Email
                </Button>
              </motion.div>
            </Modal>
          ) : (
            <>
              {isPending ? (
                <div className="flex flex-col items-center justify-center h-[15rem]">
                  <LoadingBus />
                  <h1 className="text-2xl font-bold text-gray-800 mt-6">Please wait...</h1>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <motion.div
                      animate={ageError ? { x: [-5, 5, -5, 5, 0] } : {}}
                      transition={{ duration: 0.3 }}
                    >
                      <Input
                        prefix={<UserOutlined className="text-gray-400" />}
                        placeholder="Your Name"
                        value={user_name}
                        onChange={(e) => setName(e.target.value)}
                        className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 text-base"
                        size="large"
                      />
                    </motion.div>
                    <motion.div
                      animate={ageError ? { x: [-5, 5, -5, 5, 0] } : {}}
                      transition={{ duration: 0.3 }}
                    >
                      <Input
                        prefix={<UserOutlined className="text-gray-400" />}
                        placeholder="Your Age"
                        type="number"
                        value={age || ''}
                        onChange={(e) => setAge(Number(e.target.value))}
                        className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 text-base"
                        size="large"
                      />
                      {/* {ageError && <span className="text-red-500 text-xs mt-1">{ageError}</span>} */}
                    </motion.div>
                  </div>
                  <motion.div
                    animate={emailError ? { x: [-5, 5, -5, 5, 0] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    <Input
                      prefix={<MailOutlined className="text-gray-400" />}
                      placeholder="Email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 text-base"
                      size="large"
                    />
                    {/* {emailError && <span className="text-red-500 text-xs mt-1">{emailError}</span>} */}
                  </motion.div>
                  <motion.div
                    animate={passwordError ? { x: [-5, 5, -5, 5, 0] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    <Input.Password
                      prefix={<LockOutlined className="text-gray-400" />}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 text-base"
                      size="large"
                    />
                    {/* {passwordError && (
                      <span className="text-red-500 text-xs mt-1">{passwordError}</span>
                    )} */}
                  </motion.div>
                  <motion.div
                    animate={confirmPasswordError ? { x: [-5, 5, -5, 5, 0] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    <Input.Password
                      prefix={<LockOutlined className="text-gray-400" />}
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 text-base"
                      size="large"
                    />
                    {/* {confirmPasswordError && (
                      <span className="text-red-500 text-xs mt-1">{confirmPasswordError}</span>
                    )} */}
                  </motion.div>
                  <div className="space-y-2" aria-live="polite">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="text-green-500">✓</span>
                      {ageError ? (
                        <span className="text-red-500 text-sm">{ageError}</span>
                      ) : (
                        <span>Age: 13 or older</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="text-green-500">✓</span>
                      {emailError ? (
                        <span className="text-red-500 text-sm">{emailError}</span>
                      ) : (
                        <span>Valid email format</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="text-green-500">✓</span>
                      {passwordError ? (
                        <span className="text-red-500 text-sm">{passwordError}</span>
                      ) : (
                        <span>
                          Password: At least 6 characters, 1 uppercase letter, 1 special character
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="text-green-500">✓</span>
                      {confirmPasswordError ? (
                        <span className="text-red-500 text-sm">{confirmPasswordError}</span>
                      ) : (
                        <span>Passwords match</span>
                      )}
                    </div>
                  </div>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="w-[30rem] h-[3rem] bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-400 hover:text-gray-800 transition-all duration-300 text-lg"
                    size="large"
                    loading={isPending}
                  >
                    {isPending ? 'Processing...' : 'Sign Up'}
                  </Button>
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <p>Already have an account?</p>
                      <Link to="/login" className="text-indigo-500 hover:text-indigo-700">
                        Log In
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </form>
      </motion.div>
    </div>
  );
};

export default SignUp;