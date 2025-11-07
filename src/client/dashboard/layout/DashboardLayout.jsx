
import Sidebar from './Sidebar';


export default function DashboardLayout({ children }) {
  return (
    <div className="flex bg-white text-black font-inter">
      <Sidebar />
      <main  className='w-full'>
        <div>
          {children}
        </div>
      </main>
    </div>
  );
}
