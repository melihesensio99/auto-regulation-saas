import { useState, useEffect, useRef } from 'react';
import { exerciseService } from '../services/exerciseService';
import type { ExerciseLibraryDto } from '../services/exerciseService';

interface ExerciseAutocompleteProps {
    value: string;
    onChange: (value: string) => void;
    onSelectExercise?: (exercise: ExerciseLibraryDto) => void;
}

export const ExerciseAutocomplete = ({ value, onChange, onSelectExercise }: ExerciseAutocompleteProps) => {
    const [query, setQuery] = useState(value);
    const [results, setResults] = useState<ExerciseLibraryDto[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const debounceTimeout = useRef<number | null>(null);

    const cloudinaryBase = 'https://res.cloudinary.com/dc2j01x6b/image/upload/v1/';

    useEffect(() => {
        setQuery(value);
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (searchTerm: string) => {
        setQuery(searchTerm);
        onChange(searchTerm);

        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        if (searchTerm.trim().length < 2) {
            setResults([]);
            setIsOpen(false);
            return;
        }

        debounceTimeout.current = window.setTimeout(async () => {
            setIsLoading(true);
            try {
                const data = await exerciseService.searchExercises(searchTerm);
                setResults(data);
                setIsOpen(true);
            } catch (error) {
                console.error("Failed to search exercises", error);
            } finally {
                setIsLoading(false);
            }
        }, 300);
    };

    const handleSelect = (exercise: ExerciseLibraryDto) => {
        setQuery(exercise.name);
        onChange(exercise.name);
        setIsOpen(false);
        if (onSelectExercise) {
            onSelectExercise(exercise);
        }
    };

    return (
        <div className="autocomplete-wrapper" ref={wrapperRef}>
            <input
                type="text"
                className="field-input"
                placeholder="Bench Press, Squat..."
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => {
                    if (results.length > 0) setIsOpen(true);
                }}
                required
            />
            
            {isLoading && <div className="autocomplete-loader"></div>}

            {isOpen && results.length > 0 && (
                <div className="autocomplete-dropdown">
                    {results.map((exercise) => (
                        <div
                            key={exercise.id}
                            className="autocomplete-item"
                            onClick={() => handleSelect(exercise)}
                        >
                            <img 
                                src={`${cloudinaryBase}${exercise.gifUrl?.split('/').pop() || exercise.imageUrl?.split('/').pop()}`} 
                                alt={exercise.name} 
                                className="autocomplete-thumb"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="%23333"><rect width="40" height="40" fill="%23eee"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="12">?</text></svg>';
                                }}
                            />
                            <div className="autocomplete-info">
                                <strong>{exercise.name}</strong>
                                <span>{exercise.targetMuscle}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
