"use client";

import { useCallback, useEffect, useRef } from "react";

export type AnimationFrameResult = "continue" | "stop";

type UseAnimationFrameLoopParams = {
  hasPendingFrame: () => boolean;
  onFrame: (timestamp: number) => AnimationFrameResult;
  startSignal: unknown;
};

export function useAnimationFrameLoop({
  hasPendingFrame,
  onFrame,
  startSignal,
}: UseAnimationFrameLoopParams) {
  const animationFrameRef = useRef(0);
  const hasPendingFrameRef = useRef(hasPendingFrame);
  const isLoopRunningRef = useRef(false);
  const onFrameRef = useRef(onFrame);

  useEffect(() => {
    hasPendingFrameRef.current = hasPendingFrame;
    onFrameRef.current = onFrame;
  }, [hasPendingFrame, onFrame]);

  const runFrame = useCallback(function runNextFrame(timestamp: number) {
    const frameResult = onFrameRef.current(timestamp);

    if (frameResult === "stop") {
      isLoopRunningRef.current = false;
      return;
    }

    animationFrameRef.current = window.requestAnimationFrame(runNextFrame);
  }, []);

  const startLoopIfNeeded = useCallback(() => {
    if (isLoopRunningRef.current || !hasPendingFrameRef.current()) {
      return;
    }

    isLoopRunningRef.current = true;
    animationFrameRef.current = window.requestAnimationFrame(runFrame);
  }, [runFrame]);

  const stopLoop = useCallback(() => {
    window.cancelAnimationFrame(animationFrameRef.current);
    isLoopRunningRef.current = false;
  }, []);

  useEffect(() => {
    startLoopIfNeeded();
  }, [startLoopIfNeeded, startSignal]);

  useEffect(() => {
    return stopLoop;
  }, [stopLoop]);

  return {
    startLoopIfNeeded,
    stopLoop,
  };
}
