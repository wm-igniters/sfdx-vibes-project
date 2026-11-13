'use client';
import { useEffect, useRef } from 'react';

export interface PageEventHandlers {
  attach?: () => void;
  detach?: () => void;
  destroy?: () => void;
  orientationchange?: () => void;
  resize?: () => void;
}

export const usePageEvent = (handlers: PageEventHandlers) => {
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  useEffect(() => {
    // this will be called when the page is mounted/attached
    if (handlersRef.current.attach) {
      handlersRef.current.attach();
    }

    const handleOrientationChange = () => {
      handlersRef.current.orientationchange?.();
    };

    const handleResize = () => {
      handlersRef.current.resize?.();
    };

    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange); // called when page orientation changes
      window.removeEventListener('resize', handleResize); // called when page is resized

      // this will be called when the page is destroyed/unmounted
      if (handlersRef.current.destroy) {
        handlersRef.current.destroy();
      }
    };
  }, []);

  return null;
};
