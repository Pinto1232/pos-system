import React from 'react';
import styles from './dashboardMain.module.css';
import { DashboardMainProps } from './type';

const DashboardMain: React.FC<DashboardMainProps> = ({ title, content, footerText }) => {
    return (
        <div className={styles.container}>
            <div className={styles.header}>{title}</div>
            <div className={styles.content}>{content}</div>
            {footerText && <div className={styles.footer}>{footerText}</div>}
        </div>
    );
};

export default DashboardMain;
