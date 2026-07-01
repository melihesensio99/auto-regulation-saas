import React, { useState } from 'react';
import { X, Search, Plus, Dumbbell, Save, Trash2, Edit2 } from 'lucide-react';
import { coachService, type ExerciseDto } from '../services/coachService';

interface WorkoutProgramModalProps {
    athleteId: string;
    initialExercises?: any[];
    initialDay?: string;
    onClose: () => void;
    onSaved: () => void;
}

export const WorkoutProgramModal: React.FC<WorkoutProgramModalProps> = ({ athleteId, initialExercises, initialDay, onClose, onSaved }) => {
    const [exercises, setExercises] = useState<any[]>(initialExercises || []);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    
    // Form state
    const [dayName, setDayName] = useState(initialDay || 'Monday');
    const [previewDay, setPreviewDay] = useState(initialDay || 'Monday');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<ExerciseDto[]>([]);
    const [selectedExercise, setSelectedExercise] = useState<ExerciseDto | null>(null);
    const [sets, setSets] = useState('3');
    const [reps, setReps] = useState('10');
    const [restTime, setRestTime] = useState('90');
    
    const [isSaving, setIsSaving] = useState(false);

    const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (query.length > 2) {
            try {
                const results = await coachService.searchExercises(query);
                setSearchResults(results);
            } catch (error) {
                console.error("Search failed", error);
            }
        } else {
            setSearchResults([]);
        }
    };

    const handleAddExercise = () => {
        if (!selectedExercise) return;
        
        const newEx = {
            exerciseLibraryId: selectedExercise.id,
            exerciseName: selectedExercise.name,
            targetMuscle: selectedExercise.bodyPart,
            gifUrl: selectedExercise.gifUrl,
            dayName,
            sets: parseInt(sets),
            reps,
            restTimeInSeconds: parseInt(restTime)
        };

        if (editingIndex !== null) {
            const updatedExercises = [...exercises];
            updatedExercises[editingIndex] = newEx;
            setExercises(updatedExercises);
            setEditingIndex(null);
        } else {
            setExercises([...exercises, newEx]);
        }
        
        setPreviewDay(dayName);
        setSelectedExercise(null);
        setSearchQuery('');
    };

    const handleSaveProgram = async () => {
        if (exercises.length === 0) return;
        setIsSaving(true);
        try {
            await coachService.assignWorkoutProgram(athleteId, exercises);
            onSaved();
        } catch (error) {
            console.error("Failed to save program", error);
            alert("Failed to save program");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="glass-panel w-full max-w-6xl max-h-[90vh] flex flex-col border border-neon-cyan/30 shadow-[0_0_30px_rgba(0,240,255,0.15)] rounded-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-white/10 flex items-center justify-between bg-black/40">
                    <div className="flex items-center gap-3">
                        <Dumbbell className="w-6 h-6 text-neon-cyan" />
                        <h2 className="text-2xl font-bold text-white">Create Workout Program</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                <div className="flex flex-col md:flex-row gap-6 h-full min-h-[500px] p-6">
                    {/* Left Column - Form */}
                    <div className="w-full md:w-[360px] shrink-0 flex flex-col gap-5">
                        <h3 className="text-sm font-semibold text-neon-cyan border-b border-white/10 pb-2 mb-4">Add Exercise</h3>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Day of Week</label>
                            <select 
                                value={dayName} 
                                onChange={e => setDayName(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-neon-cyan outline-none"
                            >
                                <option value="Monday">Monday</option>
                                <option value="Tuesday">Tuesday</option>
                                <option value="Wednesday">Wednesday</option>
                                <option value="Thursday">Thursday</option>
                                <option value="Friday">Friday</option>
                                <option value="Saturday">Saturday</option>
                                <option value="Sunday">Sunday</option>
                            </select>
                        </div>

                        <div className="relative">
                            <label className="block text-sm text-gray-400 mb-1">Search Exercise</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input 
                                    type="text" 
                                    value={searchQuery}
                                    onChange={handleSearch}
                                    placeholder="e.g. Bench Press"
                                    className="w-full bg-black/50 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:border-neon-cyan outline-none"
                                />
                            </div>
                            
                            {searchResults.length > 0 && (
                                <div className="absolute z-10 w-full mt-1 bg-[#121212] border border-white/10 rounded-lg shadow-xl max-h-64 overflow-y-auto">
                                    {searchResults.map(ex => (
                                        <button 
                                            key={ex.id}
                                            onClick={() => {
                                                setSelectedExercise(ex);
                                                setSearchQuery(ex.name);
                                                setSearchResults([]);
                                            }}
                                            className="w-full text-left px-4 py-3 hover:bg-neon-cyan/20 flex items-center gap-4 transition-colors"
                                        >
                                            <div>
                                                <div className="text-sm font-medium text-white capitalize">{ex.name}</div>
                                                <div className="text-xs text-gray-400">{ex.bodyPart} • {ex.equipment}</div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Sets</label>
                                <input 
                                    type="number" 
                                    value={sets}
                                    onChange={e => setSets(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-2 text-white focus:outline-none focus:border-neon-cyan transition-colors text-center"
                                    placeholder="3"
                                    min="1"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Reps</label>
                                <input 
                                    type="text" 
                                    value={reps}
                                    onChange={e => setReps(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-2 text-white focus:outline-none focus:border-neon-cyan transition-colors text-center"
                                    placeholder="10-12"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Rest(s)</label>
                                <input 
                                    type="number" 
                                    value={restTime}
                                    onChange={e => setRestTime(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-2 text-white focus:outline-none focus:border-neon-cyan transition-colors text-center"
                                    placeholder="90"
                                    min="0"
                                    step="15"
                                />
                            </div>
                        </div>

                        <button 
                            onClick={handleAddExercise}
                            disabled={!selectedExercise}
                            className={`w-full py-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
                                !selectedExercise ? 'bg-white/5 text-gray-500 cursor-not-allowed' :
                                editingIndex !== null ? 'bg-neon-cyan text-black font-bold hover:bg-neon-cyan/90 shadow-[0_0_15px_rgba(0,255,255,0.3)]' :
                                'bg-white/10 hover:bg-neon-cyan/20 text-white hover:text-neon-cyan border border-white/10 hover:border-neon-cyan'
                            }`}
                        >
                            {editingIndex !== null ? (
                                <>
                                    <Edit2 className="w-4 h-4" />
                                    Update Exercise
                                </>
                            ) : (
                                <>
                                    <Plus className="w-4 h-4" />
                                    Add to Program
                                </>
                            )}
                        </button>
                        {editingIndex !== null && (
                            <button 
                                onClick={() => {
                                    setEditingIndex(null);
                                    setSelectedExercise(null);
                                    setSearchQuery('');
                                }}
                                className="w-full text-xs text-gray-400 hover:text-white transition-colors mt-2 text-center"
                            >
                                Cancel Edit
                            </button>
                        )}
                    </div>

                        <div className="flex-1 bg-black/50 rounded-xl border border-white/5 p-6 flex flex-col h-full max-h-[600px] overflow-hidden">
                            <h3 className="text-lg font-semibold text-white mb-4 shrink-0">Program Preview</h3>
                            
                            <div className="flex-1 flex flex-col h-full overflow-hidden">
                                {/* Modal Preview Day Tabs */}
                                <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-2 shrink-0 scrollbar-hide border-b border-white/10">
                                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
                                        .map(day => (
                                            <button
                                                key={day}
                                                onClick={() => {
                                                    setPreviewDay(day);
                                                    setDayName(day);
                                                }}
                                                className={`px-4 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                                                    previewDay === day 
                                                    ? 'bg-neon-cyan text-black' 
                                                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                                }`}
                                            >
                                                {day}
                                            </button>
                                    ))}
                                </div>
                                
                                <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                                    {exercises.filter(ex => ex.dayName === previewDay).length === 0 ? (
                                        <div className="flex flex-col items-center justify-center text-gray-500 opacity-50 h-40">
                                            <Dumbbell className="w-8 h-8 mb-2" />
                                            <p>Rest Day (Off Day)</p>
                                        </div>
                                    ) : (
                                        exercises
                                        .filter(ex => ex.dayName === previewDay)
                                            .map((ex, i) => (
                                            <div key={i} className="bg-white/5 p-3 rounded-lg border border-white/5 flex items-center gap-3 group relative hover:border-white/10 transition-colors w-full overflow-hidden">
                                                <div className="flex-1 min-w-0 pr-2">
                                                    <span className="text-[10px] text-neon-cyan block mb-0.5">{ex.dayName}</span>
                                                    <span className="font-medium text-white text-sm capitalize truncate block">{ex.exerciseName}</span>
                                                </div>
                                                
                                                <div className="flex items-center gap-2 shrink-0">
                                                    <div className="text-right text-xs text-gray-400 bg-black/30 px-2 py-1 rounded whitespace-nowrap">
                                                        {ex.sets}x{ex.reps} - {ex.restTimeInSeconds}s rest
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <button 
                                                            onClick={() => {
                                                                setEditingIndex(exercises.indexOf(ex));
                                                                setDayName(ex.dayName);
                                                                setSets(ex.sets.toString());
                                                                setReps(ex.reps);
                                                                setRestTime(ex.restTimeInSeconds.toString());
                                                                setSearchQuery(ex.exerciseName);
                                                                setSelectedExercise({
                                                                    id: ex.exerciseLibraryId || '',
                                                                    name: ex.exerciseName,
                                                                    bodyPart: ex.targetMuscle || '',
                                                                    equipment: '',
                                                                    gifUrl: ex.gifUrl || ''
                                                                });
                                                            }} 
                                                            className={`p-1.5 rounded transition-colors ${
                                                                editingIndex === exercises.indexOf(ex) ? 'bg-neon-cyan/20 text-neon-cyan' : 'hover:bg-neon-cyan/20 text-gray-500 hover:text-neon-cyan'
                                                            }`}
                                                            title="Edit Exercise"
                                                        >
                                                            <Edit2 className="w-4 h-4" />
                                                        </button>
                                                        <button 
                                                            onClick={() => {
                                                                const newEx = [...exercises];
                                                                newEx.splice(exercises.indexOf(ex), 1);
                                                                setExercises(newEx);
                                                                if (!newEx.some(e => e.dayName === previewDay) && newEx.length > 0) {
                                                                    setPreviewDay(newEx[0].dayName);
                                                                }
                                                            }} 
                                                            className="p-1.5 hover:bg-red-500/20 text-gray-500 hover:text-red-400 rounded transition-colors"
                                                            title="Remove Exercise"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )))}
                                </div>
                            </div>
                        </div>
                </div>

                <div className="p-6 border-t border-white/10 bg-black/40 flex justify-end gap-3">
                    <button onClick={onClose} className="px-6 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                        Cancel
                    </button>
                    <button 
                        onClick={handleSaveProgram}
                        disabled={exercises.length === 0 || isSaving}
                        className={`glow-btn-cyan flex items-center gap-2 px-8 py-2 ${exercises.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isSaving ? 'Saving...' : <><Save className="w-4 h-4" /> Save Program</>}
                    </button>
                </div>
            </div>
        </div>
    );
};
