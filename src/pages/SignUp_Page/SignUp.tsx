import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './signup.module.css';
import TextField from '../../components/TextField_LoginSignUp/Textfield';
import PasswordField from '../../components/Password_TextField/PasswordField';
import InputNum from '../../components/TextFieldOnlyNumber/TextField-NumberOnly';
import { API_BE } from '../../config/configApi';
// import authorizedAxiosInstance from '../../services/Auth';
import axios, { AxiosError } from 'axios';



const SignUp: React.FC = () => {
    const navigate = useNavigate();
    const [isVerify, setIsVerify] = useState<boolean>(false);
    const [user_name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [age, setAge] = useState<number>(0);
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [verificationCode, setVerificationCode] = useState<string>("");
    const [ageError, setAgeError] = useState<string>("");
    const [emailError, setEmailError] = useState<string>("");
    const [passwordError, setPasswordError] = useState<string>("");
    const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");

    const emailPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordPattern: RegExp = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

    interface SignUpData {
        user_name: string;
        email: string;
        age: number;
        password: string;
    }
    
    const handleSignUp = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        let isValid = true;

        //? Kiểm tra tuổi
        if (isNaN(age) || age < 13 || age > 101) {
            setAgeError("Age must be between 13 and 101.");
            isValid = false;
        } else {
            setAgeError("");
        }

        //? Kiểm tra email
        if (!email) {
            setEmailError("Email cannot be empty.");
            isValid = false;
        } else if (!emailPattern.test(email)) {
            setEmailError("Enter a valid email address.");
            isValid = false;
        } else {
            setEmailError("");
        }

        //? Kiểm tra password
        if (!password) {
            setPasswordError("Password cannot be empty.");
            isValid = false;
        } else if (!passwordPattern.test(password)) {
            setPasswordError("Password must be at least 6 characters and include an uppercase letter, a number, and a special character.");
            isValid = false;
        } else {
            setPasswordError("");
        }

        //? Kiểm tra confirm password
        if (confirmPassword !== password) {
            setConfirmPasswordError("Passwords do not match.");
            isValid = false;
        } else {
            setConfirmPasswordError("");
        }

        if (isValid) {
            try {
                const signUpData: SignUpData = {
                    user_name,
                    email,
                    age,
                    password
                };
                
                await submitSignUp(signUpData);
                setIsVerify(true); // Move to verification step
            } catch (error) {
                // alert(error.message || 'Signup failed. Please try again.');
            }
        }
    };

    const handleVerify = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        if (!verificationCode) {
            alert("Please enter the verification code.");
            return;
        }
        alert("Email Verified Successfully!");
    };
    
    //? Hanlde Sign Up API
    const submitSignUp = async (data: SignUpData): Promise<void> => {
        try {
            const response = await axios.post(
                `${API_BE}/api/v1/auth/register`,
                {
                    user_name: data.user_name,
                    email: data.email,
                    age: data.age,
                    password: data.password
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
    
            console.log('Signup successful:', response.data);
            navigate('/login');
        } catch (error) {
            const axiosError = error as AxiosError<{ message?: string }>;
            console.error('Signup failed:', error);
            // Handle specific error cases
            if (axiosError.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                throw new Error(axiosError.response.data.message || 'Signup failed');
            } else if (axiosError.request) {
                // The request was made but no response was received
                throw new Error('No response from server');
            } else {
                // Something happened in setting up the request
                throw new Error('Error setting up request');
            }
        }
    };


    return (
        <div className={styles.containerBodySignUp}>
            <div className={styles.container}>
                <div
                    className={styles.progressBar}
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={0}
                />
                <div className={styles.formHeader}>
                    <h2 id="formTitle">{isVerify ? "Verify Your Email" : "Create an Account"}</h2>
                </div>
                <form
                    id={styles.registrationForm}
                    aria-labelledby="form-title"
                    aria-describedby="form-description"
                    className={`${styles.fadeIn} ${isVerify ? styles.verifyEmail : styles.createAccount}`}
                    onSubmit={isVerify ? handleVerify : handleSignUp}
                >
                    {isVerify ? (
                        <>
                            <p>We have sent a verification code to <strong>{email}</strong></p>
                            <TextField
                                label="Enter Verification Code"
                                type="text"
                                id="verification-code"
                                required={true}
                                value={verificationCode}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVerificationCode(e.target.value)}
                            />
                            <button type="submit" className={styles.verifyBtn}>
                                Verify Email
                            </button>
                        </>
                    ) : (
                        <>
                            <div className={styles.field}>
                                <TextField
                                    label="User Name"
                                    type="name"
                                    id="name"
                                    required={true}
                                    autoComplete="name"
                                    value={user_name}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                                />
                                <InputNum
                                    label="User Age"
                                    id="age"
                                    required
                                    value={age}
                                    autoComplete='off'
                                    onChange={(num: number) => setAge(num)}
                                />
                            </div>
                            {ageError && <span className={styles.errorMessage}>{ageError}</span>}

                            <TextField
                                label="Email"
                                type="email"
                                id="email"
                                required={true}
                                autoComplete="email"
                                value={email}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                            />
                            {emailError && <span className={styles.errorMessage}>{emailError}</span>}

                            <PasswordField
                                id="password"
                                label="Password"
                                value={password}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
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
                                <div className={styles.requirement} data-requirement="length">
                                    <span className="requirement-icon">✓</span>
                                    <span>At least 8 characters</span>
                                </div>
                                <div className={styles.requirement} data-requirement="uppercase">
                                    <span className="requirement-icon">✓</span>
                                    <span>One uppercase letter</span>
                                </div>
                                <div className={styles.requirement} data-requirement="number">
                                    <span className="requirement-icon">✓</span>
                                    <span>One number</span>
                                </div>
                                <div className={styles.requirement} data-requirement="special">
                                    <span className="requirement-icon">✓</span>
                                    <span>One special character</span>
                                </div>
                            </div>
                            <button type="submit">
                                Sign Up
                            </button>

                            <div className={styles.optional}>
                                <p>Already have an account?</p>
                                <Link to="/login">Log In</Link>
                            </div>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
};

export default SignUp;