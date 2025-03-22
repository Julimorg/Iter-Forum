import React, { useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import styles from './login.module.css';
import TextField from '../../components/TextField_LoginSignUp/Textfield';
import PasswordField from '../../components/Password_TextField/PasswordField';
import authorizedAxiosInstance from '../../services/Auth';
import { API_BE, Login_API } from '../../config/configApi';

// Định nghĩa type cho các bước
type Step = "login" | "sendEmail" | "verifyOtp" | "resetPassword";

const Login: React.FC = () => {
    const [step, setStep] = useState<Step>("login");
    // const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [otp, setOtp] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [passwordError, setPasswordError] = useState<string>("");
    const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");
    const [error, setError] = useState<string>("");
    const emailPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordPattern: RegExp = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    const navigate = useNavigate();
    interface LoginData {
        email: string;
        password: string;
    }
    const submitLogIn = async (data: LoginData): Promise<void> => {
        console.log("Submit login: ", data);
        // const res = await authorizedAxiosInstance.post(`${Login_API}/v1/users/login`, data);
        const res = await authorizedAxiosInstance.post(`${API_BE}/api/v1/auth/login`, data);

        console.log(res.data);
        const userInfo = {
            id : res.data._id,
            email: res.data.email
        }
        //? Lưu thông tin vào local storage
        // localStorage.setItem("accessToken", res.data.accessToken);
        // localStorage.setItem("refreshToken", res.data.refreshToken);
        localStorage.setItem("accessToken", res.data.data.access_token);
        localStorage.setItem("refreshToken", res.data.data.refresh_token);
        // do userinfo là 1 kiểu Json Object nên nếu gán trực tiếp vào
        // thì browser không nhận diện được data mà chỉ là Object Object
        // --> Xử lý như việc fetch Api là dùng JSON.stringify để có thể
        // lấy data raw 
        localStorage.setItem("userInfo", JSON.stringify(userInfo));

        navigate('/home');
    }

    const handleForgotPassword = (): void => {
        setStep("sendEmail");
    };
    const handleLogin = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        if (!emailPattern.test(email) && password.length == 0) {
            setError("Enter a valid email address.");
            setPasswordError("Password must not empty!");
            console.log("error")
            return;
        }
        setError("");
        setPasswordError("");
        console.log("Login successful with:", email);
        const data: LoginData = { email, password };
        await submitLogIn(data);
    };
    const handleSendEmail = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        if (!emailPattern.test(email)) {
            setError("Enter a valid email address.");
            return;
        }
        setError("");
        setStep("verifyOtp");
    };

    const handleVerifyOtp = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        if (otp.length !== 4) {
            setError("Enter a 4-digit OTP.");
            return;
        }
        setStep("resetPassword");
    };

    const handleBackToLogin = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        let isValid = true;

        if (!passwordPattern.test(newPassword)) {
            setPasswordError("Password must be at least 6 characters and include an uppercase letter, a number, and a special character.");
            isValid = false;
        } else {
            setPasswordError("");
        }

        if (confirmPassword !== newPassword) {
            setConfirmPasswordError("Passwords do not match.");
            isValid = false;
        } else {
            setConfirmPasswordError("");
        }

        if (isValid) {
            setStep("login");
        }
    };

    return (
        <div className={styles.containerLogin}>
            <div className={styles.container}>
                <div
                    className={styles.progressBar}
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={0}
                />
                <div className="formHeader">
                    <h2 id="formTitle">
                        {step === "login" ? "Log In"
                            : step === "sendEmail" ? "Send Email"
                                : step === "verifyOtp" ? "Verify OTP"
                                    : "Reset Password"}
                    </h2>
                </div>
                <form
                    className={`${styles.registrationFormLogin} ${styles.fadeIn} ${step}`}
                    aria-labelledby="formTitle"
                    aria-describedby="form-description"
                    onSubmit={
                        step === "login" ? handleLogin :
                            step === "sendEmail" ? handleSendEmail :
                                step === "verifyOtp" ? handleVerifyOtp :
                                    step === "resetPassword" ? handleBackToLogin :
                                        undefined
                    }
                >
                    {step === "login" && (
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
                            <div className={styles.passwordField}>
                                <PasswordField
                                    id="password"
                                    label="Password"
                                    value={password}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                                />
                            </div>
                            <button type="submit" aria-describedby="submit-description">
                                Log in
                            </button>
                            <div className={styles.optional}>
                                <div className={styles.signUp}>
                                    <p>New to IT-er?</p>
                                    <Link to="/sign-up">Sign-Up</Link>
                                </div>
                                {/* <div className={styles.forgotPassword}>
                                    <button
                                        type="button"
                                        onClick={handleForgotPassword}
                                        className={styles.forgotPasswordBtn}
                                    >
                                        Forgot Password?
                                    </button>
                                </div> */}
                            </div>

                        </>
                    )}
                    {step === "sendEmail" && (
                        <>
                            <TextField
                                label="Email"
                                type="email"
                                id="forgot-email"
                                required={true}
                                autoComplete="email"
                                value={email}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                            />
                            <button type="submit">
                                Send
                            </button>
                        </>
                    )}
                    {/* */}
                    {step === "verifyOtp" && (
                        <>
                            <TextField
                                label={error ? error : "Verify Your OTP"}
                                type="text"
                                id="otp"
                                required={true}
                                autoComplete="off"
                                value={otp}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOtp(e.target.value)}
                            />
                            <button type="submit">
                                Confirm
                            </button>
                        </>
                    )}
                    {step === "resetPassword" && (
                        <>
                            <PasswordField
                                id="new-password"
                                label="New Password"
                                value={newPassword}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
                            />
                            {passwordError && <span className={styles.errorMessage}>{passwordError}</span>}
                            <PasswordField
                                id="confirm-password"
                                label="Confirm Password"
                                value={confirmPassword}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                            />
                            {confirmPasswordError && <span className={styles.errorMessage}>{confirmPasswordError}</span>}
                            <div
                                id="password-requirements"
                                className={styles.passwordRequirements}
                                aria-live="polite"
                            >
                                <div className="requirement" data-requirement="length">
                                    <span className="requirement-icon">✓</span>
                                    <span>At least 8 characters</span>
                                </div>
                                <div className="requirement" data-requirement="uppercase">
                                    <span className="requirement-icon">✓</span>
                                    <span>One uppercase letter</span>
                                </div>
                                <div className="requirement" data-requirement="number">
                                    <span className="requirement-icon">✓</span>
                                    <span>One number</span>
                                </div>
                                <div className="requirement" data-requirement="special">
                                    <span className="requirement-icon">✓</span>
                                    <span>One special character</span>
                                </div>
                            </div>
                            <button type="submit" className="resetBtn">
                                Reset Password
                            </button>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
};

export default Login;