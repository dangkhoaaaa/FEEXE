import React from 'react'
import './SignupMentorSuccess.scss'
import HeaderHome from '../../../../components/header-home/HeaderHome'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFaceGrinWink, faFlag, faThumbsUp } from '@fortawesome/free-regular-svg-icons'
import Footer from '../../../../components/footer/Footer'
import { Link } from 'react-router-dom'

export default function SignupMentorSuccess() {
    return (
        <div style={{ height: '100%', backgroundColor: '#274a79' }}>
            <HeaderHome />
            <div className='signup-success-container'>
                <div className='signup-success-background'>
                    <h2>Congratulations on successfully signing up! <FontAwesomeIcon icon={faThumbsUp} /></h2>
                    <p><FontAwesomeIcon icon={faFlag} /> You need to wait for approval by the administrator.</p>
                    <p>Please wait while we review your registration and respond as soon as possible.</p>
                    <p>We will provide a password once your registration is approved so you can <Link className='btnsignin' to="/signin">sign in</Link>.</p>
                    <p>Thank you so much. <FontAwesomeIcon icon={faFaceGrinWink} /></p>
                </div>
            </div>
            <Footer backgroundColor={'#274A79'} color={'#F9FDFF'} />
        </div>

    )
}
