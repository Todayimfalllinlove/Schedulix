import { supabase } from "@/lib/supabaseClient";
import { useState, useEffect, FormEvent } from "react";
import type { Session } from "@supabase/supabase-js";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Auth = () => {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const showMessage = (type: 'success' | 'error', text: string) => {
        setMessage({ type, text });
    };

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange((_event, currentSession) => {
            setSession(currentSession as Session | null);
            setLoading(false);
        });

        supabase.auth.getSession().then(({ data: { session: initialSession }, error }) => {
            if (error) {
                console.error('Error getting initial session:', error.message);
                showMessage('error', `Loading session error: ${error.message}`);
            }
            setSession(initialSession as Session | null);
            setLoading(false);
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    // Redirect to dashboard if logged in
    useEffect(() => {
        if (session) {
            navigate("/dashboard");
        }
    }, [session, navigate]);

    const handleSignUp = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: 'http://localhost:8080/dashboard'
            }
        });

        if (error) {
            console.error('Sign up error:', error.message);
            showMessage('error', `Registration Failed ${error.message}`);

        } else {
            // ตรวจสอบว่าอีเมลมีอยู่แล้วหรือไม่
            if (data.user && data.user.identities && data.user.identities.length === 0) {
                showMessage('error', 'Email already exits, Please login instead');
            } else if (data.user) { // ถ้าการสมัครสมาชิกสำเร็จและมี user object
                showMessage('success', 'Registration Success! Please Check Email to Confirm.');
                setEmail('');
                setPassword('');
            } else {
                // กรณีอื่นๆ ที่ไม่มี user object แต่ไม่มี error (อาจจะไม่เกิดขึ้นบ่อย)
                showMessage('success', 'Registration initiated. Please check your email for confirmation.');
                setEmail('');
                setPassword('');
            }
        }
        setLoading(false);
    };

    const handleSignIn = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            console.error('Sign in error:', error.message);
            showMessage('error', `Login Failed: ${error.message}`);
        } else {
            console.log('User logged in:', data.user);
            showMessage('success', 'Login Success!');
            setEmail('');
            setPassword('');
        }
        setLoading(false);
    };

    const handleSignOut = async () => {
        setLoading(true);
        setMessage(null);

        const { error } = await supabase.auth.signOut();

        if (error) {
            console.error('Sign out error:', error.message);
            showMessage('error', `Logout Failed: ${error.message}`);
        } else {
            console.log('User logged out');
            showMessage('success', 'Logout Success!');
        }
        setLoading(false);
    };
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen">
                {/* Background decorative elements */}
                <div className="absolute overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                    <div className="absolute top-40 left-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
                </div>

                <Card className="relative p-8 w-full max-w-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-2xl">
                    {/* Logo/Brand Section */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                            <img src="/Img/logo_white.png" alt="Logo"/>
                        </div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Schedulix
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            {isLogin ? 'Welcome back! Please sign in to your account.' : 'Create your account to get started.'}
                        </p>
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="mb-6 flex items-center justify-center space-x-2 text-blue-600">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                            <span className="text-sm font-medium">Loading...</span>
                        </div>
                    )}

                    {/* Message Display */}
                    {message && (
                        <div className={`mb-6 p-4 rounded-lg border-l-4 flex items-center space-x-3 ${message.type === 'error'
                            ? 'bg-red-50 text-red-700 border-red-400 dark:bg-red-900/20 dark:text-red-300 dark:border-red-500'
                            : 'bg-green-50 text-green-700 border-green-400 dark:bg-green-900/20 dark:text-green-300 dark:border-green-500'
                            }`}>
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${message.type === 'error' ? 'bg-red-100 dark:bg-red-800' : 'bg-green-100 dark:bg-green-800'
                                }`}>
                                {message.type === 'error' ? (
                                    <svg className="w-3 h-3 text-red-600 dark:text-red-300" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg className="w-3 h-3 text-green-600 dark:text-green-300" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </div>
                            <span className="text-sm font-medium">{message.text}</span>
                        </div>
                    )}

                    {/* Auth Form */}
                    {!session ? (
                        <form onSubmit={isLogin ? handleSignIn : handleSignUp} className="space-y-6">
                            {/* Email Field */}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Email Address
                                </Label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                        </svg>
                                    </div>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        required
                                        className="pl-10 h-12 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                        placeholder="Enter your email address"
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Password
                                </Label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 012 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        required
                                        className="pl-10 pr-10 h-12 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                        placeholder="Enter your password"
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={() => setShowPassword(!showPassword)}
                                        disabled={loading}
                                    >
                                        {showPassword ? (
                                            <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                            </svg>
                                        ) : (
                                            <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                {!isLogin && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Password must be at least 6 characters long
                                    </p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                                disabled={loading}
                            >
                                {loading ? (
                                    <div className="flex items-center space-x-2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        <span>Processing...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-2">
                                        {isLogin ? (
                                            <>
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                                </svg>
                                                <span>Sign In</span>
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                                </svg>
                                                <span>Create Account</span>
                                            </>
                                        )}
                                    </div>
                                )}
                            </Button>
                        </form>
                    ) : (
                        /* Logged In State */
                        <div className="text-center space-y-6">
                            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full mx-auto flex items-center justify-center">
                                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Welcome back!</h3>
                                <p className="text-gray-600 dark:text-gray-400 mt-1">
                                    Logged in as <span className="font-medium text-blue-600 dark:text-blue-400">{session.user.email}</span>
                                </p>
                            </div>
                            <Button
                                onClick={handleSignOut}
                                className="w-full h-12 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                                disabled={loading}
                            >
                                {loading ? (
                                    <div className="flex items-center space-x-2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        <span>Signing out...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        <span>Sign Out</span>
                                    </div>
                                )}
                            </Button>
                        </div>
                    )}

                    {/* Toggle between Login/Signup */}
                    {!session && (
                        <div className="mt-8 text-center">
                            <div className="relative">
                                <div className="absolute flex items-center">
                                    <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                                    </span>
                                </div>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                className="mt-4 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                onClick={() => {
                                    setIsLogin(!isLogin);
                                    setMessage(null);
                                    setEmail('');
                                    setPassword('');
                                }}
                                disabled={loading}
                            >
                                {isLogin ? 'Create a new account' : 'Sign in to existing account'}
                            </Button>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default Auth;