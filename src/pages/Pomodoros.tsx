import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Timer, Play, Pause, RefreshCw, ArrowLeft } from 'lucide-react';

enum TimerMode {
    Pomodoro = 'Pomodoro',
    ShortBreak = 'Short Break',
    LongBreak = 'Long Break',
}

const POMODORO_DURATION = 25 * 60; // 25 minutes
const SHORT_BREAK_DURATION = 5 * 60;  // 5 minutes
const LONG_BREAK_DURATION = 15 * 60; // 15 minutes
const LONG_BREAK_INTERVAL = 4; // Long break after 4 Pomodoros

const Pomodoros = () => {
    const [secondsLeft, setSecondsLeft] = useState<number>(POMODORO_DURATION);
    const [mode, setMode] = useState<TimerMode>(TimerMode.Pomodoro);
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [pomodorosCompleted, setPomodorosCompleted] = useState<number>(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);


    useEffect(() => {
        const audioData = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBIAAAAHAAEARQAAIA+AAABAAAECAAACABAAZGF0YQQAAAAAAIA/AAA=';

        if (!audioRef.current) {
            audioRef.current = new Audio();
        }
        audioRef.current.src = audioData;
        audioRef.current.load();
    }, []);

    const resetTimer = (newMode: TimerMode) => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        let duration = 0;
        switch (newMode) {
            case TimerMode.Pomodoro:
                duration = POMODORO_DURATION;
                break;
            case TimerMode.ShortBreak:
                duration = SHORT_BREAK_DURATION;
                break;
            case TimerMode.LongBreak:
                duration = LONG_BREAK_DURATION;
                break;
        }

        setMode(newMode);
        setSecondsLeft(duration);
        setIsRunning(false);
    };

    const startTimer = () => {
        setIsRunning(true);
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        intervalRef.current = setInterval(() => {
            setSecondsLeft(prevSeconds => {
                if (prevSeconds <= 1) {
                    if (audioRef.current) {
                        audioRef.current.play();
                    }

                    if (mode === TimerMode.Pomodoro) {
                        const newPomodorosCompleted = pomodorosCompleted + 1;
                        setPomodorosCompleted(newPomodorosCompleted);

                        if (newPomodorosCompleted % LONG_BREAK_INTERVAL === 0) {
                            resetTimer(TimerMode.LongBreak);
                        } else {
                            resetTimer(TimerMode.ShortBreak);
                        }
                    } else {
                        resetTimer(TimerMode.Pomodoro);
                    }
                    return 0;
                }
                return prevSeconds - 1;
            });
        }, 1000);
    };

    const pauseTimer = () => {
        setIsRunning(false);
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    const resetToPomodoro = () => {
        setPomodorosCompleted(0);
        resetTimer(TimerMode.Pomodoro);
    };

    useEffect(() => {
        if (!isRunning && secondsLeft === POMODORO_DURATION && mode === TimerMode.Pomodoro) {
        } else if (isRunning && secondsLeft === 0) {
     } 
    }, [secondsLeft, mode, isRunning]);
    const formatTime = (totalSeconds: number): string => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const getBackgroundColor = (currentMode: TimerMode): string => {
        switch (currentMode) {
            case TimerMode.Pomodoro:
                return 'bg-red-600';
            case TimerMode.ShortBreak:
                return 'bg-blue-600';
            case TimerMode.LongBreak:
                return 'bg-green-600';
            default:
                return 'bg-gray-700';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-x-hidden">

            {/* Background decorative elements */}
            <div className="absolute">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute top-40 left-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
            </div>

            <div className="container mx-auto px-4 py-8 relative">

                {/* Header */}
                <div className="flex items-center mb-8">
                    <Link to="/" className="mr-4 hidden sm:inline-flex">
                        <Button variant="ghost" size="sm" className="hover:bg-white/20 dark:hover:bg-gray-800/20">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back
                        </Button>
                    </Link>
                    <div className="flex items-center">
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl mr-3 flex items-center justify-center shadow-lg">
                            <Timer className="h-5 w-5 text-white" />
                        </div>
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Pomodoro Timer</h1>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-16 flex items-center justify-center ">
                    <Card className="p-6 md:p-10 w-full max-w-md text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-2xl">
                        <div className="flex flex-col items-center mb-6">
                            <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mb-4">
                                <Timer className="w-7 h-7 md:w-8 md:h-8 text-white" />
                            </div>
                            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Pomodoro Timer</h1>
                        </div>

                        {/* choose mode Tab */}
                        <div className="flex justify-center gap-2 mb-8 bg-gray-100 dark:bg-gray-700 rounded-xl p-2 shadow-inner">
                            {Object.values(TimerMode).map(timerMode => (
                                <Button
                                    key={timerMode}
                                    variant={mode === timerMode ? 'default' : 'ghost'}
                                    className={`px-2 py-1 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-300 ${mode === timerMode ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800'}`}
                                    onClick={() => resetTimer(timerMode)}
                                >
                                    {timerMode}
                                </Button>
                            ))}
                        </div>

                        <div className="text-5xl sm:text-6xl md:text-8xl font-bold text-gray-800 dark:text-white mb-8 tracking-tighter">
                            {formatTime(secondsLeft)}
                        </div>

                        <div className="flex justify-center gap-4 mb-8">
                            {!isRunning ? (
                                <Button
                                    onClick={startTimer}
                                    size="lg"
                                    className="bg-green-500 hover:bg-green-600 text-white text-base sm:text-lg font-bold flex items-center px-5 py-2 sm:px-8 sm:py-3 rounded-xl shadow-lg"
                                >
                                    <Play className="w-6 h-6 mr-2" /> Start
                                </Button>
                            ) : (
                                <Button
                                    onClick={pauseTimer}
                                    size="lg"
                                    className="bg-yellow-500 hover:bg-yellow-600 text-white text-base sm:text-lg font-bold flex items-center px-5 py-2 sm:px-8 sm:py-3 rounded-xl shadow-lg"
                                >
                                    <Pause className="w-6 h-6 mr-2" /> Pause
                                </Button>
                            )}
                            <Button
                                onClick={resetToPomodoro}
                                size="lg"
                                className="bg-red-500 hover:bg-red-600 text-white text-base sm:text-lg font-bold flex items-center px-5 py-2 sm:px-8 sm:py-3 rounded-xl shadow-lg"
                            >
                                <RefreshCw className="w-6 h-6 mr-2" /> Reset
                            </Button>
                        </div>
                    </Card>
                    <audio ref={audioRef} preload="auto"></audio>
                </div>
            </div>

        </div>
    );
}
export default Pomodoros;