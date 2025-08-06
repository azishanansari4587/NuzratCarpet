"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';


export default function ResetPassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState(''); 
    const router = useRouter();
    // const searchParams = useSearchParams(); // Use this to access query parameters
    const token = router.query; // Get the token from the URL

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('api/resetPassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token, password, confirmPassword }),
            });
            const data = await response.json();
            
            if (response.ok) {
                setMessage(data.message);
                // router.push('/login');
            }
        } catch (error) {
            setMessage(error.message + ' Password reset failed');
        }
    };

    return (
        <div>
            <h1>Reset Password</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button type="submit">Submit</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}