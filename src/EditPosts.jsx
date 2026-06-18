import { useState, useEffect } from "react"
import { Link, useNavigate, useParams } from "react-router-dom";
import { supabase } from "./non-page-components/supabaseDB"
import ImgBBUploadButton from "./non-page-components/ImgBBUploadButton"
import CategoryDropdown from "./non-page-components/CategoryDropdown";
import { ErrorBox, GoodBox } from "./non-page-components/DisplayBox";
import Loading from "./non-page-components/Loading";

export default function EditPosts() {

    const navigate = useNavigate()
    const param = useParams()

    const [imageData, setImageData] = useState({})

    const [Error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [Done, setDone] = useState(false)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    const [postForm, setPostForm] = useState({
        categoryID: 1,
        title: '',
        description: '',
        attachmentID: null,
        FileAttachment: null,
    })


    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        setPostForm((prev) => ({
            ...prev,
            [name]  : type === 'checkbox' ? checked
                    : type === 'file'     ? files[0]
                    : value,
        }));
    };

    useEffect(()=>{
        async function fetchPosts() {
            setLoading(true)
            setError(false)

            const { data, error } = await supabase
                .from('BulletinPosts')
                .select(`
                    postID,
                    categoryID,
                    title,
                    description,
                    attachmentID,
                    FileAttachment(fileURL)
                `)
                .eq('postID', param.postid)
                .single()

            if (error) {
                console.log('Error: ', error)
                setError(true)
                setErrorMessage('Could not load this post.')
                setLoading(false)
                return
            }

            setPostForm(data)
            setLoading(false)
        }

        document.title = 'Edit Posts'
        fetchPosts()
    },[param.postid])


    async function insertAttachment ()  {
        if (!imageData.url) return null

        const { data, error } = await supabase.from('FileAttachment')
            .insert({ filename: imageData.name, fileURL: imageData.url }).select().single()

        if (error) throw error

        return data
    }

    

    async function updatePost (attachmentID)  {

        const updatedPost = {
            categoryID: postForm.categoryID,
            title: postForm.title,
            description: postForm.description,
        }

        if (attachmentID) {
            updatedPost.attachmentID = attachmentID
        }

        const { data, error } = await supabase
            .from('BulletinPosts')
            .update(updatedPost)
            .eq('postID', param.postid)
            .select(`
                postID,
                categoryID,
                title,
                description,
                attachmentID,
                FileAttachment(fileURL)
            `)
            .single()

        if (error) throw error

        return data
    }

    async function handleSubmitAll() {
        setSaving(true)

        try {
            const attachment = await insertAttachment()
            const post = await updatePost(attachment?.attachmentID)

            setPostForm(post)
            setDone(true)
            setError(false)
            setErrorMessage("")
            console.log('Done!', { attachment, post })
            
        } catch (error) {
            console.log('Error: ', error)
            setError(true)
            setErrorMessage('Post could not be updated.')
        } finally {
            setSaving(false)
        }
    }

    if (loading || saving) return <Loading />

       
    return (
        <div className="bg-gray-100 min-h-screen">

            {/* this is the create post banner */}
            <div className="h-20 bg-primary-green text-white text-center font-bold text-2xl flex items-center justify-between">
                <nav className="w-20"><Link to={-1}><i className="fa-solid fa-arrow-left fa-xl p-5"></i></Link></nav>
                <h1>Edit Posts</h1>
                <div className="w-20"></div> {/* this is a placeholder div */}
            </div>

            {/* this is the middle box */}
            <form >
            <div className="bg-white shadow w-screen md:w-2/3 h-full justify-self-center flex p-8 flex-col justify-start gap-4 ">

                <div>
                    <img src={postForm?.FileAttachment?.fileURL} className="max-h-[30vw]" />
                </div>

                
                <div className="bg-primary-green rounded-lg w-fit">
                    <ImgBBUploadButton onUpload={ ({url, name}) => { setImageData({url, name}) } } />
                </div>

                <label htmlFor="userName">
                    <h2 className=" font-bold text-primary-green pb-2" >Updated Title</h2>
                    <input 
                    onChange={handleChange}
                    value={postForm.title}
                    type="text" name="title" className=" italic font-semibold outline-2 outline-gray-300 p-3 rounded-md placeholder:text-gray-400 w-full " placeholder="Title Name...."/>
                </label>

                <label htmlFor="postDesc">
                    <h2 className=" font-bold text-primary-green pb-2" >Updated Description</h2>
                    <textarea 
                    onChange={handleChange}
                    value={postForm.description}
                    name="description" className=" italic font-semibold resize-none border-2 border-gray-300 w-full p-3 h-50" placeholder="Insert Description Here......"></textarea>
                </label>

                <div className="text-primary-green italic font-semibold">
                    <h2 className="font-bold text-inherit pb-2 not-italic">Updated Category</h2>
                    <CategoryDropdown value={postForm.categoryID} onChange={handleChange} />
                </div>
                


                {/* this is the submit button */}
                <button
                onClick={(e)=>{e.preventDefault(); handleSubmitAll();} }
                className=" text-white bg-hover-green hover:bg-primary-green cursor-pointer rounded-xl h-12 mt-8 min-w-50 self-end-safe ">Finish Edit</button>

                {Done && <GoodBox message='Post Updated!!' onDismiss={()=>navigate(-1)} /> }
                {Error && <ErrorBox message={errorMessage} onDismiss={()=>setError(false)} /> }

            </div>
            </form>
            
        </div>
    )
}
