"use client"
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';

const Product: React.FC = () => {
    const router = useRouter();
    const [isEdit, setIsEdit] = useState<string>('');

    useEffect(() => {
        if (router.isReady) {
            setIsEdit(router.query.id as string || '');
        }
    }, [router.isReady, router.query.slug]);

    if (!router.isReady) {
        return <div>Loading...</div>; // Show a loading state until the router is ready
    }

    return (
        <div>
            {router.query.id}
        </div>
    );
};

export default Product;
