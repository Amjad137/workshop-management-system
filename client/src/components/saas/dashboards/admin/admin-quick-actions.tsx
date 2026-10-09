import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes.constants';

const AdminQuickActions = () => {
  const router = useRouter();
  return (
    <Card className='max-w-xs w-full mx-auto h-full flex flex-col'>
      <CardHeader>
        <CardTitle className='text-base'>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className='flex flex-col gap-3 flex-1'>
        <Button className='justify-start gap-2' onClick={() => router.push(ROUTES.USERS_ROOT)}>
          <Users className='w-4 h-4' /> Manage Staff Accounts
        </Button>
        <Button className='justify-start gap-2' onClick={() => router.push(ROUTES.INVITATIONS_ROOT)}>
          <Mail className='w-4 h-4' /> Staff Invitations
        </Button>
      </CardContent>
    </Card>
  );
};

export default AdminQuickActions;
