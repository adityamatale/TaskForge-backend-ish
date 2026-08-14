function Login({
    email,
    password,
    setEmail,
    setPassword,
    onLogin,
    onRegisterClick,
}) {
    return (
        <div className="auth-container">
            <div className="auth-card">

                <h1>Task Manager</h1>

                <p className="subtitle">
                    Manage your tasks. Stay organized.
                </p>

                {/* <h2>Welcome back</h2> */}

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

                <button onClick={onLogin}>
                    Login
                </button>

                <p className="auth-switch">
                    Don't have an account?
                    <button onClick={onRegisterClick}>
                        Register
                    </button>
                </p>

            </div>
        </div>
    );
}

export default Login;