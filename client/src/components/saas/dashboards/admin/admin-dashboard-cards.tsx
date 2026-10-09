'use client';

import { format } from 'date-fns';
import { LucideProps, Users } from 'lucide-react';
import { useMemo } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ROUTES } from '@/constants/routes.constants';
import { useGetAllUsersCount } from '@/hooks/use-users';
import Link from 'next/link';

type IAdminCardData = {
  date: string;
  logo: React.ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
  >;
  title: string;
  value: string;
  subTitle?: string;
  navString?: string;
  isLoading?: boolean;
};

export function AdminDashboardCards() {
  // Fetch all active users (excluding super admins and admins from count)
  const { data: allUsersCount, isLoading: isLoadingUsersCount } = useGetAllUsersCount();

  // Calculate total active users count (excluding admins and super admins)
  const totalActiveUsers = useMemo(() => {
    return allUsersCount;
  }, [allUsersCount]);
  // Memoize formatted date for cards
  const formattedDate = useMemo(() => format(new Date(), 'yyyy-MM-dd'), []);

  // Prepare card data
  const adminCardData: IAdminCardData[] = useMemo(
    () => [
      {
        date: formattedDate,
        logo: Users,
        title: 'Total Active Users',
        value: totalActiveUsers.toString(),
        subTitle: 'Teachers, Students, Parents & Staff',
        navString: ROUTES.USERS_ROOT,
        isLoading: isLoadingUsersCount,
      },
      // {
      //   date: formattedDate,
      //   logo: Building,
      //   title: 'Active Classrooms',
      //   value: totalClassrooms.toString(),
      //   subTitle: 'Currently active classrooms',
      //   navString: ROUTES.CLASSROOMS,
      //   isLoading: isLoadingClassrooms,
      // },
      // {
      //   date: formattedDate,
      //   logo: BookOpen,
      //   title: 'Ongoing Exams',
      //   value: totalOngoingExams.toString(),
      //   subTitle: nextOngoingExam
      //     ? `Next: ${nextOngoingExam.name} on ${format(new Date(nextOngoingExam.startDate), 'MMM dd')}`
      //     : 'No ongoing exams',
      //   navString: ROUTES.EXAMS_ROOT,
      //   isLoading: isLoadingInProgressExams,
      // },
      // {
      //   date: formattedDate,
      //   logo: CheckCircle,
      //   title: 'Completed Exams',
      //   value: (completedExams?.length || 0).toString(),
      //   subTitle: latestCompletedExam
      //     ? `Latest: ${latestCompletedExam.name} (${format(new Date(latestCompletedExam.endDate), 'MMM dd')})`
      //     : 'No completed exams yet',
      //   navString: ROUTES.EXAMS_RECORDS,
      //   isLoading: isLoadingCompletedExams,
      // },
    ],
    [formattedDate, totalActiveUsers, isLoadingUsersCount],
  );

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 px-4 lg:px-6'>
      {adminCardData.map((item, index) => (
        <Link
          key={index}
          href={item.navString || '#'}
          className='block transition-transform hover:scale-105'
        >
          <Card className='flex flex-col justify-between bg-primary text-primary cursor-pointer'>
            <CardHeader className='relative justify-center'>
              <span className='text-sm font-light'>{item.date}</span>
              <div className='absolute right-2 top-0'>
                <item.logo size={36} />
              </div>
            </CardHeader>

            <CardContent className='p-0'>
              <CardTitle className='text-center text-2xl md:text-3xl font-medium tabular-nums'>
                {item.isLoading ? '...' : item.value}
              </CardTitle>
              <CardDescription className='text-center text-base font-base text-primary mt-2'>
                {item.title}
              </CardDescription>
            </CardContent>

            <CardFooter className='items-end justify-center gap-1 text-sm p-2'>
              {item.subTitle && <div className='text-primary font-extralight'>{item.subTitle}</div>}
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
}

export default AdminDashboardCards;
