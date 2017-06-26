import React, { Component } from 'react';
import { func } from 'prop-types';
import './LoggedOut.scss';

export default class LoggedOut extends Component {
  static propTypes = {
    login: func.isRequired,
  }

  render() {
    return (
      <main className="main loggedOut">
        <div className="loggedOut__inner">
          <p className="loggedOut__welcome">Welcome to <strong>tote</strong></p>
          <button className="loggedOut__btn" onClick={this.props.login}>
            <svg width="191" height="46" viewBox="0 0 191 46" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"><title>Google Signin</title><defs><rect id="b" width="185" height="40" rx="2"/><filter x="-1.6%" y="-5%" width="103.2%" height="115%" filterUnits="objectBoundingBox" id="a"><feOffset dy="1" in="SourceAlpha" result="shadowOffsetOuter1"/><feGaussianBlur stdDeviation=".5" in="shadowOffsetOuter1" result="shadowBlurOuter1"/><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.24 0" in="shadowBlurOuter1" result="shadowMatrixOuter1"/><feOffset in="SourceAlpha" result="shadowOffsetOuter2"/><feGaussianBlur stdDeviation=".5" in="shadowOffsetOuter2" result="shadowBlurOuter2"/><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0" in="shadowBlurOuter2" result="shadowMatrixOuter2"/><feMerge><feMergeNode in="shadowMatrixOuter1"/><feMergeNode in="shadowMatrixOuter2"/></feMerge></filter></defs><g fill="none" fillRule="evenodd"><g transform="translate(3 3)"><use fill="#000" filter="url(#a)" xlinkHref="#b"/><use className="w" fill="#FFF" xlinkHref="#b"/></g><path d="M31.64 23.205c0-.639-.057-1.252-.164-1.841H23v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/><path d="M23 32c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711h-3.007v2.332A8.997 8.997 0 0 0 23 32z" fill="#34A853"/><path d="M17.964 24.71a5.41 5.41 0 0 1-.282-1.71c0-.593.102-1.17.282-1.71v-2.332h-3.007A8.996 8.996 0 0 0 14 23c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/><path d="M23 17.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C27.463 14.891 25.426 14 23 14a8.997 8.997 0 0 0-8.043 4.958l3.007 2.332c.708-2.127 2.692-3.71 5.036-3.71z" fill="#EA4335"/><path d="M14 14h18v18H14z"/><text fontFamily="Roboto-Medium, Roboto" fontSize="14" fontWeight="400" letterSpacing=".219" fillOpacity=".54" fill="#000" transform="translate(-1 -1)"><tspan x="54" y="29">Sign in with Google</tspan></text></g></svg>
          </button>
        </div>
      </main>
    );
  }
}
