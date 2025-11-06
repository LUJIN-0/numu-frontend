'use client'

import { Amplify } from 'aws-amplify';

// Prevent double configure
let configured = false;

export function configureAmplify() {
  if (configured) return;
  if (typeof window === 'undefined') return; // Never configure during SSR

  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID,
        userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID,
        // State which identifiers are allowed at sign-in.
        loginWith: {
          // username: true,
          email: true,
        },
      },
    },
  });

  configured = true;
}
