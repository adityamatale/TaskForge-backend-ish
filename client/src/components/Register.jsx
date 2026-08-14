function Register({
    name,
    email,
    password,
    setName,
    setEmail,
    setPassword,
    onRegister,
    onBackToLogin,
}) {
    return (
        <div className="auth-container">
            <div className="auth-card">

                <h1>Task Manager</h1>

                <p className="subtitle">
                    Create Account 
                </p>

                {/* <h2>Create account</h2> */}

                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button onClick={onRegister}>
                    Register
                </button>

                <p className="auth-switch">
                    Already have an account?{" "}
                    <button onClick={onBackToLogin}>
                        Login
                    </button>
                </p>
            </div>
        </div>
    );
}

export default Register;