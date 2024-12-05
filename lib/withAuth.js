import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const withAuth = (WrappedComponent, allowedRoles) => {
    return (props) => {
        const router = useRouter();

        useEffect(() => {
            const user = JSON.parse(localStorage.getItem('user'));

            // Redirect if the user is not logged in or role is not allowed
            if (!user || !allowedRoles.includes(user.role)) {
                router.push('/');
            }
        }, []);

        return <WrappedComponent {...props} />;
    };
};

export default withAuth;
