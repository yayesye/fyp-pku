import { useEffect, useState } from "react"
import { data, useNavigate, useParams } from "react-router-dom"
import { fetchAllPosts, fetchCurrentUser, supabase } from "./non-page-components/supabaseDB"
import Loading from "./non-page-components/Loading"
import { ErrorBox, GoodBox, NeutralBox } from "./non-page-components/DisplayBox"

export default function DeletePosts () {

    document.title = 'Profile'

    const navigate = useNavigate()

    const param = useParams()

    const [userProfile, setProfile] = useState()
    const [pfp,setpfp] = useState()
    const [ProfilePosts, setProfilePosts] = useState()

    const [loading, setloading] = useState(true)

    const [DelPID, setDelPID] = useState(false)
    const [Success, setSuccess] = useState(false)



    
    // console.log(param.userid)

    async function fetchProfilePosts() {

        setProfile(await fetchCurrentUser())

        // this is the old fetch from supabase, now we just use the fetch all post from supabase component and filter
        // const {data, error} = await supabase.from('BulletinPosts').select('postID, title, status, FileAttachment(fileURL)').eq('userID',param.userid)

        const fetchPosts = await fetchAllPosts()
        const data = fetchPosts
        setProfilePosts(data)
        console.log(data.pfp)
    }

    useEffect(()=>{

        setloading(true)

        fetchProfilePosts()

        setTimeout(() => {
            setloading(false)
        }, 200);

    },[])

    async function handleDelete(postid) {
        const {data, error} = await supabase.from('BulletinPosts').delete('*').eq('postID',postid).single()
        if (error) console.log('Error: ',error)

        console.log(data)

        setDelPID(null)
        // setDel(false)
        setSuccess(true)

    }    

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
                <img src={userProfile?.pfp} className="rounded-full max-w-20" />
                <h1 className="font-bold text-2xl"> {userProfile?.userName} </h1>
                <h2 className=" text-xl"> {userProfile?.userRole} </h2>
            </div>

            {/* {console.log(ProfilePosts)} */}
            <div className="p-5 flex gap-5 flex-wrap">

                {
                ProfilePosts?.map(p => (
                    <div key={p.postID} className="bg-white flex flex-col rounded-xl p-8 w-full md:max-w-[45vw] lg:max-w-[30vw] shadow cursor-pointer hover:shadow-md">

                        <div>
                            {p.FileAttachment?.fileURL 
                                ? <img src={p.FileAttachment?.fileURL} className='rounded-md mb-6 max-h-30 w-full object-contain' />
                                : <p className="font-bold text-center p-1 bg-gray-300 h-30 content-center mb-6">NO IMAGE</p> 
                            } 
                        </div>

                        <h1 
                        onClick={() => navigate(`/posts/${p.postID}`)}
                        className="font-bold text-primary-blue text-2xl hover:underline text-balance truncate mb-6 ">{p.title}</h1>
                        {/* <p className="text-sm text-gray-500 mt-10">{p.Users?.userName}</p> */}

                        <div className="flex items-center gap-2 mb-8">
                            <span className=" font-bold">Made by:</span>
                            <img className="rounded-full h-8" src={`https://ui-avatars.com/api/?background=264688&color=fff&name=${p?.Users?.userName[0]}`} />
                            <span> {p.Users?.userName} </span>
                        </div>
                        


                        
                        <div className="flex justify-center mt-auto items-end gap-10">
                            <button 
                            onClick={()=>setDelPID(p.postID)}
                            value="Delete"  className="p-2 rounded-md bg-red-700 min-w-25 cursor-pointer hover:bg-red-500" >
                                <i className="fas fa-trash mr-2 invert"></i>
                                <span className=" text-white">Delete Post</span>
                            </button>
                        </div>

                        {DelPID === p.postID && <NeutralBox message={'Delete Posts?'} Yes={()=>handleDelete(p.postID)} No={ ()=>setDelPID(null) } />}
                        

                    </div>
                    
                ))}
                {Success && <GoodBox message='Post Deleted!' onDismiss={ ()=> {setSuccess(false), fetchProfilePosts()} } />}
            </div>

        </div>

    )    
}