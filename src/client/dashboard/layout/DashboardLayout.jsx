
import Sidebar from './Sidebar';


export default function DashboardLayout({ children }) {
  return (
    <div className="flex bg-[#0F0F0F] text-white font-inter">
      <Sidebar />
      <main  className='w-full'>
        <div>
          {children}
        </div>
      </main>
    </div>
  );
}
