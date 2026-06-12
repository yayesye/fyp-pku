import { useEffect, useState } from "react"
import { fetchCurrentUser } from "./supabaseDB"
import { useNavigate } from "react-router-dom"

export default function EditBar({role}) {

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

        {role === 'ADMIN' && 
        <div className='grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
            <div className='m-5 h-20 bg-primary-blue hover:bg-hover-blue rounded-xl cursor-pointer flex items-center justify-center gap-3' onClick={() => navigate('/create')}>
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
            <div className=' m-5 mt-0 md:mt-5 h-20 bg-red-600 hover:bg-red-800 rounded-xl cursor-pointer flex items-center justify-center gap-3' onClick={() => navigate(`/announcement`)}>
                <i className='fas fa-trash fa-xl invert'></i>
                <h2 className='text-white text-center font-bold text-xl '>Delete Posts</h2>                    
            </div>
        </div>
        }
        

        {role === 'STUDENT' && <div></div>}


        {role === 'STAFF' && 
        <div className='grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
            <div className='m-5 h-20 bg-primary-blue hover:bg-hover-blue rounded-xl cursor-pointer flex items-center justify-center gap-3' onClick={() => navigate('/create')}>
                <i className='fas fa-plus fa-xl pt-1 invert'></i>
                <h2 className='text-white text-center font-bold text-xl '>Create New Posts</h2>
            </div>
            {/* {console.log(userid)} */}
            <div className='m-5 mt-0 md:mt-5 h-20 bg-primary-green hover:bg-hover-green rounded-xl cursor-pointer flex items-center justify-center gap-3' onClick={() => navigate(`/profile/${User.userID}`)}>
                <i className='fas fa-edit fa-xl invert'></i>
                <h2 className='text-white text-center font-bold text-xl '>Edit Posts</h2>                    
            </div>
            <div className="m-5 mt-0 md:mt-5 h-20 bg-primary-yellow hover:bg-hover-yellow rounded-xl cursor-pointer flex items-center justify-center gap-3' onClick={() => navigate(`/announcement`)} ">
                <i className='fas fa-bell fa-xl invert'></i>
                <h2 className='text-white text-center font-bold text-xl '>Announcement</h2>                    
            </div>
        </div>
        }
               
    </div>
    )
}