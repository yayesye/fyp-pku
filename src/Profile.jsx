import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { supabase } from "./non-page-components/supabaseDB"
import Loading from "./non-page-components/Loading"

export default function Profile () {

    document.title = 'Profile'

    const navigate = useNavigate()

    const param = useParams()

    const [profile, setProfile] = useState()
    const [pfp,setpfp] = useState()
    const [ProfilePosts, setProfilePosts] = useState()

    const [loading, setloading] = useState(true)
    
    // console.log(param.userid)

    useEffect(()=>{

        setloading(true)

        async function fetchProfileUser() {
            const {data , error} = await supabase.from('Users').select('*').eq('userID', param.userid).single()
            setProfile(data)
            setpfp(`https://ui-avatars.com/api/?background=0033A0&color=fff&name=${data.userName[0]}`)
        } param && fetchProfileUser()

        async function fetchProfilePosts() {
            const {data, error} = await supabase.from('BulletinPosts').select('postID, title, status, FileAttachment(fileURL)').eq('userID',param.userid)
            setProfilePosts(data)
        }fetchProfilePosts()

        setTimeout(() => {
            setloading(false)
        }, 600);

    },[])

    // console.log(ProfilePosts)

    if (loading) return <Loading />

    return (
        <div className="bg-gray-100 w-full min-h-screen">

            <nav >
                <div 
                onClick={()=>navigate(-1)}
                className="cursor-pointer self-start inline">
                    <i className="fa-solid fa-arrow-left fa-2x p-5"></i>
                </div>
            </nav>      


            <div className="flex flex-col items-center text-center pt-10 pb-10">
                <img src={pfp} className="rounded-full max-w-20" />
                <h1 className="font-bold text-2xl"> {profile?.userName} </h1>
                <h2 className=" text-xl"> {profile?.userRole} </h2>
            </div>


            <div className="p-5 flex gap-5 flex-wrap">
                {
                ProfilePosts?.map(p => (
                    <div key={p.postID} className="bg-white flex flex-col rounded-xl p-8 w-full md:w-85 shadow cursor-pointer hover:shadow-md">

                        <div>
                            {p.FileAttachment?.fileURL 
                                ? <img src={p.FileAttachment?.fileURL} className='rounded-md mb-6 max-h-30 w-full object-contain' />
                                : <p className="font-bold text-center p-1 bg-gray-300 h-30 content-center mb-6">NO IMAGE</p> 
                            } 
                        </div>

                        <h1 
                        onClick={() => navigate(`/posts/${p.postID}`)}
                        className="font-bold text-primary-blue text-2xl hover:underline text-balance ">{p.title}</h1>
                        <p className="text-sm text-gray-500 mt-10">{p.Users?.userName}</p>


                        { //PUT IF THE CURRENT USER IS THE SAME AS THE PROFILE USER HERE, THEN SHOW THIS

                        <div className="flex justify-center mt-auto items-end gap-10">
                            <button value="Edit"
                            onClick={()=>navigate(`/edit/${p.postID}`)}
                            className="p-2 rounded-md bg-gray-500 min-w-25 cursor-pointer hover:bg-gray-700" >
                                <i className="fas fa-edit mr-2 invert"></i>
                                <span className=" text-white">Edit</span>
                            </button>
                            <button value="Delete"  className="p-2 rounded-md bg-red-700 min-w-25 cursor-pointer hover:bg-red-500" >
                                <i className="fas fa-trash mr-2 invert"></i>
                                <span className=" text-white">Delete</span>
                            </button>
                        </div>
                        }


                    </div>
                ))}
            </div>

        </div>

    )    
}