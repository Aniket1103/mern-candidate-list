import React from 'react'
import './TopBar.css'
import logo from '../../assets/logo.svg'
const TopBar = () => {
  return (
    <div className='topbar'>
        <img src={logo} className="logo" alt="logo" />
        <div className="menu"> Community </div>
        <div className="menu"> Campus </div>
        <div className="menu"> Company </div>
        <div className="menu"> Host </div>
        <div className="menu"> Login </div>
        <div className="menu"> Join </div>
    </div>
  )
}

export default TopBar