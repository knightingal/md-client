import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Flow1000 from "./layouts/flow1000"
import SectionList from "./pages/flow1000/sectionList"
import SectionContent from "./pages/flow1000/sectionContent"
import {Provider} from 'react-redux'
import store from './store'

import {
  createBrowserRouter, RouterProvider
} from "react-router-dom"

const router = createBrowserRouter([
  {
    path:"/",
    element: <App></App>
  },
  {
    path:"/flow1000",
    element: <Flow1000/>,
    children:[
      {
        path:"/flow1000/sectionList",
        element:<SectionList />
      },
      {
        path:"/flow1000/content/:sectionId",
        element:<SectionContent/>
      }
    ]
  }
])

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
