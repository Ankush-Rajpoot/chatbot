import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useSignInEmailPassword, useAuthenticationStatus } from '@nhost/react';
import { Mail, Lock, Eye, EyeOff, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

export const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { signInEmailPassword, isLoading, isError, error } = useSignInEmailPassword();
  const { isAuthenticated } = useAuthenticationStatus();

  // console.log('SignIn Rendered');
  // console.log('isAuthenticated:', isAuthenticated);
  // console.log('isLoading:', isLoading);
  // console.log('isError:', isError);
  // if (error) console.log('SignIn Error:', error);

  if (isAuthenticated) {
    // console.log('User is authenticated, redirecting to /');
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // console.log('SignIn form submitted', { email, password });
    try {
      const result = await signInEmailPassword(email, password);
      // console.log('signInEmailPassword result:', result);
    } catch (err) {
      // console.error('SignIn API error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-3">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        <Card className="shadow-xl">
          <CardHeader className="text-center pb-4">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-accent rounded-xl mb-3 mx-auto">
              <MessageCircle className="h-6 w-6 text-accent-foreground" />
            </div>
            <CardTitle className="text-lg font-bold">Welcome Back</CardTitle>
            <CardDescription className="text-sm">Sign in to continue your conversations</CardDescription>
          </CardHeader>
          
          <CardContent className="pt-0">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9 h-9"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9 pr-10 h-9"
                    placeholder="Enter your password"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </Button>
                </div>
              </div>

              {isError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-destructive/10 border border-destructive/20 rounded-lg p-2.5"
                >
                  <p className="text-destructive text-sm">{error?.message || 'Sign in failed'}</p>
                </motion.div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-9"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full"
                  />
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-muted-foreground text-sm">
                Don't have an account?{' '}
                <Link to="/auth/signup" className="text-primary hover:text-primary/80 font-medium">
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};