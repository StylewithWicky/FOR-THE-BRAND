import { useState } from "react";

export default function LoginForm({ onLogin }) {
    const [isLogin , setisLogin]=useState(true);
    const [username, setusername]=useState("");
    const [password, setpassword]=useState("");

    const handleSubmit=(e: React.FormEvent)=>{
        e.preventDefault();
        onLogin(username, password);
    }

    return (
        <div className="loginform">
            <h2>{isLogin ? "Login" : "Register"}</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Username..."
                    value={username}
                    onChange={ (e) => setusername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password..."
                    value={password}
                    onChange={ (e) => setpassword(e.target.value)}
                    required
                />
                <button type="submit">{isLogin ? "Login" : "Register"}</button>
            </form>
        </div>
    )
}