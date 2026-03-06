import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useAuth() {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('accessToken');

        if (!token) {
            router.push('/login');
        }
    }, [router]);

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        router.push('/login');
    };

    const getUser = () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    };

    return { logout, getUser };
}
