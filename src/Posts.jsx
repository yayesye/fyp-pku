import { useState, useEffect } from "react"
import { fetchAllPosts, fetchCurrentUser, supabase } from "./non-page-components/supabaseDB"
import { Link, useNavigate, useParams } from "react-router-dom"

import CommentSection from "./CommentSection"
import Loading from "./non-page-components/Loading"
import {ErrorBox, NeutralBox} from './non-page-components/DisplayBox'


// CHANGE TITLE NAME

export default function Posts () {

    const [posts, setPosts] = useState()
    const [attachment , setAttachment] = useState()
    const [pfp, setpfp] = useState()
    const [commentContent, setCommentContent] = useState()
    const [commentUserid, setcommentUserid] = useState()
    const [timestamptz, setTime] = useState()
    const [loggedIn, setloggedIn] = useState(false)

    const [loading,setloading] = useState(false)
    const [refresh, setrefresh] = useState(0)
    const [errorMsg, setErrorMsg] = useState()

    const param = useParams()
    const navigate = useNavigate()

    const commentFormat = {
        postID: posts?.postID,
        userID: commentUserid?.userID,
        parentComment: null,
        content: commentContent,
        postedTime: new Date().toISOString() ,
        status: 'ACTIVE'
    }


    async function submitComment() {

        if (!commentContent) {
            setErrorMsg('Comment cant be Empty')
            return
        }

        const {data, error} = await supabase.from('Comments').insert(commentFormat)

        if (error) console.log('Error comment: ',error)
        else {
            console.log('Comment inserted!!')
            setCommentContent('')
            setrefresh(e => e + 1 )
        }
        
    }


    useEffect(() => {

        // CHANGE TITLE NAME
        document.title = "Posts"


        async function fetchPosts() {

            const fetchPost = await fetchAllPosts()
            const data = fetchPost.find(p => p.postID === Number(param.postid) )
            

            data.publishDate = new Date(data.publishDate).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            });

            data.publishTime = (() => {
            const [h, m] = data.publishTime.split(':');
            const d = new Date();
            d.setHours(h, m);
            return d.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
            });
            })();         
            
            
            setPosts(data)
            setpfp(`https://ui-avatars.com/api/?background=0033A0&color=fff&name=${data.Users.userName[0]}`)
        }


        async function fetchAll(){
            setcommentUserid(await fetchCurrentUser())
            fetchPosts()
            
        }fetchAll()


    }, [])    
    
    

    
    if (loading) return <Loading />

    return (
        <div className="bg-gray-100 min-h-screen mb-20 overflow-auto ">

            <nav >
                <div 
                onClick={()=>navigate(-1)}
                className="cursor-pointer self-start inline">
                    <i className="fa-solid fa-arrow-left fa-2x p-5"></i>
                </div>
            </nav>

            {/* this is the middle block */}
            <div className=" lg:m-20 lg:mt-0 bg-white shadow-[0_0_35px_rgba(0,0,0,0.25)] ">
                {/* this is the banner */}
                <div className=" justify-center flex">
                    {posts?.FileAttachment?.fileURL? 
                        <img src={posts.FileAttachment.fileURL} className="max-h-[50vw]" /> : <p>NO IMAGE</p>
                    }
                </div>
                

                {/* this is the title of the post */}
                <div className="h-15 content-center bg-primary-blue " >
                    <h1 className="font-bold text-center text-white truncate ml-3 mr-3 " >{posts?.title}</h1>
                    {/* <h1 className=" font-bold text-center"> {post.title} </h1> */}
                </div>

                <div className='p-2 flex content-center gap-3 bg-gray-200 '>
                    <h3 className=" content-center">Made by: </h3>
                    <img src={pfp && pfp} className='rounded-full aspect-square h-8' alt="this the user pfp" /> 
                    <h1 className="text-md font-bold text-primary-blue content-center">{posts?.Users.userName}</h1> 
                    <h1 className="ml-auto content-center"><strong className="ml-2">{posts?.publishDate}</strong> </h1>
                </div>         


                {/* this is the content or paragraph */}
                <div className="p-5 bg-white min-h-[25vw] rounded-b-xl whitespace-pre-wrap"> <p>{posts?.description} </p> </div>


            </div>



            {/* this is the comment section area */}

            {/* textbox area */}
            
            {
            commentUserid ?
  


            <div className="sticky w-full bottom-0 min-h-20 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.2)] p-4">
                <div className="max-w-3xl mx-auto flex  gap-3">
                    
                    {/* Avatar */}
                    <img 
                        src={commentUserid?.pfp} 
                        alt="pfp" 
                        className="aspect-square h-9 w-9 rounded-full shrink-0 mb-1" 
                    />

                    {/* Input */}
                    <textarea
                        value={commentContent || ''}
                        onChange={(e) => setCommentContent(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitComment() } }}
                        rows={1}
                        className="flex-1 bg-gray-100 rounded-2xl px-4 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-blue field-sizing-content"
                        placeholder="Write a comment..."
                    />

                    {/* Submit */}
                    <button
                        type="button"
                        onClick={submitComment}
                        className="cursor-pointer max-h-10 shrink-0 bg-primary-blue text-white text-sm font-semibold px-4 py-2 rounded-2xl hover:opacity-90 mb-1"
                    >
                        Post
                    </button>

                </div>
            </div>

            :

            <div>

            </div>
            }

            <CommentSection postid={posts?.postID} refresh={refresh} />


            {errorMsg && <ErrorBox message={errorMsg} onDismiss={()=>setErrorMsg('')} /> }

        </div>
    )
}