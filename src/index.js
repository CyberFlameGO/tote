import React from 'react';
import ReactDOM from 'react-dom';
import App from './containers/App';
import registerServiceWorker from './registerServiceWorker';
import './index.scss';

import firebase from 'firebase';

const totes = firebase.initializeApp({
  apiKey: "AIzaSyDv5RGeED_KFYTIJKSeq3EFwhYZTsHu7iY",
  authDomain: "tote-7a7d7.firebaseapp.com",
  databaseURL: "https://tote-7a7d7.firebaseio.com",
  projectId: "tote-7a7d7",
  storageBucket: "tote-7a7d7.appspot.com",
});

export default totes;

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
