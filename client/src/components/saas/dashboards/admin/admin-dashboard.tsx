import AdminDashboardCards from './admin-dashboard-cards';

const AdminDashboard = () => {
  return (
    <div className='flex flex-col gap-4 py-2 md:gap-6 md:py-3'>
      <AdminDashboardCards />
      <div className='px-4 lg:px-6 flex flex-col md:flex-row gap-4 items-stretch'>
        {/* <div className='flex-1'>
          <TeacherSearch />
        </div>
        <div className='flex-1'>
          <DashboardStudentsSearch />
        </div>
        <div className='flex-1'>
          <StudentExamsCalendar />
        </div> */}
      </div>
    </div>
  );
};

export default AdminDashboard;
