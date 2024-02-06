import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Flow1000 from "./layouts/flow1000"
import SectionList from "./pages/flow1000/sectionList"
import SectionListFun from "./pages/flow1000/sectionListFun"
import SectionContent from "./pages/flow1000/sectionContent"
import { Provider } from 'react-redux'
import store from './store'

import { createBrowserRouter, RouterProvider } from "react-router-dom"
import LazyTestPage from './layouts/LazyTestPage';
import SectionContentFun from './pages/flow1000/sectionContentFun';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App></App>
  },
  {
    path: "/lazy-test",
    element: <LazyTestPage />
  },
  {
    path: "/flow1000",
    element: <Flow1000 />,
    children: [
      {
        path: "/flow1000/sectionList",
        element: <SectionList />
      },
      {
        path: "/flow1000/sectionListFun",
        element: <SectionListFun />
      },
      {
        path: "/flow1000/content/:sectionId",
        element: <SectionContentFun />
      }
    ]
  }
])

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
