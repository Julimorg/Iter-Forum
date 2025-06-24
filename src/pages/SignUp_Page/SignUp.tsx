import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TextField from '../../components/TextField_LoginSignUp/Textfield';
import PasswordField from '../../components/Password_TextField/PasswordField';
import InputNum from '../../components/TextFieldOnlyNumber/TextField-NumberOnly';
import { useSignUp } from './Hook/useSignUp';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import LoadingBus from '../../components/Loader/LoadingBus';

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [isVerify, setIsVerify] = useState<boolean>(false);
  const [username, setName] = useState<string>('');
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
      toast.success('Bạn đã đăng ký thành công!');
      //   setIsVerify(true);
      navigate('/log-in');
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      const errorMessage = err.response?.data?.message || 'Đã có lỗi xảy ra khi đăng ký!';
      toast.error(`${errorMessage}`);
      console.log(err);
    },
  });
  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    let isValid = true;

    if (isNaN(age) || age < 13 || age > 101) {
      setAgeError('Tuổi phải từ 13 đến 101.');
      isValid = false;
    } else {
      setAgeError('');
    }

    if (!email) {
      setEmailError('Email không được để trống.');
      isValid = false;
    } else if (!emailPattern.test(email)) {
      setEmailError('Vui lòng nhập địa chỉ email hợp lệ.');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Mật khẩu không được để trống.');
      isValid = false;
    } else if (!passwordPattern.test(password)) {
      setPasswordError(
        'Mật khẩu phải có ít nhất 6 ký tự và bao gồm chữ hoa, số và ký tự đặc biệt.'
      );
      isValid = false;
    } else {
      setPasswordError('');
    }

    if (confirmPassword !== password) {
      setConfirmPasswordError('Mật khẩu không khớp.');
      isValid = false;
    } else {
      setConfirmPasswordError('');
    }

    if (isValid) {
      console.log(setIsVerify);
      mutate({ username, email, age, password });
    }
  };

  const handleVerify = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!verificationCode) {
      alert('Vui lòng nhập mã xác minh.');
      return;
    }
    alert('Xác minh email thành công!');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8  w-[35rem]">
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: isVerify ? '100%' : '50%' }}
          />
        </div>
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {isVerify ? 'Xác minh email' : 'Tạo tài khoản'}
          </h2>
        </div>
        <form
          id="registrationForm"
          aria-labelledby="form-title"
          aria-describedby="form-description"
          className="space-y-4 animate-fade-in"
          onSubmit={isVerify ? handleVerify : handleSignUp}
        >
          {isVerify ? (
            <>
              <p className="text-gray-600 text-center">
                Chúng tôi đã gửi mã xác minh đến <strong>{email}</strong>
              </p>
              <TextField
                label="Mã xác minh"
                type="text"
                id="verification-code"
                required={true}
                value={verificationCode}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setVerificationCode(e.target.value)
                }
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Xác minh Email
              </button>
            </>
          ) : (
            <>
              {isPending ? (
                <div className="flex items-center justify-center h-[15rem]">
                  <LoadingBus />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextField
                      label="Tên của bạn"
                      type="name"
                      id="name"
                      required={true}
                      autoComplete="name"
                      value={username}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                    />
                    <InputNum
                      label="Tuổi của bạn"
                      id="age"
                      required
                      value={age}
                      autoComplete="off"
                      onChange={(num: number) => setAge(num)}
                    />
                  </div>
                  <TextField
                    label="Email"
                    type="email"
                    id="email"
                    required={true}
                    autoComplete="email"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  />
                  <PasswordField
                    id="password"
                    label="Mật khẩu"
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setPassword(e.target.value)
                    }
                  />
                  <PasswordField
                    id="confirm-password"
                    label="Xác nhận mật khẩu"
                    value={confirmPassword}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setConfirmPassword(e.target.value)
                    }
                  />
                </>
              )}

              <div className="space-y-2" aria-live="polite">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-green-500">✓</span>
                  {ageError ? (
                    <span className="text-red-500 text-sm">{ageError}</span>
                  ) : (
                    <span> Độ tuổi: 13 trở lên</span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-green-500">✓</span>
                  {emailError ? (
                    <span className="text-red-500 text-sm">{emailError}</span>
                  ) : (
                    <span>Đúng định dạng email</span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-green-500">✓</span>
                  {passwordError ? (
                    <span className="text-red-500 text-sm">{passwordError}</span>
                  ) : (
                    <span>
                      Mật Khẩu: có độ dài từ 6 ký tự trở lên, 1 chữ cái in hoa, 1 ký tự đặc biệt
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-green-500">✓</span>
                  {confirmPasswordError ? (
                    <span className="text-red-500 text-sm">{confirmPasswordError}</span>
                  ) : (
                    <span>Xác nhận mật khẩu trùng nhau</span>
                  )}
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {isPending ? 'Đang Xử lý ...' : 'Đăng ký'}
              </button>

              <div className="text-center text-sm text-gray-600 flex w-[15em] justify-around">
                <p>Đã có tài khoản?</p>
                <Link to="/login" className="text-blue-600 hover:underline">
                  Đăng Nhập
                </Link>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default SignUp;
