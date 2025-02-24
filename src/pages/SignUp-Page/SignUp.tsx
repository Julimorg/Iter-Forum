import React from 'react';
import { useState } from 'react'
import { Link } from 'react-router-dom'
import './signup.css'
import TextField from '../../components/TexField/Textfield';
import PasswordField from '../../components/Password-TextField/PasswordField';

const SignUp = () => {
    const [isVerify, setIsVerify] = useState(false);
    const [email, setEmail] = useState("");

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
        <div className="container">
            <div
                className="progress-bar"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={0}
            >
            </div>
            <div className="form-header">
                <h2 id="form-title">{isVerify ? "Verify Your Email" : "Create an Account"}</h2>
            </div>
            <form
                id="registrationForm"
                aria-labelledby="form-title"
                aria-describedby="form-description"
                className={`fade-in ${isVerify ? "verify-email" : "create-account"}`}
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
                        <button type="submit" onClick={handleVerify}>
                            Verify Email
                        </button>
                    </>
                ) : (
                    <>
                        {/* Username input */}
                        <TextField
                            label="User Name"
                            type="name"
                            id="name"
                            required={true}
                            autoComplete="name"
                        />
                        <TextField
                            label="Email"
                            type="email"
                            id="email"
                            required={true}
                            autoComplete="email"
                        />
                        <span id="emailError" className="error-message"></span>

                        {/* Password input */}
                        <PasswordField id="password" label="Password" />
                        <span id="passwordError" className="error-message"></span>

                        {/* Confirm Password input */}
                        <PasswordField id="confirm-password" label="Confirm Password" />
                        <span id="confirmPasswordError" className="error-message"></span>
                        <div
                            id="password-requirements"
                            className="password-requirements"
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
                        <button type="submit" onClick={handleSignUp}>
                            Sign Up
                        </button>

                        <div className="optional">
                            <p>Already have an account?</p>
                            <Link to="/login">Log In</Link>
                        </div>
                    </>
                )}
            </form>
        </div>

    )
}

export default SignUp
