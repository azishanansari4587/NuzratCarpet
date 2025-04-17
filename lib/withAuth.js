import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const withAuth = (WrappedComponent, allowedRoles) => {
    
    const WithAuthComponent = (props) => {
        const router = useRouter();
        
        useEffect(() => {
            const user = JSON.parse(localStorage.getItem('user'));

            // Redirect if the user is not logged in or role is not allowed
            if (!user || !allowedRoles.includes(user.role)) {
                router.push('/');
            }
        }, [router]);

        return <WrappedComponent {...props} />;
    };

    // Set a displayName for better debugging
    WithAuthComponent.displayName = `WithAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

    return WithAuthComponent;
};

export default withAuth;
