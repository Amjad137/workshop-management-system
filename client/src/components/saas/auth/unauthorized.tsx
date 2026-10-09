import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ROUTES } from '@/constants/routes.constants';
import { useAuthStore } from '@/stores/auth.store';
import { useRouter } from 'next/navigation';

interface UnauthorizedProps {
  isAuthenticated?: boolean;
}

export const Unauthorized = ({ isAuthenticated = false }: UnauthorizedProps) => {
  const router = useRouter();
  const { userRole } = useAuthStore();

  const handleRedirect = () => {
    if (isAuthenticated) {
      router.push(ROUTES.SAAS_ROOT);
    } else {
      router.push(ROUTES.SIGN_IN);
    }
  };

  return (
    <div className='flex h-screen w-full items-center justify-center'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle className='text-center text-2xl'>
            {isAuthenticated ? 'Access Denied' : 'Authentication Required'}
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4 text-center'>
          <p className='text-muted-foreground'>
            {isAuthenticated
              ? `You don't have permission to access this page. Your current role is ${userRole}.`
              : 'Please sign in to access this page.'}
          </p>
          <Button onClick={handleRedirect} className='w-full'>
            {isAuthenticated ? 'Go to Home' : 'Sign In'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
