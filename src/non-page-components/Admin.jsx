import { useEffect, useState } from "react"
import { fetchCurrentUser } from "./supabaseDB"
import { useNavigate } from "react-router-dom"

export default function Admin() {

    const navigate = useNavigate()
    const [User, setUser] = useState()
    

    
    


    useEffect(()=>{
        async function fetchAll() {
            setUser(await fetchCurrentUser())
            
        }
        fetchAll()
    },[])


    return (
    <div>

        <div className='grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
            <div className=' h-20 bg-primary-blue hover:bg-hover-blue m-5 rounded-xl cursor-pointer flex items-center justify-center gap-3' onClick={() => navigate('/create')}>
                <i className='fas fa-plus fa-xl pt-1 invert'></i>
                <h2 className='text-white text-center font-bold text-xl '>Create New Posts</h2>
            </div>
            {/* {console.log(userid)} */}
            <div className=' m-5 mt-0 md:mt-5 h-20 bg-primary-green hover:bg-hover-green rounded-xl cursor-pointer flex items-center justify-center gap-3' onClick={() => navigate(`/profile/${User.userID}`)}>
                <i className='fas fa-edit fa-xl invert'></i>
                <h2 className='text-white text-center font-bold text-xl '>Edit Posts</h2>                    
            </div>
            <div className=' m-5 mt-0 md:mt-5 h-20 bg-primary-yellow hover:bg-hover-yellow rounded-xl cursor-pointer flex items-center justify-center gap-3' onClick={() => navigate(`/announcement`)}>
                <i className='fas fa-bell fa-xl invert'></i>
                <h2 className='text-white text-center font-bold text-xl '>Announcement</h2>                    
            </div>
        </div>   
        
        <div className="flex">
            <div className="w-full bg-red-400 h-20 m-5 rounded-xl">

            </div>
            <div className="w-full bg-red-400 h-20 m-5 rounded-xl">

            </div>
            <div className="w-full bg-red-400 h-20 m-5 rounded-xl">

            </div>
            <div className="w-full bg-red-400 h-20 m-5 rounded-xl">

            </div> 
        </div>

               
    </div>
    )
}