import React from 'react';
import { Spinner } from '@heroui/spinner';

const Loader = () => {
  return (
    <div className='flex h-screen items-center justify-center'>
      <Spinner size='lg' className='text-primaryColor'/>
    </div>
  );
}

export default Loader;
