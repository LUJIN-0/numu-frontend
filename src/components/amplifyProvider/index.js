'use client'

import { useEffect } from 'react';
import { configureAmplify } from '@/config/awsConfig';

export default function AmplifyProvider({ children }) {
  useEffect(() => {
    configureAmplify();
  }, []);

  return <>{children}</>;
}
