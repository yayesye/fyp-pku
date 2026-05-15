
import { useState,useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from './non-page-components/supabaseDB';

import {ErrorBox, GoodBox} from './non-page-components/DisplayBox'

import Posts from './Posts';
import Loading from './non-page-components/Loading';


export default function Dashboard () {

    // function test() {
    //     const {data, error} = supabase.from('User').select('*').single().then({data, error}) => {console.log(data)}
    //     return data
    // };

    const navigate = useNavigate()
    const parameter = useParams()

    const [user, setUser] = useState({})
    const [pfp, setpfp] = useState()
    const [post, setpost] = useState([])

    const [userid,setuserid] = useState()
    const [Role, setRole] = useState(false)

    const [loading, setloading] = useState(true)

    const sleep = (ms) => { new Promise(e => setTimeout(e,ms)) }


    async function handleLogout () {
        setloading(true)
        const {data, error} = await supabase.auth.signOut()

        if (error) {
            console.log('Error: ',error)
            setloading(false)
        }

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

        async function fetchUser() {
            
            const {data: {user}} = await supabase.auth.getUser()
            const userid = user.id
            setuserid(userid)


            const { data, error } = await supabase.from('Users').select('userName, userRole').eq('userID', userid).single()

            if (error) {
                console.error('Error fetching:', error)
                return
            }

            // console.log('Current user id: '+userid)
            // console.log('Current user name: '+data.userName)
            // console.log('Current user role: '+data.userRole)
            // console.log(data)

            if (!data.userName){
                setUser({userName: 'Anonymous', userRole: 'Anonymous'})
                setpfp(`https://ui-avatars.com/api/?background=0033A0&color=fff&name=A`)
            }

            // console.log(data.userName)

            setUser(data)
            setpfp(`https://ui-avatars.com/api/?background=0033A0&color=fff&name=${data.userName[0]}`)

        }


        async function fetchAllPosts() {
            const { data, error } = await supabase.from('BulletinPosts')
            .select(`
                *,
                FileAttachment(fileURL),
                Users(userName),
                Category(categoryName)
                `)

            // console.log('Fetched posts: '+JSON.stringify(data, null ,2))
            // console.log(data)

            if (error) {
                console.error('Error fetching:', error)
                return
            }
            setpost(data)

        }

        function fetchAll() {
            fetchUser()
            fetchAllPosts()
            setTimeout(()=>{setloading(false)},800)
            // setloading(false)
        }fetchAll()

    }, [])

    


    if (loading) return <Loading />

    return (
        <div className="bg-gray-100 min-h-screen">
            <header className="bg-white shadow flex h-20 items-center pl-10">
                {/* icon and horn */}
                <div className="bg-primary-green aspect-square h-3/5 rounded-md items-center flex justify-center">
                    <i className="fa-solid fa-bullhorn invert fa-xl"></i>
                </div>
                <div className="ml-4">
                    <h1 className="text-xl font-bold text-primary-blue" >NewsNow PKU </h1>
                    <h2 className="text-sm text-[#7B8794]">Universiti Malaysia Pahang Sultan Abdullah</h2>
                </div>

                {/* this is the user icon things */}
                <div className='ml-auto pl-10 md:pr-10 flex group cursor-pointer h-full items-center'>
                    <div className='ml-auto mr-4 h-full content-center '>
                        <img src={pfp} className='rounded-full aspect-square h-11' alt="this the user pfp" /> 
                    </div>
                    <div className='hidden md:block'>
                        <h1 className="text-lg text-center font-bold text-primary-blue"> {user.userName} </h1>
                        <div className='bg-primary-blue rounded-md pl-2 pr-2 p-1'><h2 className=" text-center text-primary-yellow font-bold text-xs"> {user.userRole} </h2></div>
                    </div>

                    <div onClick={handleLogout} className=' hidden group-hover:flex cursor-pointer absolute top-20 w-45 right-0 bg-red-300 justify-center p-3 hover:bg-red-600 shadow'>
                        <i className="fas fa-sign-out-alt fa-xl text-primary-blue self-center content-center h-full"></i>
                        <h2 className='font-bold inline '>Logout</h2>
                    </div>
                    
                </div>

            </header>      



            {/* this is for staff's only */}
            
            {user.userRole === 'STAFF' && 
            <div className='flex flex-col md:flex-row'>
                <div className=' md:w-1/2 h-20 bg-primary-blue hover:bg-hover-blue m-5 rounded-xl cursor-pointer flex items-center justify-center gap-5' onClick={() => navigate('/create')}>
                    <i className='fas fa-plus fa-xl pt-1 invert'></i>
                    <h2 className='text-white text-center font-bold text-xl '>Create New Posts</h2>
                </div>
                {/* {console.log(userid)} */}
                <div className=' md:w-1/2 m-5 mt-0 md:mt-5 h-20 bg-primary-green hover:bg-hover-green rounded-xl cursor-pointer flex items-center justify-center gap-5' onClick={() => navigate(`/profile/${userid}`)}>
                    <i className='fas fa-edit fa-xl invert'></i>
                    <h2 className='text-white text-center font-bold text-xl '>Edit Posts</h2>                    
                </div>
            </div>
            }
            



            {/* this is the start of the bulletin posts */}

            <div className='text-2xl font-bold ml-20 text-primary-blue inline-block mt-10'>Recent Posts</div>
            
            <div className="p-8 flex gap-6 flex-wrap">
                {
                post?.map(p => (
                    <div key={p.postID} className="bg-white rounded-xl p-8 w-full shadow cursor-pointer hover:shadow-md"
                        onClick={() => navigate(`/posts/${p.postID}`)}>

                        <div>
                            {p.FileAttachment?.fileURL 
                                ? <img src={p.FileAttachment?.fileURL} className='rounded-md mb-6 max-h-30 w-full object-contain' />
                                : <p className="font-bold text-center p-1 bg-gray-300 h-30 content-center mb-6">NO IMAGE</p> 
                            } 
                        </div>

                        <span className="font-bold text-primary-blue text-2xl hover:underline text-wrap ">{p.title}</span>
                        <div className='flex items-center gap-2 mt-5'>
                            <span>Made by:</span>
                            <img className='rounded-full max-h-7' src={`https://ui-avatars.com/api/?background=0033A0&color=fff&name=${p.Users?.userName[0]}`}/>
                            <p className="text-lg text-primary-blue font-bold">{p.Users?.userName}</p>
                        </div>

                    </div>
                ))}
            </div>

        </div>
    )

}
