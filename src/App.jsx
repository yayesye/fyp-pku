import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';

import Protected from './non-page-components/Protected.jsx';

import { ErrorBox, GoodBox, NotFound } from './non-page-components/DisplayBox.jsx';

import Auth from './Auth.jsx';
import Dashboard from './Dashboard.jsx';
import Posts from './Posts.jsx';
import CreatePosts from './CreatePosts.jsx';
import Profile from './Profile.jsx';
import Loading from './non-page-components/Loading.jsx';
import EditPosts from './EditPosts.jsx';


// import Comment from './Comment.jsx'
// import * as supabaseDB from './supabaseDB.jsx'




export default function App() {

  return (

    <div>

      <BrowserRouter>
        <Routes>
          <Route index element={<Auth />} />
          <Route path="dashboard" element={ <Protected>  <Dashboard />  </Protected> } />
          <Route path="posts/:postid" element={ <Protected>  <Posts />  </Protected>  } />
          <Route path="create" element={ <Protected>  <CreatePosts />  </Protected>  } />
          <Route path='profile/:userid' element={ <Protected>  <Profile />  </Protected> } />

          <Route path="load" element={<Loading />} />

          <Route path="edit/:postid" element={ <Protected>  <EditPosts />  </Protected>  } />

          {/* the comment is still in development */}
          

          
          {/* <Route path="error" element={<ErrorBox/>} />
          <Route path="good" element={<GoodBox />} /> */}

          {/* this is for routing unknown pages */}
          <Route path="*" element={<NotFound />} />


        </Routes>
      </BrowserRouter>

    </div>
  )
}

