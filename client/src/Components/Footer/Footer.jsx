import React from 'react';
import style from './Footer.module.css';
import verification from '../../Media/Verification.png';
import { Link } from 'react-router-dom';
import Login from '../PopUps/LoginPopUp';

function Footer() {
    return (
        <div id={style.footer}>
            <div>
                <h1 className='font800'>FindDevs</h1>
                <span className='font200'>© 2021 All rights reserved.</span>
            </div>
            <div className='displayFlex'>
                <Link className={style.links} to='/jobs'>
                    <div className={style.footerDiv}>
                        <span><i class="fas fa-users"></i> startups jobs</span>
                    </div>
                </Link>
                <Link className={style.links} to='/workers'>
                    <div className={style.footerDiv}>
                        <span><i class="fas fa-laptop-code"></i> developers</span>
                    </div>
                </Link>
            </div>
        </div>
    )
}

export default Footer;