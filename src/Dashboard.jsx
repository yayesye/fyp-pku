
import { useState,useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase, fetchCurrentUser } from './non-page-components/supabaseDB';

import {ErrorBox, GoodBox, NeutralBox} from './non-page-components/DisplayBox'
import NotifPanel from './non-page-components/NotifPanel';

import Posts from './Posts';
import Loading from './non-page-components/Loading';
import { createPortal } from 'react-dom';
import Admin from './non-page-components/Admin';
import EditBar from './non-page-components/EditBar';
import Settings from './non-page-components/Settings'




export default function Dashboard () {

    // function test() {
    //     const {data, error} = supabase.from('User').select('*').single().then({data, error}) => {console.log(data)}
    //     return data
    // };

    const navigate = useNavigate()
    const parameter = useParams()

    const [user, setUser] = useState(null)
    const [pfp, setpfp] = useState()
    const [post, setpost] = useState([])

    // const [userid,setuserid] = useState()
    const [Role, setRole] = useState(false)

    const [loading, setloading] = useState(true)
    const [Panel, setPanel] = useState(false)
    const [closePanel, setClosePanel] = useState(false)

    const [SettingsPanel, setSettingsPanel] = useState(false)
    const [closeSettings, setCloseSettings] = useState(false)

    const sleep = (ms) => { new Promise(e => setTimeout(e,ms)) }

    const [likedPosts, setLikedPosts] = useState({})

    async function handleLike(postID, isLiked, currentCount) {
        const newCount = isLiked ? currentCount + 1 : currentCount - 1
        await supabase.from('BulletinPosts').update({ likeCount: newCount }).eq('postID', postID)
    }


    async function handleLogout () {
        
        setloading(true)
        const {data, error} = await supabase.auth.signOut()

        if (error) {
            console.log('Error: ',error)
            setloading(false)
        }


        setUser(null)
        setloading(false)

    }

    useEffect(()=>{

        async function checkLogOut() {
            const { data: {subscription} } = supabase.auth.onAuthStateChange( (event,session) => {
                if (event === 'SIGNED_OUT') {
                    setloading(false)
                    navigate('/')
                    console.log('Logout Successful !!')
                }
            })
            return ()=> subscription.unsubscribe()            
        }checkLogOut()
        
    },[])


    
    useEffect(() => {

        setloading(true)

        // CHANGE TITLE NAME 
        document.title = "Dashboard"


        async function fetchAllPosts() {
            const { data, error } = await supabase.from('BulletinPosts')
            .select(`
                *,
                FileAttachment(fileURL),
                Users(userName),
                Category(categoryName)
                `).order('created_at', {ascending: false})

            // console.log('Fetched posts: '+JSON.stringify(data, null ,2))
            // console.log(data)

            if (error) {
                console.error('Error fetching:', error)
                return
            }
            setpost(data)

        }

        async function fetchAll() {

            
            setUser(await fetchCurrentUser())
            
            fetchAllPosts()
            setTimeout(()=>{setloading(false)},200)
            // setloading(false)
        }fetchAll()

    }, [])

    

    

    if (loading) return <Loading />

    return (
        <div className={`bg-gray-100 min-h-screen overflow-x-hidden ${open? 'block': 'hidden'} `}>

            <header className="bg-white shadow flex h-20 items-center pl-10">
                {/* icon and horn */}
                <div className="bg-primary-green aspect-square h-3/5 rounded-md items-center flex justify-center">
                    <i className="fa-solid fa-bullhorn invert fa-xl"></i>
                </div>
                <div className="ml-4">
                    <h1 className=" text-lg sm:text-xl font-bold text-primary-blue" >NewsNow</h1>
                    <h2 className=" hidden sm:block text-sm text-[#7B8794]">Universiti Malaysia Pahang Sultan Abdullah</h2>
                    <h2 className=" sm:hidden text-sm text-[#7B8794]">UMPSA</h2>
                </div>


                {/* this is the user icon things */}
                
                {user ? 
                <div className='ml-auto flex h-full'>

                    {/* this is the settings */}
                    <div className='mr-4 content-center '>
                        <i title='Setings Panel'
                        className='fas fa-gear cursor-pointer text-2xl text-gray-700'
                        onClick={()=>setSettingsPanel(true)}></i>
                        {/* <i className='fas fa-angle-down text-xl'></i> */}
                        <Settings logout={handleLogout} open={SettingsPanel} func={()=>setSettingsPanel(false)} />
                    </div>


                    {/* this is the notification panel */}
                    <div className='ml-auto mr-4 content-center'>
                        <i title='Notification Panel'
                        className='fas fa-bell text-primary-yellow cursor-pointer text-2xl'
                        onClick={()=>setPanel(true)}></i>
                        <NotifPanel open={Panel} func={()=>setPanel(false)} />
                    </div>


                    {/* this is the name and logo */}
                    <div title='Go to Profiles Page'
                    className='flex justify-end group h-full cursor-pointer items-center'
                    onClick={()=>navigate(`/profile/${user.userID}`)}>



                        <div className=' mr-4 h-full content-center '>
                            <img src={user?.pfp} className='rounded-full aspect-square h-11' alt="this the user pfp" /> 
                        </div>
                        <div className='hidden md:block md:mr-5'>
                            <h1 className="text-lg text-center font-bold text-primary-blue"> {user && user.userName} </h1> 
                            <div className='bg-primary-blue rounded-md pl-2 pr-2 p-1'><h2 className=" text-center text-primary-yellow font-bold text-xs"> {user && user.userRole} </h2></div>
                        </div>

                        {/* old log out function */}
                        {/* <div onClick={handleLogout} className=' hidden group-hover:flex cursor-pointer absolute top-20 w-40 right-0 bg-red-300 justify-center p-3 hover:bg-red-600 shadow'>
                            <i className="fas fa-sign-out-alt fa-xl text-primary-blue self-center content-center h-full"></i>
                            <h2 className='font-bold inline '>Logout</h2>
                        </div> */}
                        
                    </div>
                </div>
                

                :  // if else

                
                <div className='ml-auto'>
                    <div className='p-2 pr-3 pl-3 cursor-pointer text-white bg-primary-blue hover:bg-hover-blue rounded-md mr-5' onClick={()=>{navigate('/auth')}}>
                        <h2>Login/Signup</h2>
                    </div>
                </div>
                

                
                }

            </header>      



            {/* this is the top create bar based on user role */}
            <EditBar role={user ?  user.userRole : null} />


            {/* this is the start of the bulletin posts */}

            <div className='text-2xl font-bold ml-20 text-primary-blue inline-block mt-10'>Recent Posts</div>
            
            <div className="p-8 flex gap-6 flex-wrap">
            {post?.map(p => {
                const isLiked = likedPosts[p.postID] ?? false
                const displayCount = p.likeCount + (isLiked ? 1 : 0)

                return (
                    <div key={p.postID} className="bg-white rounded-xl p-8 w-full shadow hover:shadow-md">

                        <div>
                            {p.FileAttachment?.fileURL 
                                ? <img src={p.FileAttachment?.fileURL} className='rounded-md mb-6 max-h-30 w-full object-contain' />
                                : <p className="font-bold text-center p-1 bg-gray-300 h-30 content-center mb-6">NO IMAGE</p> 
                            } 
                        </div>

                        <h1 
                        onClick={() => navigate(`/posts/${p?.postID}`)}
                        className="font-bold text-primary-blue text-2xl hover:underline cursor-pointer truncate">{p.title}</h1>

                        <h2 className='text-white pl-2.5 pr-2.5 p-1 mt-3 inline-block rounded-xl bg-primary-blue'>{p.Category.categoryName}</h2>

                        <div className='flex items-center gap-2 mt-5'>
                            <span>Made by:</span>
                            <img className='rounded-full max-h-7' src={`https://ui-avatars.com/api/?background=0033A0&color=fff&name=${p.Users?.userName[0]}`}/>
                            <p className="text-lg text-primary-blue font-bold">{p.Users?.userName}</p>


                            {/* like feature */}
                            {/* <i 
                            className={`${isLiked ? 'fas' : 'far'} fa-heart cursor-pointer ml-auto text-2xl text-primary-blue`} 
                            onClick={() => {
                                const newLiked = !likedPosts[p.postID]
                                setLikedPosts(prev => ({ ...prev, [p.postID]: newLiked }))
                                handleLike(p.postID, newLiked, p.likeCount)
                            }}
                            ></i>
                            <span>{displayCount}</span> */}


                        </div>

                    </div>)})}
            </div>

        </div>
    )

}
