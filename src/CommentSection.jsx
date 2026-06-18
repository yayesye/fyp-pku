import { useEffect, useState } from "react"
import { supabase } from "./non-page-components/supabaseDB"
import { NeutralBox } from "./non-page-components/DisplayBox"

function Comments({ comment, onReply, onDelete, currentUserid }) {
    const [showReplyBox, setShowReplyBox] = useState(false)
    const [replyContent, setReplyContent] = useState("")
    const [delComment, setdelComment] = useState()

    function handleReply() {
        if (!replyContent.trim()) return
        onReply(comment.commentID, replyContent)
        setReplyContent("")
        setShowReplyBox(false)
    }

    return (
        <div className="p-5 pt-0 bg-gray-100">
            <div className="flex items-start h-full">
                <div className="flex">
                    {/* <img src={} className="rounded-full aspect-square max-h-8" /> */}
                    <h1 className="font-bold content-center ml-2 border-b-2">{comment.Users.userName}</h1>
                </div>
                

                {/* delete button - only shown to the comment's author */}
                {currentUserid === comment.userID && (
                    <div 
                    onClick={()=>{setdelComment('Delete Comment?')}}
                    // onClick={() => onDelete(comment.commentID)}
                    className="cursor-pointer p-0.5 text-red-500 hover:underline rounded-lg ml-8 ">
                        <p>Delete</p>
                    </div>
                )}
            </div>

            <div className="pl-5 pt-2">
                <h2>{comment.content}</h2>
            </div>

            {/* reply button */}
            <button
                onClick={() => setShowReplyBox(!showReplyBox)}
                className="text-sm p-1 text-white rounded-md bg-primary-blue mt-5 cursor-pointer">
                {showReplyBox ? "Cancel" : "Reply"}
            </button>

            {/* reply box */}
            {showReplyBox && (
                <div className="flex gap-2 mt-2 animate-pop">
                    <textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        className="bg-white focus:outline-0 resize-none w-full p-2 text-sm"
                        placeholder="Write a reply..."
                    />
                    <button
                        onClick={handleReply}
                        className="bg-black text-white px-3 text-sm cursor-pointer">
                        Send
                    </button>
                </div>
            )}

            {/* recursion - renders replies of replies */}
            <div className="mt-3 ml-4 border-l-2 border-gray-400">
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

            {delComment && <NeutralBox message={delComment} No={()=>setdelComment(null)} Yes={()=>{onDelete(comment.commentID); setdelComment(null)}} /> }
        </div>
    )
}


export default function CommentSection({ postid, refresh }) {

    const [formattedData, setFormattedData] = useState()
    const [userid, setUserid] = useState()
    const [username, setusername] = useState()

    useEffect(() => {
        async function fetchUser() {
            const { data: { session } } = await supabase.auth.getSession()
            if (session) setUserid(session.user.id)

            const { data, error } = await supabase.from('Users').select('userName').eq('userID', session.user.id).single()
            if (error) console.log('Error: ', error)

            setusername(data)
        }
        fetchUser()

        async function fetchComments() {
            const { data, error } = await supabase.from('Comments').select('*,Users(userName)').eq('postID', postid)

            if (error) console.log('Error: ', error)
            else setFormattedData(buildTree(data))
        }
        fetchComments()
    }, [postid, refresh])


    function buildTree(rows) {
        const map = {};
        const roots = [];

        rows.forEach(row => { map[row.commentID] = { ...row, replies: [] } });

        rows.forEach(row => {
            if (row.parentComment == null) {
                roots.push(map[row.commentID]);
            } else {
                map[row.parentComment]?.replies.push(map[row.commentID])
            }
        });

        return roots;
    }

    async function handleReply(parentCommentID, content) {
        const reply = {
            postID: postid,
            userID: userid,
            parentComment: parentCommentID,
            content: content,
            postedTime: new Date().toISOString(),
            status: 'ACTIVE'
        }

        const { error } = await supabase.from('Comments').insert(reply)

        if (error) console.log('Error inserting reply: ', error)
        else {
            const { data } = await supabase.from('Comments').select('*,Users(userName)').eq('postID', postid)
            setFormattedData(buildTree(data))
        }
    }

    async function handleDelete(commentID) {
        const { error } = await supabase.from('Comments').delete().eq('commentID', commentID)

        if (error) console.log('Error deleting comment: ', error)
        else {
            const { data } = await supabase.from('Comments').select('*,Users(userName)').eq('postID', postid)
            setFormattedData(buildTree(data))
        }
    }

    return (
        <div className="mt-10">
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