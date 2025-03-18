import React from 'react';
import DashboardMain from './dashboardMain';
import { DashboardMainProps } from './type';

const DashboardMainContainer: React.FC = () => {
    const props: DashboardMainProps = {
        title: 'Dashboard',
        content: <div>Welcome to the dashboard!</div>,
        footerText: '© 2023 Company Name',
    };

    return <DashboardMain {...props} />;
};

export default DashboardMainContainer;
