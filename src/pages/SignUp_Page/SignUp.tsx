import React from 'react';
import { useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './signup.module.css'
import TextField from '../../components/TextField_LoginSignUp/Textfield';
import PasswordField from '../../components/Password_TextField/PasswordField';
import InputNum from '../../components/TextFieldOnlyNumber/TextField-NumberOnly';
const SignUp = () => {
    const [isVerify, setIsVerify] = useState(false);
    const [email, setEmail] = useState("");
    const [age, setAge] = useState<number>(0);
    const [ageError, setAgeError] = useState("");

    const handleSignUp = (e: React.FormEvent) => {
        e.preventDefault();

        const emailInput = document.getElementById("email") as HTMLInputElement;
        const passwordInput = document.getElementById("password") as HTMLInputElement;
        const confirmPasswordInput = document.getElementById("confirm-password") as HTMLInputElement;

        const emailError = document.getElementById("emailError");
        const passwordError = document.getElementById("passwordError");
        const confirmPasswordError = document.getElementById("confirmPasswordError");

        const emailValue = emailInput.value;
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        let isValid = true;

        const ageNumber = Number(age);

        // Kiểm tra tuổi khi bấm Sign Up
        if (isNaN(ageNumber) || ageNumber < 13 || ageNumber > 101) {
            setAgeError("Age must be between 13 and 101.");
            isValid = false;
        } else {
            setAgeError("");
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailValue)) {
            emailError!.textContent = "Enter a valid email address.";
            emailInput.classList.add("error");
            isValid = false;
        } else {
            emailError!.textContent = "";
            emailInput.classList.remove("error");
        }

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
            setEmail(emailValue);
            setIsVerify(true);
        }
    };
    const handleVerify = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Email Verified Successfully!");
    };
    return (
        <div className = {styles.containerBodySignUp}>
        <div className = {styles.container}>
            <div
                className = {styles.progressBar}
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={0}
            >
            </div>
            <div className = {styles.formHeader}>
                <h2 id="formTitle">{isVerify ? "Verify Your Email" : "Create an Account"}</h2>
            </div>
            <form
                id={styles.registrationForm}
                aria-labelledby="form-title"
                aria-describedby="form-description"
                className={`${styles.fadeIn} ${isVerify ? styles.verifyEmail : styles.createAccount}`}
            >
                {isVerify ? (
                    <>
                        <p>We have sent a verification code to <strong>{email}</strong></p>
                        <TextField
                            label="Enter Verification Code"
                            type="text"
                            id="verification-code"
                            required={true}
                        />
                        <button type="submit" onClick={handleVerify}  className={styles.verifyBtn}>
                            Verify Email
                        </button>
                    </>
                ) : (
                    <>
                        <div className={styles.field}>
                            {/* Username input */}
                            <TextField
                                label="User Name"
                                type="name"
                                id="name"
                                required={true}
                                autoComplete="name"
                            />
                            {/* Age input */}
                            <InputNum
                                label="User Age"
                                id="age"
                                required
                                value={age}
                                onChange={(num) => setAge(num)}
                            />
                        </div>
                        <span id="ageError" className={styles.errorMessage}>{ageError}</span>

                        {/* Email input */}
                        <TextField
                            label="Email"
                            type="email"
                            id="email"
                            required={true}
                            autoComplete="email"
                        />
                        <span id="emailError" className={styles.errorMessage}></span>

                        {/* Password input */}
                        <PasswordField id="password" label="Password" />
                        <span id="passwordError" className = {styles.errorMessage}></span>

                        {/* Confirm Password input */}
                        <PasswordField id="confirm-password" label="Confirm Password" />
                        <span id="confirmPasswordError" className={styles.errorMessage}></span>
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
                        <button type="submit" onClick={handleSignUp}>
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

    )
}

export default SignUp
