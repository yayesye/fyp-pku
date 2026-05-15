import { createClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'


// const supabaseUrl = import.meta.env.VITE_SUPABASE_LINK
// const supabaseKey = import.meta.env.VITE_SUPABASE_KEY

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY


export const supabase = createClient(supabaseUrl, supabaseKey)


// export async function fetchUser(){
//     const { userData , error } = await dbConn
//         .from('User')
//         .select('*')
    
//     if (error) console.error('Error fetching user data:', error);
//     else return userData
// }


// export async function fetchComments() {
//     const { commentdata, error } = await dbConn
//         .from('comments')
//         // select column name, multiple if i want
//         .select('*') 

//     if (error) console.error('Error fetching comments:', error);
//     else return commentdata;
// }



