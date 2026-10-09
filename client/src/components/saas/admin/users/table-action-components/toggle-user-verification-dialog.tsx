'use client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useVerifyUsers } from '@/hooks/use-users';
import { AlertCircle } from 'lucide-react';

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  email: string;
  userId: string;
  currentVerificationStatus: boolean;
};

const ToggleUserVerificationDialog = ({
  open,
  setOpen,
  email,
  userId,
  currentVerificationStatus,
}: Props) => {
  const { mutateAsync: verifyUser, isPending: isLoading } = useVerifyUsers();

  const toggleVerificationCallback = async () => {
    await verifyUser({
      userIDs: [userId],
      verification: (!currentVerificationStatus).toString(),
    });
    setOpen(false);
  };

  const actionText = currentVerificationStatus ? 'un-verify' : 'verify';
  const newStatus = currentVerificationStatus ? 'unverified' : 'verified';

  return (
    <Dialog open={open} onOpenChange={setOpen} modal>
      <DialogContent className='overflow-auto max-h-full'>
        <DialogTitle>
          <div className='flex flex-col items-center justify-center space-y-2'>
            <AlertCircle className='text-yellow-400' size={40} />
            <h2 className='text-xl font-semibold text-foreground'>Are you Sure!</h2>
          </div>
        </DialogTitle>

        <div className='flex flex-col items-center justify-center gap-10'>
          <div className='text-center font-semibold text-foreground'>
            Do you want to {actionText} this user?
            <br />
            <div className='mt-2 text-sm text-muted-foreground'>
              User: <span className='font-medium'>{email}</span>
            </div>
            <div className='text-sm text-muted-foreground'>
              New status: <span className='font-medium capitalize'>{newStatus}</span>
            </div>
          </div>

          <div className='flex flex-row gap-5'>
            <Button onClick={() => setOpen(false)} className='w-[160px]' variant='outline'>
              Cancel
            </Button>
            <Button onClick={toggleVerificationCallback} className='w-[160px]' loading={isLoading}>
              {currentVerificationStatus ? 'Un-verify' : 'Verify'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ToggleUserVerificationDialog;
