import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Activity, Dumbbell, Zap } from 'lucide-react';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'coach' | 'athlete'>('coach');
    const { login, isLoading, error } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await login({ email, password, role });
    };

    return (
        <div className="min-h-screen bg-dark-bg text-white flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-cyan/20 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-purple/20 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                
                {/* Left Side: Branding */}
                <div className="flex flex-col justify-center space-y-8 p-8 hidden md:flex">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-neon-cyan/20 border border-neon-cyan flex items-center justify-center">
                            <Activity className="w-6 h-6 text-neon-cyan" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-wider glow-text">SMARTCOACH</h1>
                    </div>
                    
                    <div>
                        <h2 className="text-4xl font-bold leading-tight mb-4">
                            Premium Coaching <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple">Re-imagined.</span>
                        </h2>
                        <p className="text-gray-400 text-lg">
                            Elevate your fitness business with AI-powered nutrition tracking, dynamic workouts, and seamless communication.
                        </p>
                    </div>

                    <div className="space-y-4 pt-8 border-t border-white/10">
                        <div className="flex items-center gap-4 text-gray-300">
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10"><Dumbbell className="w-5 h-5 text-neon-purple" /></div>
                            <span>AI-generated Hypertrophy Programs</span>
                        </div>
                        <div className="flex items-center gap-4 text-gray-300">
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10"><Zap className="w-5 h-5 text-neon-cyan" /></div>
                            <span>Mistral Pixtral Calorie Scanning</span>
                        </div>
                    </div>
                </div>

                {/* Right Side: Login Form */}
                <div className="glass-panel p-8 md:p-12 w-full max-w-md mx-auto">
                    <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
                    <p className="text-gray-400 mb-8">Sign in to access your dashboard.</p>

                    <div className="flex gap-2 mb-8 bg-black/40 p-1 rounded-xl border border-white/10">
                        <button
                            type="button"
                            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${role === 'coach' ? 'bg-white/10 text-white shadow-md border border-white/5' : 'text-gray-400 hover:text-white'}`}
                            onClick={() => setRole('coach')}
                        >
                            Coach
                        </button>
                        <button
                            type="button"
                            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${role === 'athlete' ? 'bg-white/10 text-white shadow-md border border-white/5' : 'text-gray-400 hover:text-white'}`}
                            onClick={() => setRole('athlete')}
                        >
                            Athlete
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                            <input
                                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-all"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                            <input
                                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-all"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full glow-btn-cyan py-3.5 flex justify-center mt-4"
                        >
                            {isLoading ? 'Authenticating...' : 'Sign In'}
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
};
