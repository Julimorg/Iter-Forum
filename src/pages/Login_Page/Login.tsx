import React from 'react';
import { useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './login.module.css'
import TextField from '../../components/TextField_LoginSignUp/Textfield';
import PasswordField from '../../components/Password_TextField/PasswordField';



const Login = () => {
    const [step, setStep] = useState<"login" | "sendEmail" | "resetPassword">(
        "login"
    );
    const handleForgotPassword = () => {
        setStep("sendEmail");
    };

    const handleSendEmail = (e: React.FormEvent) => {
        e.preventDefault();

        const emailInput = document.getElementById("forgot-email") as HTMLInputElement;
        const emailError = document.getElementById("emailError");

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(emailInput.value)) {
            emailError!.textContent = "Enter a valid email address.";
            emailInput.classList.add("error");
            return;
        }
        emailError!.textContent = "";
        emailInput.classList.remove("error");

        setStep("resetPassword");
    };

    const handleBackToLogin = (e: React.FormEvent) => {
        e.preventDefault();

        const passwordInput = document.getElementById("new-password") as HTMLInputElement;
        const confirmPasswordInput = document.getElementById("confirm-password") as HTMLInputElement;

        const passwordError = document.getElementById("passwordError");
        const confirmPasswordError = document.getElementById("confirmPasswordError");

        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        let isValid = true;

        const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
        if (!passwordPattern.test(password)) {
            passwordError!.textContent = "Password must be at least 6 characters and include an uppercase letter, a number, and a special character.";
            passwordInput.classList.add("error");
            isValid = false;
        } else {
            passwordError!.textContent = "";
            passwordInput.classList.remove("error");
        }
        if (confirmPassword !== password) {
            confirmPasswordError!.textContent = "Passwords do not match.";
            confirmPasswordInput.classList.add("error");
            isValid = false;
        } else {
            confirmPasswordError!.textContent = "";
            confirmPasswordInput.classList.remove("error");
        }

        if (isValid) {
            setStep("login");
        }
    };

    return (
        <div className = {styles.containerLogin}>
        <div className = {styles.container}>
            <div
                className = {styles.progressBar}
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={0}
            >
            </div>
            <div className="formHeader">
                <h2 id="formTitle">
                    {
                        step === "login" ? "Log In"
                            : step === "sendEmail" ? "Send Email"
                                : "Reset Password"
                    }
                </h2>
            </div>
            <form
                className={`${styles.registrationFormLogin} ${styles.fadeIn} ${step}`}  
                aria-labelledby="formTitle"
                aria-describedby="form-description">
                    {step === "login" && (
                    <>
                        {/* Username input */}
                        <TextField
                            label="Full Name or Email"
                            type="text"
                            id="name"
                            required={true}
                            autoComplete="name"
                        />
                        {/* Password */}
                        <div className = {styles.passwordField}>
                            <PasswordField id="password" label="Password" />
                        </div>
                        <button type="submit" aria-describedby="submit-description">
                            Log in
                        </button>
                        <div className={styles.optional}>
                            <div className={styles.signUp}>
                                <p>New to IT-er?</p>
                                <Link to="/sign-up">Sign-Up</Link>
                            </div>
                            <div className= {styles.forgotPassword}>
                                <button
                                    type="button"
                                    onClick={handleForgotPassword}
                                    className={styles.forgotPasswordBtn}>
                                    Forgot Password?
                                </button>
                            </div>
                        </div>
                    </>
                )}
                {step === "sendEmail" && (
                    <>
                        {/* Email  input */}
                        <TextField
                            label="Email"
                            type="email"
                            id="forgot-email"
                            required={true}
                            autoComplete="email"
                        />
                        <span id="emailError" className={styles.errorMessage}></span>

                        <button type="submit" onClick={handleSendEmail}>
                            Send
                        </button>
                    </>
                )}
                {step === "resetPassword" && (
                    <>
                        <PasswordField id="new-password" label="New Password" />
                        <span id="passwordError" className={styles.errorMessage}></span>

                        <PasswordField id="confirm-password" label="Confirm Password" />
                        <span id="confirmPasswordError" className={styles.errorMessage}></span>

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
                        <button type="submit" onClick={handleBackToLogin} className='resetBtn'>Reset Password</button>
                    </>
                )}


            </form>
        </div>
        </div>

    )
}

export default Login
