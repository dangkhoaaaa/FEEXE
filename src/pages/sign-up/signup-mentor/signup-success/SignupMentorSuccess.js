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
                    <h2>Chúc mừng bạn đã đăng ký thành công! <FontAwesomeIcon icon={faThumbsUp} /></h2>
                    <p><FontAwesomeIcon icon={faFlag} /> Bạn cần chờ phê duyệt bởi quản trị viên.</p>
                    <p>Hãy chờ chúng tôi xem xét đăng ký của bạn và trả lời sớm nhất nhé.</p>
                    <p>Chúng tôi sẽ cung cấp mật khẩu ngay khi phê quyệt để bạn có thể <Link className='btnsignin' to="/signin">đăng nhập</Link></p>
                    <p>Thank you so much. <FontAwesomeIcon icon={faFaceGrinWink} /></p>
                </div>

            </div>
            <Footer backgroundColor={'#274A79'} color={'#F9FDFF'} />
        </div>
    )
}
