import { useState, useEffect } from "react"
import { supabase } from "./non-page-components/supabaseDB"
import { Link, useNavigate, useParams } from "react-router-dom"

import CommentSection from "./CommentSection"
import Loading from "./non-page-components/Loading"


// CHANGE TITLE NAME

export default function Posts () {

    const [posts, setPosts] = useState()
    const [attachment , setAttachment] = useState()
    const [pfp, setpfp] = useState()
    const [commentContent, setCommentContent] = useState()
    const [userid, setuserid] = useState()
    const [timestamptz, setTime] = useState()

    const [loading,setloading] = useState(false)

    const param = useParams()
    const navigate = useNavigate()

    const commentFormat = {
        postID: posts?.postID,
        userID: userid,
        parentComment: null,
        content: commentContent,
        postedTime: new Date().toISOString() ,
        status: 'ACTIVE'
    }

    // console.log(commentFormat)

    async function submitComment() {
        const {data, error} = await supabase.from('Comments').insert(commentFormat)

        if (error) console.log('Error comment: ',error)
        else console.log('Comment inserted!!')
        
    }


    useEffect(() => {

        // CHANGE TITLE NAME
        document.title = "Posts"

        async function fetchUser() {
            const { data: {session}, error } = await supabase.auth.getSession()
            session ? setuserid(session.user.id) : console.log('Error fetching user: ',error)

            // console.log(session.user.id)
        }fetchUser()

        async function fetchPosts() {
            // console.log(postid)
            const { data, error } = await supabase.from('BulletinPosts')
            .select(`
                *,
                FileAttachment(fileURL),
                Users(userName),
                Category(categoryName)
                `)
            .eq('postID', param.postid)
            .single()


            if (error) {
                console.error('Error fetching:', error)
                return
            }


            setPosts(data)
            setpfp(`https://ui-avatars.com/api/?background=0033A0&color=fff&name=${data.Users.userName[0]}`)
        }fetchPosts()


    }, [])    
    

    
    if (loading) return <Loading />

    return (
        <div className="bg-gray-100 h-screen overflow-auto ">

            <nav >
                <div 
                onClick={()=>navigate(-1)}
                className="cursor-pointer self-start inline">
                    <i className="fa-solid fa-arrow-left fa-2x p-5"></i>
                </div>
            </nav>

            <div className=" md:m-10 md:mt-0 rounded-xl bg-white shadow-[0_0_35px_rgba(0,0,0,0.25)] ">
                {/* this is the banner */}
                <div className=" object-cover">
                    <img src={posts?.FileAttachment?.fileURL} className="inset-ring-2 " />
                </div>
                

                {/* this is the title of the post */}
                <div className="h-15 content-center bg-primary-blue " >
                    <h1 className="font-bold text-center text-white " >{posts?.title}</h1>
                    {/* <h1 className=" font-bold text-center"> {post.title} </h1> */}
                </div>

                <div className='p-2 flex content-center gap-3 bg-gray-200 '>
                    <h3 className=" content-center">Made by: </h3>
                    <img src={pfp} className='rounded-full aspect-square h-8' alt="this the user pfp" /> 
                    <h1 className="text-md font-bold text-primary-blue content-center">{posts?.Users.userName}</h1> 
                </div>                  


                {/* this is the content or paragraph */}
                <div className="p-5 bg-white min-h-[25vw] rounded-b-xl"> <p>{posts?.description} </p> </div>


            </div>



            {/* this is the comment section area */}

            {/* textbox area */}
            <div className="w-full bg-primary-green flex justify-center p-5 gap-4">
                {/* our pfp */}
                <img src={pfp} alt="pfp" className=" aspect-square h-12 rounded-full"  />
                <textarea 
                onChange={(e)=>{ setCommentContent(e.target.value) }}
                className='bg-white focus:outline-0 resize-none w-full md:w-2/3 field-sizing-content p-2' id="comment-content" placeholder="Write your comments here..."></textarea>
                <button 
                onClick={submitComment}
                className="cursor-pointer bg-primary-blue rounded-2xl text-white w-20 ">Submit</button>
            </div>


            {/* this is the recursive comments */}
            {posts?.postID && <CommentSection postid={posts.postID} />}

        </div>
    )
}