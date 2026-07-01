import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { athleteService, type OnboardingData } from '../../athlete-portal/services/athleteService';

export const Onboarding: React.FC = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState<Partial<OnboardingData>>({
        heightCm: 175,
        startingWeightKg: 70,
        dateOfBirth: '2000-01-01',
        phoneNumber: '',
        occupation: '',
        mainReason: 1, // 1 = MuscleHypertrophy, 2 = FatLoss, 3 = StrengthGain, 4 = Endurance, 5 = GeneralFitness, 6 = Rehab
        shortTermGoal: '',
        longTermGoal: '',
        expectations: '',
        trainingHistory: '',
        currentTrainingRoutine: '',
        outsidePhysicalActivity: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            await athleteService.submitOnboarding(formData as OnboardingData);
            // Refresh token logic or redirect
            navigate('/athlete/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Onboarding failed. Please check all fields.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-dark-bg text-white p-8 overflow-y-auto selection:bg-neon-cyan/30 relative">
            {/* Background Glow */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-cyan/20 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-purple/20 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="max-w-3xl mx-auto glass-panel p-8 md:p-12 relative z-10">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold glow-text mb-4">Welcome to SmartCoaching!</h1>
                    <p className="text-gray-400 text-lg">Let's get to know you so your coach can create the perfect program.</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    
                    {/* Basic Info */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold border-b border-white/10 pb-2 text-neon-cyan">1. Basic Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Height (cm)</label>
                                <input type="number" name="heightCm" value={formData.heightCm} onChange={handleChange} required className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-neon-cyan transition-all outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Weight (kg)</label>
                                <input type="number" name="startingWeightKg" value={formData.startingWeightKg} onChange={handleChange} required className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-neon-cyan transition-all outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Date of Birth</label>
                                <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-neon-cyan transition-all outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                                <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-neon-cyan transition-all outline-none" placeholder="+1234567890" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-300 mb-2">Occupation / School</label>
                                <input type="text" name="occupation" value={formData.occupation} onChange={handleChange} required className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-neon-cyan transition-all outline-none" placeholder="e.g. Software Engineer, Student" />
                            </div>
                        </div>
                    </div>

                    {/* Goals & Expectations */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold border-b border-white/10 pb-2 text-neon-purple">2. Goals & Expectations</h2>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Main Goal</label>
                            <select name="mainReason" value={formData.mainReason} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-neon-purple transition-all outline-none">
                                <option value={1}>Muscle Gain (Hypertrophy)</option>
                                <option value={2}>Fat Loss / Weight Loss</option>
                                <option value={3}>Strength Gain</option>
                                <option value={4}>Endurance / Conditioning</option>
                                <option value={5}>General Fitness & Health</option>
                                <option value={6}>Rehabilitation / Recovery</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Short Term Goal (1-3 months)</label>
                                <textarea name="shortTermGoal" value={formData.shortTermGoal} onChange={handleChange} required rows={3} className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-neon-purple transition-all outline-none" placeholder="e.g. Lose 5kg or bench 100kg" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Long Term Goal (1 year+)</label>
                                <textarea name="longTermGoal" value={formData.longTermGoal} onChange={handleChange} required rows={3} className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-neon-purple transition-all outline-none" placeholder="e.g. Compete in powerlifting or get visible abs" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">What do you expect from your coach?</label>
                            <textarea name="expectations" value={formData.expectations} onChange={handleChange} required rows={2} className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-neon-purple transition-all outline-none" placeholder="Communication, strict diet, flexibility..." />
                        </div>
                    </div>

                    {/* Fitness Background */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold border-b border-white/10 pb-2 text-yellow-400">3. Fitness Background</h2>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Training History</label>
                            <textarea name="trainingHistory" value={formData.trainingHistory} onChange={handleChange} required rows={3} className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-yellow-400 transition-all outline-none" placeholder="How long have you been lifting? Any past sports?" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Current Training Routine</label>
                            <textarea name="currentTrainingRoutine" value={formData.currentTrainingRoutine} onChange={handleChange} required rows={3} className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-yellow-400 transition-all outline-none" placeholder="What are you currently doing? e.g. 3 days push/pull/legs" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Outside Physical Activity</label>
                            <textarea name="outsidePhysicalActivity" value={formData.outsidePhysicalActivity} onChange={handleChange} required rows={2} className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-yellow-400 transition-all outline-none" placeholder="e.g. I walk 10k steps a day, play soccer on weekends" />
                        </div>
                    </div>

                    <div className="pt-8">
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full glow-btn-cyan py-4 text-lg font-bold flex justify-center items-center"
                        >
                            {isLoading ? 'Submitting...' : 'Complete Profile & Go to Dashboard'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};
