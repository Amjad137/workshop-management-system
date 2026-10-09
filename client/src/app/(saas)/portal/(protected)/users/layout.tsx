import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

const UsersLayout = ({ children }: Props) => {
  return (
    <div className='min-h-screen flex flex-col'>
      <main className='flex-1 flex items-center justify-center p-2 md:p-4'>{children}</main>
    </div>
  );
};
export default UsersLayout;
