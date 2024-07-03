import React from 'react';
import "./Messenger.scss"
import NavMentee from '../../../components/Nav-mentee/NavMentee';

export default function MessengerMentee() {
    return (
        <div>
            <NavMentee activePage="messenger" />
            <div className='mentee-messenger-container'>
                <div className='chat-box'>
                    <div className='chat-bar'>
                        <p className='mess-title'>Tin nhắn</p>
                    </div>
                    <div className='mentor-mess'>
                        <div className='mentor-name-mess'></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
