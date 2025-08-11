import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { NhostProvider } from '@nhost/react';
import { nhost } from './lib/nhost';
import { apolloClient } from './lib/apollo';
import { AuthGuard } from './components/auth/AuthGuard';
import { AppLayout } from './components/layout/AppLayout';
import { SignIn } from './components/auth/SignIn';
import { SignUp } from './components/auth/SignUp';

function App() {
  // console.log('App Rendered');
  return (
    <NhostProvider nhost={nhost}>
      <ApolloProvider client={apolloClient}>
        <Router>
          <div className="min-h-screen bg-slate-50">
            <Routes>
              <Route path="/auth/signin" element={<SignIn />} />
              <Route path="/auth/signup" element={<SignUp />} />
              <Route
                path="/"
                element={
                  <AuthGuard>
                    {/* {console.log('AuthGuard triggered for / route')} */}
                    <AppLayout />
                  </AuthGuard>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </ApolloProvider>
    </NhostProvider>
  );
}

export default App;