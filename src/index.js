import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {store} from './store/store'
import {Provider} from "react-redux";
import { MapContainer } from './pages/MapContainer';
import { SidebarContainer } from './cmps/SidebarContainer';
import { NodeGenerator } from './cmps/NodeGenerator';
import { ImportCmp } from './cmps/ImportCmp';

ReactDOM.render(
  <Provider store={store}>
    <header style={{display:'flex', justifyContent: 'space-around', alignItems:'center'}}>
      <NodeGenerator />
      <ImportCmp />
      </header>
      <MapContainer />
      <SidebarContainer />
    </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
