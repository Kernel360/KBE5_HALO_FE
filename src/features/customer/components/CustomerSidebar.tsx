import React from 'react';
import { NavLink } from 'react-router-dom';

interface MenuItem {
  name: string;
  path: string;
}

const CustomerSidebar: React.FC = () => {
  const menuItems: MenuItem[] = [
    { name: '마이페이지', path: '/my' },
    { name: '예약 내역', path: '/my/reservations' },
    { name: '리뷰 내역', path: '/my/reviews' },
    { name: '1:1 문의 내역', path: '/my/inquiries' },
    //{ name: '좋아요/아쉬워요 매니저 목록', path: '/my/likes' }, 
  ];

  const baseClasses = 'w-full px-6 py-4 flex items-center';
  const activeClasses = 'bg-violet-50 text-indigo-600 font-semibold';
  const inactiveClasses = 'text-stone-500 hover:text-indigo-600 hover:font-semibold border-b border-zinc-100';

  return (
    <aside className="max-w-xs w-full flex flex-col space-y-6">
      {/* Navigation Section */}
      <nav className="w-full bg-white rounded-2xl shadow-md outline outline-1 outline-offset-[-1px] outline-zinc-100">
        <ul className="flex flex-col">
          {menuItems.map(({ name, path }, idx) => {
            const isLast = idx === menuItems.length - 1;
            return (
              <li key={name}>
                <NavLink
                  to={path}
                  end={path === '/my'}
                  className={({ isActive }) => {
                    const classes = [baseClasses, isActive ? activeClasses : inactiveClasses];
                    if (isLast) {
                      if (isActive) {
                        classes.push('rounded-b-2xl');
                      } else {
                        // remove bottom border completely
                        classes.push('border-none');
                      }
                    }
                    return classes.join(' ');
                  }}
                >
                  {name}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Customer Service Section - Already has bg-white, rounded-2xl, shadow-md, outline */}
      <section className="w-full p-6 bg-white rounded-2xl shadow-md outline outline-1 outline-offset-[-1px] outline-zinc-100 flex flex-col gap-4">
        <h2 className="text-zinc-800 text-base font-semibold leading-tight">고객센터</h2>
        <div className="flex flex-col gap-2">
          <p className="text-zinc-800 text-xl font-bold leading-normal">1588-1234</p>
          <p className="text-stone-500 text-sm leading-none">평일 09:00-18:00</p>
          <p className="text-stone-500 text-sm leading-none">주말/공휴일 휴무</p>
        </div>
      </section>
    </aside>
  );
};

export default CustomerSidebar;