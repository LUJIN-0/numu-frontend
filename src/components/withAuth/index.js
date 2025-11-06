'use client'

import AuthGuard from "../authGuard";

export function withAuth(Component) {
  return function ProtectedPage(props) {
    return (
      <AuthGuard>
        <Component {...props} />
      </AuthGuard>
    );
  };
}
