'use client'; // Error boundaries must be Client Components

import getAppConfig from '@/libs/appConfig';
import ErrorFallback from '@wavemaker-ai/react-runtime/components/page/error-boundary';

const basePath = getAppConfig()?.appConfig?.basePath;

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorFallback
      error={{
        message: 'Something went wrong!',
        stack: 'Something went wrong!',
      }}
      imageSource={`${basePath}error-fallback.svg`}
      reset={reset}
      title="Something went wrong!"
      subtitle="Don't worry, you can try again or go back to the home page."
    />
  );
}
