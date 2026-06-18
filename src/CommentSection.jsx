// import { useEffect, useState } from "react"
// import { fetchCurrentUser, supabase } from "./non-page-components/supabaseDB"
// import { NeutralBox } from "./non-page-components/DisplayBox"

// function Comments({ comment, onReply, onDelete, currentUserid }) {
//     const [showReplyBox, setShowReplyBox] = useState(false)
//     const [replyContent, setReplyContent] = useState("")
//     const [delComment, setdelComment] = useState()

//     function handleReply() {
//         if (!replyContent.trim()) return
//         onReply(comment.commentID, replyContent)
//         setReplyContent("")
//         setShowReplyBox(false)
//     }

//     return (
//         <div className="p-5 pt-0 bg-gray-100">
//             <div className="flex items-start h-full">
//                 <div className="flex">
//                     {/* <img src={} className="rounded-full aspect-square max-h-8" /> */}
//                     <h1 className="font-bold content-center ml-2 border-b-2">{comment.Users.userName}</h1>
//                 </div>
                

//                 {/* delete button - only shown to the comment's author */}
//                 {currentUserid === comment.userID && (
//                     <div 
//                     onClick={()=>{setdelComment('Delete Comment?')}}
//                     // onClick={() => onDelete(comment.commentID)}
//                     className="cursor-pointer p-0.5 text-red-500 hover:underline rounded-lg ml-8 ">
//                         <p>Delete</p>
//                     </div>
//                 )}
//             </div>

//             <div className="pl-5 pt-2">
//                 <h2>{comment.content}</h2>
//             </div>

//             {/* reply button */}
//             {
//             currentUserid &&
//             <button
//                 onClick={() => setShowReplyBox(!showReplyBox)}
//                 className="text-sm p-1 text-white rounded-md bg-primary-blue mt-5 cursor-pointer">
//                 {showReplyBox ? "Cancel" : "Reply"}
//             </button>
//             }

//             {/* reply box */}
//             {showReplyBox && (
//                 <div className="flex gap-2 mt-2 animate-pop">
//                     <textarea
//                         value={replyContent}
//                         onChange={(e) => setReplyContent(e.target.value)}
//                         className="bg-white focus:outline-0 resize-none w-full p-2 text-sm"
//                         placeholder="Write a reply..."
//                     />
//                     <button
//                         onClick={handleReply}
//                         className="bg-black text-white px-3 text-sm cursor-pointer">
//                         Send
//                     </button>
//                 </div>
//             )}

//             {/* recursion - renders replies of replies */}
//             <div className="mt-3 ml-4 border-l-2 border-gray-400">
//                 {comment.replies.map(reply => (
//                     <Comments
//                         key={reply.commentID}
//                         comment={reply}
//                         onReply={onReply}
//                         onDelete={onDelete}
//                         currentUserid={currentUserid}
//                     />
//                 ))}
//             </div>

//             {delComment && <NeutralBox message={delComment} No={()=>setdelComment(null)} Yes={()=>{onDelete(comment.commentID); setdelComment(null)}} /> }
//         </div>
//     )
// }


// export default function CommentSection({ postid, refresh }) {

//     const [formattedData, setFormattedData] = useState()
//     const [userid, setUserid] = useState()
//     const [username, setusername] = useState()

//     useEffect(() => {
//         async function fetchUser() {

//             const { data: { session } } = await supabase.auth.getSession()
//             if (session) setUserid(session.user.id)
//             else return;
            
//             const { data, error } = await supabase.from('Users').select('userName').eq('userID', session.user.id).single()
//             if (error) console.log('Error: ', error)

//             setusername(data)
//         }
//         fetchUser()

//         async function fetchComments() {
            
//             const { data, error } = await supabase.from('Comments').select('*,Users(userName)').eq('postID', postid)

//             if (error) console.log('Error: ', error)
//             else setFormattedData(buildTree(data))
//         }
//         fetchComments()
//     }, [postid, refresh])


//     function buildTree(rows) {
//         const map = {};
//         const roots = [];

//         rows.forEach(row => { map[row.commentID] = { ...row, replies: [] } });

//         rows.forEach(row => {
//             if (row.parentComment == null) {
//                 roots.push(map[row.commentID]);
//             } else {
//                 map[row.parentComment]?.replies.push(map[row.commentID])
//             }
//         });

//         return roots;
//     }

//     async function handleReply(parentCommentID, content) {
//         const reply = {
//             postID: postid,
//             userID: userid,
//             parentComment: parentCommentID,
//             content: content,
//             postedTime: new Date().toISOString(),
//             status: 'ACTIVE'
//         }

//         const { error } = await supabase.from('Comments').insert(reply)

//         if (error) console.log('Error inserting reply: ', error)
//         else {
//             const { data } = await supabase.from('Comments').select('*,Users(userName)').eq('postID', postid)
//             setFormattedData(buildTree(data))
//         }
//     }

//     async function handleDelete(commentID) {
//         const { error } = await supabase.from('Comments').delete().eq('commentID', commentID)

//         if (error) console.log('Error deleting comment: ', error)
//         else {
//             const { data } = await supabase.from('Comments').select('*,Users(userName)').eq('postID', postid)
//             setFormattedData(buildTree(data))
//         }
//     }

//     return (
//         <div className="mt-10">
//             {formattedData?.map(comment => (
//                 <Comments
//                     key={comment.commentID}
//                     comment={comment}
//                     onReply={handleReply}
//                     onDelete={handleDelete}
//                     currentUserid={userid}
//                 />
//             ))}
//         </div>
//     )
// }








import { useEffect, useState } from "react"
import { supabase } from "./non-page-components/supabaseDB"
import { NeutralBox } from "./non-page-components/DisplayBox"

// function Comments({ comment, onReply, onDelete, currentUserid }) {
//     const [showReplyBox, setShowReplyBox] = useState(false)
//     const [replyContent, setReplyContent] = useState("")
//     const [delComment, setdelComment] = useState(null)

//     function handleReply() {
//         if (!replyContent.trim()) return

//         onReply(comment.commentID, replyContent)
//         setReplyContent("")
//         setShowReplyBox(false)
//     }

//     return (
//         <div className="p-5 pt-0 bg-gray-100">
//             <div className="flex items-start h-full">
//                 <div className="flex">
//                     <h1 className="font-bold content-center ml-2 border-b-2">
//                         {comment.Users?.userName ?? "Unknown User"}
//                     </h1>
//                 </div>

//                 {currentUserid === comment.userID && (
//                     <div
//                         onClick={() => setdelComment("Delete Comment?")}
//                         className="cursor-pointer p-0.5 text-red-500 hover:underline rounded-lg ml-8"
//                     >
//                         <p>Delete</p>
//                     </div>
//                 )}
//             </div>

//             <div className="pl-5 pt-2">
//                 <h2>{comment.content}</h2>
//             </div>

//             {currentUserid && (
//                 <button
//                     onClick={() => setShowReplyBox(!showReplyBox)}
//                     className="text-sm p-1 text-white rounded-md bg-primary-blue mt-5 cursor-pointer"
//                 >
//                     {showReplyBox ? "Cancel" : "Reply"}
//                 </button>
//             )}

//             {showReplyBox && (
//                 <div className="flex gap-2 mt-2 animate-pop">
//                     <textarea
//                         value={replyContent}
//                         onChange={(e) => setReplyContent(e.target.value)}
//                         className="bg-white focus:outline-0 resize-none w-full p-2 text-sm"
//                         placeholder="Write a reply..."
//                     />

//                     <button
//                         onClick={handleReply}
//                         className="bg-black text-white px-3 text-sm cursor-pointer"
//                     >
//                         Send
//                     </button>
//                 </div>
//             )}

//             <div className="mt-3 ml-4 border-l-2 border-gray-400">
//                 {comment.replies?.map(reply => (
//                     <Comments
//                         key={reply.commentID}
//                         comment={reply}
//                         onReply={onReply}
//                         onDelete={onDelete}
//                         currentUserid={currentUserid}
//                     />
//                 ))}
//             </div>

//             {delComment && (
//                 <NeutralBox
//                     message={delComment}
//                     No={() => setdelComment(null)}
//                     Yes={() => {
//                         onDelete(comment.commentID)
//                         setdelComment(null)
//                     }}
//                 />
//             )}
//         </div>
//     )
// }

function Comments({ comment, onReply, onDelete, currentUserid }) {
    const [showReplyBox, setShowReplyBox] = useState(false)
    const [replyContent, setReplyContent] = useState("")
    const [delComment, setdelComment] = useState(null)

    function handleReply() {
        if (!replyContent.trim()) return
        onReply(comment.commentID, replyContent)
        setReplyContent("")
        setShowReplyBox(false)
    }

    const avatarUrl = `https://ui-avatars.com/api/?background=264688&color=fff&name=${comment.Users?.userName?.[0] ?? '?'}`

    return (
        <div className="p-4">
            {/* Author row */}
            <div className="flex items-center gap-2 mb-2">
                <img src={avatarUrl} className="rounded-full h-7 shrink-0" />
                <span className="font-semibold text-primary-blue text-sm">{comment.Users?.userName ?? "Unknown"}</span>

            </div>

            {/* Comment body */}
            <div className="ml-5">
                <p className="text-gray-700 text-sm leading-relaxed">{comment.content}</p>

                {/* Reply button */}
                {currentUserid && (
                    <button
                        onClick={() => setShowReplyBox(!showReplyBox)}
                        className="mt-2 text-sm font-semibold text-primary-blue hover:underline cursor-pointer"
                    >
                        {showReplyBox ? "Cancel" : <div><i className="fas fa-reply mr-1"></i><span>Reply</span></div>  }
                    </button>
                )}
                
                {/* delete button */}
                {currentUserid === comment.userID && (
                    <button
                        onClick={() => setdelComment("Delete this comment?")}
                        className="ml-3 text-sm text-red-400 hover:text-red-600 hover:underline cursor-pointer">
                        Delete
                    </button>
                )}

                {/* Reply box */}
                {showReplyBox && (
                    <div className="flex flex-col gap-2 mt-3">
                        <textarea
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            rows={2}
                            className="flex-1 border border-gray-400 rounded-lg p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-blue"
                            placeholder="Write a reply..."
                        />
                        <button
                            onClick={handleReply}
                            className="self-end sm:self-start  bg-primary-blue text-white text-sm px-4 py-2 rounded-lg hover:opacity-90 cursor-pointer"
                        >
                            Send
                        </button>
                    </div>
                )}

                {/* Nested replies */}
                {comment.replies?.length > 0 && (
                    <div className="mt-3 border-l-2 border-gray-200 space-y-3">
                        {comment.replies.map(reply => (
                            <Comments
                                key={reply.commentID}
                                comment={reply}
                                onReply={onReply}
                                onDelete={onDelete}
                                currentUserid={currentUserid}
                            />
                        ))}
                    </div>
                )}
            </div>

            {delComment && (
                <NeutralBox
                    message={delComment}
                    No={() => setdelComment(null)}
                    Yes={() => { onDelete(comment.commentID); setdelComment(null) }}
                />
            )}
        </div>
    )
}


export default function CommentSection({ postid, refresh }) {
    const [formattedData, setFormattedData] = useState([])
    const [userid, setUserid] = useState(null)

    useEffect(() => {
        if (!postid) return

        fetchUser()
        fetchComments()
    }, [postid, refresh])

    async function fetchUser() {
        const { data: { session }, error } = await supabase.auth.getSession()

        if (error) {
            console.log("Error getting session:", error)
            return
        }

        setUserid(session?.user?.id ?? null)
    }

    async function fetchComments() {
        const { data, error } = await supabase
            .from("Comments")
            .select("*, Users(userName)")
            .eq("postID", postid)

        if (error) {
            console.log("Error fetching comments:", error)
            return
        }

        setFormattedData(buildTree(data ?? []))
    }

    function buildTree(rows) {
        const map = {}
        const roots = []

        rows.forEach(row => {
            map[row.commentID] = { ...row, replies: [] }
        })

        rows.forEach(row => {
            if (row.parentComment == null) {
                roots.push(map[row.commentID])
            } else {
                map[row.parentComment]?.replies.push(map[row.commentID])
            }
        })

        return roots
    }

    async function handleReply(parentCommentID, content) {
        if (!userid) return

        const reply = {
            postID: postid,
            userID: userid,
            parentComment: parentCommentID,
            content,
            postedTime: new Date().toISOString(),
            status: "ACTIVE"
        }

        const { error } = await supabase.from("Comments").insert(reply)

        if (error) {
            console.log("Error inserting reply:", error)
            return
        }

        fetchComments()
    }

    async function handleDelete(commentID) {
        const { error } = await supabase
            .from("Comments")
            .delete()
            .eq("commentID", commentID)

        if (error) {
            console.log("Error deleting comment:", error)
            return
        }

        fetchComments()
    }

    return (
        <div className={formattedData?.length == 0 ? "mt-0" : "mt-10" }>
            {console.log(formattedData)}
            {formattedData?.map(comment => (
                <Comments
                    key={comment.commentID}
                    comment={comment}
                    onReply={handleReply}
                    onDelete={handleDelete}
                    currentUserid={userid}
                />
            ))}
        </div>
    )
}