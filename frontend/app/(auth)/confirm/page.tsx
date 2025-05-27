"use client"
import { useEffect,useState } from 'react';
import {authApi} from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useParams,useSearchParams } from 'next/navigation';
export default function ConfirmPage() {
    const [error, setError] = useState(null);
    const params = useSearchParams();
    const router = useRouter();
    useEffect(() => {
        const confirmEmail = async () => {
            try {
                await authApi.confirm({ user_id: params.get('user_id'), code: params.get('code') });
                // Redirect to login page after successful confirmation
                router.push('/login');
            } catch (error) {
                console.error('Email confirmation failed:', error);
                setError('Email confirmation failed. Please try again.');   
            }
        };

        confirmEmail();
    }, []);
    
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Confirming Email...</h1>
            {error && <p className="text-red-500">{error}</p>}
            {!error && <p className="text-green-500">Your email has been confirmed successfully!</p>}
            <p className="text-gray-500">Redirecting to login page...</p>
        </div>
    );

}