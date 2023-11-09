import React from 'react';
import { Outlet } from 'react-router';
import { Header, Navigation } from '../../components';
const Public = () => {
    return(
        <div className='W-full flex justify-center'>
         <Header/>
         <Navigation/>
         <div className='W-main'>
            <Outlet/>
         </div>
        </div>
    )
}
export default Public