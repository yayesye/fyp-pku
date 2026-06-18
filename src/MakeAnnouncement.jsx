import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "./non-page-components/supabaseDB"
import CategoryDropdown from "./non-page-components/CategoryDropdown";
import { ErrorBox, GoodBox } from "./non-page-components/DisplayBox";
import Loading from "./non-page-components/Loading";

export default function MakeAnnouncement() {

    const navigate = useNavigate()

    const date = new Date().toISOString().slice(0, 10);
    const time = new Date().toLocaleTimeString('en-GB', { hour12: false });

    const [Error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [Done, setDone] = useState(false)

    const [loading, setloading] = useState(false)


    const [postForm, setPostForm] = useState({
        categoryID: 1,
        title: '',
        description: '',
        publishDate: date,
        publishTime: time,
        status: 'ACTIVE'
    })      


    useEffect(() => {
        document.title = 'Announcement'
    }, [])

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setPostForm((prev) => ({
            ...prev,
            [name]  : type === 'checkbox' ? checked
                    : value,
        }));
    };

    

    async function insertPost ()  {

        const userid = (await supabase.auth.getUser()).data.user.id

        const { data, error } = await supabase
            .from('BulletinPosts')
            .insert({ ...postForm, userID: userid}) 
            .select()


        if (error) throw error

        return data
    }

    async function getFunctionErrorMessage(error) {
        const fallback = error?.message || "Notification failed."

        try {
            const body = await error.context.json()
            return body.error || fallback
        } catch {
            return fallback
        }
    }

    async function handleSubmitAll() {
        setloading(true)
        let wasPosted = false

        try {
            setError(false)
            setErrorMessage("")
            const post = await insertPost()
            wasPosted = true

            const { error: pushError } = await supabase.functions.invoke("send-announcement-push", {
                body: {
                    title: postForm.title,
                    description: postForm.description,
                    postID: post[0].postID
                }
            })

            if (pushError) {
                throw new Error(await getFunctionErrorMessage(pushError))
            }

            setDone(true)
            console.log("Done!", { post })

        } catch (error) {
            console.error("Error: ", error)
            setError(true)
            setErrorMessage(wasPosted ? `Posted, but notification failed: ${error.message}` : "Announcement could not be posted.")
            setDone(false)
        } finally {
            setloading(false)
        }
    }


    
    if (loading) return <Loading />

       
    return (
        <div className="bg-gray-100 min-h-screen">

            {/* this is the create post banner */}
            <div className="h-20 bg-primary-yellow text-white text-center font-bold text-2xl flex items-center justify-between">
                <nav className="w-20"><Link to={-1}><i className="fa-solid fa-arrow-left fa-xl p-5"></i></Link></nav>
                <h1>Make Announcement</h1>
                <div className="w-20"></div> {/* this is a placeholder div */}
            </div>

            {/* this is the middle box */}
            <form >
            <div className="bg-white shadow w-screen md:w-2/3 h-full justify-self-center flex p-8 flex-col justify-start gap-4 ">
                
                <label htmlFor="userName">
                    <h2 className=" font-bold text-primary-yellow pb-2" >Title</h2>
                    <input 
                    onChange={handleChange}
                    value={postForm.title}
                    type="text" name="title" className=" outline-2 outline-gray-300 p-3 rounded-md placeholder:text-gray-400 w-full  " placeholder="Title Name...."/>
                </label>

                <label htmlFor="postDesc">
                    <h2 className=" font-bold text-primary-yellow pb-2" >Description</h2>
                    <textarea 
                    onChange={handleChange}
                    value={postForm.description}
                    name="description" className=" resize-none border-2 border-gray-300 w-full p-3 h-50" placeholder="Insert Description Here......"></textarea>
                </label>

                <div className="text-primary-yellow">
                    <CategoryDropdown value={postForm.categoryID} onChange={handleChange} />
                </div>
                


                {/* this is the submit button */}
                <button
                onClick={(e)=>{e.preventDefault(); handleSubmitAll();} }
                className=" text-white bg-primary-yellow hover:brightness-110  cursor-pointer rounded-xl h-12 mt-8 min-w-50 self-end-safe ">Create</button>

                {Done && <GoodBox message='Posted!!' onDismiss={()=>navigate(-1)} /> }
                {Error && <ErrorBox message={errorMessage} onDismiss={()=>setError(false)} /> }

            </div>
            </form>
            
        </div>
    )
}
