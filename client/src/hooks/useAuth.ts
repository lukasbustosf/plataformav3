import { useState, useEffect } from 'react';

interface User {
    user_id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    token?: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

export const useAuth = (): AuthContextType => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simular usuario de prueba
        const mockUser: User = {
            user_id: 'test-user-id',
            first_name: 'Usuario',
            last_name: 'Demo',
            email: 'demo@edu21.cl',
            role: 'STUDENT',
            token: 'mock-token'
        };
        
        setUser(mockUser);
        setLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        // Implementación temporal
        console.log('Login:', email, password);
    };

    const logout = () => {
        setUser(null);
    };

    return {
        user,
        loading,
        login,
        logout
    };
}; 