import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart2, Bug, Building, CalendarCheck, FileText, Users, Warehouse } from 'lucide-react';
import { useRouter } from 'next/navigation';

const AdminQuickActions = () => {
  const router = useRouter();
  return (
    <Card className='max-w-xs w-full mx-auto h-full flex flex-col'>
      <CardHeader>
        <CardTitle className='text-base'>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className='flex flex-col gap-3 flex-1'>
        <Button className='justify-start gap-2' onClick={() => router.push('/users')}>
          <Users className='w-5 h-5' /> Manage Users
        </Button>
        <Button className='justify-start gap-2' onClick={() => router.push('/subjects')}>
          <FileText className='w-5 h-5' /> Manage Subjects
        </Button>
        <Button className='justify-start gap-2' onClick={() => router.push('/classrooms')}>
          <Building className='w-5 h-5' /> Manage Classrooms
        </Button>
        <Button className='justify-start gap-2' onClick={() => router.push('/resources')}>
          <Warehouse className='w-5 h-5' /> Manage Resources
        </Button>
        <Button className='justify-start gap-2' onClick={() => router.push('/exams')}>
          <CalendarCheck className='w-5 h-5' /> Manage Exams
        </Button>
        <Button
          className='justify-start gap-2'
          onClick={() => router.push('/students-attendance-report')}
        >
          <BarChart2 className='w-5 h-5' /> View Reports
        </Button>
        <Button
          className='justify-start gap-2'
          onClick={() => router.push('/support/report-problem')}
        >
          <Bug className='w-5 h-5' /> Report a Problem
        </Button>
      </CardContent>
    </Card>
  );
};

export default AdminQuickActions;
