import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { SettingsContextType } from '../../types';

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [motionEnabled, setMotionEnabled] = useState(true);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Initialize preferences
  useEffect(() => {
    const savedSound = localStorage.getItem('voxel_sound') === 'true';
    const savedMotion = localStorage.getItem('voxel_motion') !== 'false';
    setSoundEnabled(savedSound);
    setMotionEnabled(savedMotion);
  }, []);

  const toggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    localStorage.setItem('voxel_sound', String(newState));
    if (newState) playSound('switch');
  };

  const toggleMotion = () => {
    const newState = !motionEnabled;
    setMotionEnabled(newState);
    localStorage.setItem('voxel_motion', String(newState));
    if (soundEnabled) playSound('click');
  };

  const playSound = (type: 'hover' | 'click' | 'switch') => {
    if (!soundEnabled) return;

    // Initialize AudioContext on first user interaction if needed
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }

    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    // Voxel/Retro inspired sounds
    if (type === 'hover') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.05);
      gain.gain.setValueAtTime(0.02, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'click') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === 'switch') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);
      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    }
  };

  return (
    <SettingsContext.Provider value={{ soundEnabled, toggleSound, motionEnabled, toggleMotion, playSound }}>
      {children}
    </SettingsContext.Provider>
  );
};