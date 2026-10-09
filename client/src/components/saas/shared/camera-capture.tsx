import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { videoConstraints } from '@/constants/camera.constants';
import { FILE_TYPES } from '@/constants/common.constants';
import { DialogClose } from '@radix-ui/react-dialog';
import { Camera } from 'lucide-react';
import Image from 'next/image';
import { Dispatch, ReactNode, SetStateAction, useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';

type Props = {
  children: ReactNode;
  setUrl: Dispatch<SetStateAction<string | undefined>>;
  resetTrigger?: number; // Used to reset the component state
};

const CameraCapture = ({ children, setUrl, resetTrigger }: Props) => {
  const [temporaryUrl, setTemporaryUrl] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);
  const webcamRef = useRef<Webcam>(null);

  const capture = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setTemporaryUrl(imageSrc);
    }
  };

  const handleCameraError = (error: string | DOMException) => {
    if (typeof error === 'string') {
      setError('No camera found or permission denied');
    } else {
      setError('An error occurred while accessing the camera');
    }
  };

  // Reset component state when resetTrigger changes
  useEffect(() => {
    if (resetTrigger !== undefined) {
      setTemporaryUrl(undefined);
      setError(null);
    }
  }, [resetTrigger]);

  return (
    <Dialog>
      <DialogTrigger onClick={() => setUrl(undefined)} asChild>
        {children}
      </DialogTrigger>
      <DialogContent className='max-w-xl'>
        <DialogHeader>
          <DialogTitle>Camera</DialogTitle>
        </DialogHeader>
        <div className='flex gap-2'>
          {temporaryUrl ? (
            <div className='flex flex-col gap-4'>
              <div>
                <Image
                  src={temporaryUrl}
                  alt='Screenshot'
                  width={720}
                  height={360}
                  objectFit='cover'
                />
              </div>
              <div className='flex justify-center gap-5'>
                <Button
                  onClick={() => setTemporaryUrl(undefined)}
                  className='w-28'
                  variant='outline'
                >
                  Retake
                </Button>
                <DialogClose asChild>
                  <Button onClick={() => setUrl(temporaryUrl)} className='w-28'>
                    Done
                  </Button>
                </DialogClose>
              </div>
            </div>
          ) : (
            <div className='flex flex-col gap-4'>
              {error ? (
                <div className='text-red-500'>{error}</div>
              ) : (
                <div className='flex flex-col gap-2'>
                  <Webcam
                    audio={false}
                    width={720}
                    height={360}
                    ref={webcamRef}
                    screenshotFormat={FILE_TYPES.JPEG}
                    videoConstraints={videoConstraints}
                    onUserMediaError={handleCameraError}
                  />
                  <div className='flex justify-center w-full'>
                    <Button onClick={capture}>
                      <Camera />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CameraCapture;
