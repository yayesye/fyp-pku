import { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom";
import { supabase } from "./non-page-components/supabaseDB"
import ImgBBUploadButton from "./non-page-components/ImgBBUploadButton"
import CategoryDropdown from "./non-page-components/CategoryDropdown";
import { GoodBox } from "./non-page-components/DisplayBox";

export default function EditPosts() {


    const [imageData, setImageData] = useState({})
    const date = new Date().toISOString().slice(0, 10);
    const time = new Date().toLocaleTimeString('en-GB', { hour12: false });

    const [Error, setError] = useState(false)
    const [Done, setDone] = useState(false)

    const param = useParams()
    

    const [postForm, setPostForm] = useState({
        categoryID: 1,
        title: '',
        description: '',
        publishDate: date,
        publishTime: time,
        status: 'ACTIVE'
    })      



    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target; // 'name' not 'title'
        setPostForm((prev) => ({
            ...prev,
            [name]  : type === 'checkbox' ? checked
                    : type === 'file'     ? files[0]
                    : value,
        }));
    };

    useEffect(()=>{
        async function fetchPosts() {
            const {data, error} = await supabase.from('BulletinPosts').select('*').eq('postID',param.postid).single()

            if (error) console.log('Error: ',error)

                
            console.log(data)
        }
    },[])


    // removed the useEffect entirely, sbb only for fetch data
    async function insertAttachment ()  {
        const { data, error } = await supabase.from('FileAttachment')
            .insert({ filename: imageData.name, fileURL: imageData.url }).select().single()

        setImageData(data)
    }

    

    async function insertPost (attachmentID)  {

        const userid = (await supabase.auth.getUser()).data.user.id
        console.log(userid)

        console.log(attachmentID)
        const { data, error } = await supabase
            .from('BulletinPosts')
            .insert({ ...postForm, userID: userid, attachmentID: attachmentID }) 
            .select()


        if (error) throw error

        return data
    }

    async function handleSubmitAll() {
        try {
            // const { data: { user } } = await supabase.auth.getUser()
            const attachment = await insertAttachment()
            const post = await insertPost(attachment.attachmentID)

            console.log('Done!', { attachment, post })
            return <GoodBox />
            
        } catch (error) {
            
        }
    }

       
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

            {console.log(param.postid)}
                

                
                <div className="bg-primary-green rounded-lg w-fit">
                    <ImgBBUploadButton onUpload={ ({url, name}) => { setImageData({url, name}) } } />
                </div>

                <label htmlFor="userName">
                    <h2 className=" font-bold text-primary-green pb-2" >Title</h2>
                    <input 
                    onChange={handleChange}
                    value={postForm.title}
                    type="text" name="title" className=" outline-2 outline-gray-300 p-3 rounded-md placeholder:text-gray-400 w-full  " placeholder="Title Name...."/>
                </label>

                <label htmlFor="postDesc">
                    <h2 className=" font-bold text-primary-green pb-2" >Description</h2>
                    <textarea 
                    onChange={handleChange}
                    value={postForm.description}
                    name="description" className=" resize-none border-2 border-gray-300 w-full p-3 h-50" placeholder="Insert Description Here......"></textarea>
                </label>

                <div className="text-primary-green">
                    <CategoryDropdown value={postForm.categoryID} onChange={handleChange} />
                </div>
                


                {/* this is the submit button */}
                <button
                onClick={handleSubmitAll}
                className=" text-white bg-hover-green hover:bg-primary-green cursor-pointer rounded-xl h-12 mt-8 min-w-50 self-end-safe ">Create</button>

            </div>
            </form>
            
        </div>
    )
}