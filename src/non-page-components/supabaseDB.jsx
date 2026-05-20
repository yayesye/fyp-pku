import { createClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import { data } from 'react-router-dom'


// const supabaseUrl = import.meta.env.VITE_SUPABASE_LINK
// const supabaseKey = import.meta.env.VITE_SUPABASE_KEY

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY


export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        storage: window.sessionStorage,
        autoRefreshToken: true,
        persistSession: true,
    },
})



export async function fetchAllPosts () {
    
}



export async function fetchCurrentUser(func) {

    let UserID = null
    // get current user id
    const { data: {session}, error:AuthError } = await supabase.auth.getSession()
    AuthError? console.log('Error fetching user: ',AuthError) : UserID = session?.user?.id

    // get all user info inside the Users column
    const {data:userData, error:ColumnError } = await supabase.from('Users').select('*').eq('userID',UserID).single()
    
    if (ColumnError) console.log('Error fetching from Users: ',ColumnError)

    if (userData) userData.pfp = `https://ui-avatars.com/api/?background=264688&color=fff&name=${userData?.userName[0]}`

    func(userData)
}




