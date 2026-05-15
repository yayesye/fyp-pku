// ProtectedRoute.jsx
import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseDB';

import Loading from './Loading'; // THIS IS REDUNDANT BECAUSE LOADING IS SO FAST
import { ErrorBox } from './DisplayBox';

export default function Protected({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    const navigate = useNavigate()

    useEffect(() => {

        // const {data: {session}} = await supabase.auth.getSession()
        // setUser(session?.user ?? null)
        // setLoading(false)

        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null)
            setLoading(false)
        })
    }, [])

    if (loading) return null  // wait for session check


    // if (loading) return ( <div> <Loading /> </div> ) //wait for session check
    if (!user) return <ErrorBox message='Please Login' onDismiss={()=>{navigate('/')}} />

    
    return children
}