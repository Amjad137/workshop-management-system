import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

const AuthLayout = ({ children }: Props) => {
  return (
    <div className='min-h-screen flex flex-col'>
      <main className='flex-1 flex items-center justify-center p-4 md:p-6 lg:p-8 overflow-auto'>
        {children}
      </main>
    </div>
  );
};
export default AuthLayout;
