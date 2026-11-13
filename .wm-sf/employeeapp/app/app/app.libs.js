"use client";

const loadAppLibs = async () => {
  try {
    if (typeof window !== 'undefined') {
      const { moment } = await import('@wavemaker-ai/react-runtime/libs');
      window.moment = moment
      console.log('loaded app libraries:');
    }

  }
  catch (error) {
    console.error('Failed to load app libraries:', error);
  }
}


loadAppLibs();
