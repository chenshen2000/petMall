import {  Outlet } from '@umijs/max';
import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
import styles from './index.less';
export default function Layout() {
  
  return (
    <div className="lg:w-full w-[1136px]">
      <div className={styles.navs}>
        <Header></Header>
      </div>
      <div ><Outlet /></div>
      <Footer></Footer>
    </div>
  );
}
