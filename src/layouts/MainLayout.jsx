import {Sidebar} from '../components/SideBar/Side';
import {Header} from '../components/Hedaer/Header';
import { Outlet } from 'react-router-dom';
import './MainLayout.scss';

const MainLayout = () => {
    return (
      <div className="main-layout">
      <div className="header">
        <Header />
      </div>
          <Sidebar />
        <div className="content-area">
          <main>
            <Outlet />
          </main>
        </div>
      </div>
    );
  };
  
  export default MainLayout;