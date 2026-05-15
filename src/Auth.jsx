// import * as supa from './supabaseDB.jsx'

import { supabase } from "./non-page-components/supabaseDB";
import { useState, useEffect } from "react"
import { Link, Links, useNavigate } from "react-router-dom";

import favicon from './assets/test.png'
import {ErrorBox, GoodBox} from './non-page-components/DisplayBox'
import Loading from "./non-page-components/Loading";


export default function Auth() {

    document.title = 'Auth'

    const [user , setUser] = useState({})
    const navigate = useNavigate()

    const [loginData, setLoginData] = useState({ email: '', password: '' })
    const [registerData, setRegisterData] = useState({ name: '', email: '', password: '', role: null, userPass: '' })

    const [error, setError] = useState(false)
    const [success, setSuccess] = useState(false)
    const [loading, setloading] = useState(false)

    const [errorMsg, setErrorMsg] = useState(null)
    const [mode, setMode] = useState('login')

    
    // THIS IS NOT USED BECAUSE NO ANON LOGIN VISIBLE
    async function AnonLogin() {
        const { data, error } = await supabase.auth.signInAnonymously()
        if (error) {console.log('Error: ',error)}
        else {
            navigate('dashboard')
        }
    }


    async function handleLogin() {
        setErrorMsg(null)
        setloading(true)
        

        const { data, error } = await supabase.auth.signInWithPassword({
            email: loginData.email,
            password: loginData.password
        })

        error ? (setloading(false),setErrorMsg(error.message)) : navigate('/dashboard')

        
    }

    async function handleRegister() {

        if (!registerData.email && !registerData.password && !registerData.role && !registerData.name) 
        {
            setErrorMsg('Please Complete The Form')
        }
    
        else {

        
        const { data, error } = await supabase.auth.signUp({
            email: registerData.email,
            password: registerData.password,
            options: {
                data: {
                    userName: registerData.name,
                    userRole: registerData.role,
                    userPass: registerData.userPass
                }}
        })

        console.log('data:', data)
        console.log('error:', error?.message)  

        error ? (setErrorMsg(error.message)) : (console.log('Register Successful!'), setSuccess(true) );
        }

        
    }    
    

    if (loading) return <Loading />

    return (
        <div className="bg-gray-100 min-h-screen">
            <header className="bg-white shadow flex h-20 items-center pl-[20%]">
                {/* icon and horn */}
                <div className="bg-primary-green aspect-square h-3/5 rounded-md items-center flex justify-center">
                    <i className="fa-solid fa-bullhorn invert fa-xl"></i>
                </div>
                <div className="ml-4">
                    <h1 className="text-xl font-bold text-primary-blue">NewsNow PKU</h1>
                    <h2 className="text-sm text-[#7B8794]">Universiti Malaysia Pahang Sultan Abdullah</h2>
                </div>
            </header>


            {/* this is the middle block */}
            <div className="bg-white shadow w-full md:w-2/3 lg:w-1/3 h-full md:h-4/5 mt-8 justify-self-center rounded-xl">


                {/* login n register button */}
                <div className="w-full  text-gray-400 rounded-t-xl bg-hover-blue font-bold box-border">

                    {/* old login register button */}
                    {/* <button autoFocus onClick={()=>setMode('login')}    className=" cursor-pointer w-1/2 p-5 focus:outline-none focus:inset-shadow-[0_-3px_0_0_#ffc72c] focus:text-white hover:bg-hover-blue rounded-tl-xl focus:bg-hover-blue  ">Login</button>
                    <button onClick={()=>setMode('register')}           className=" cursor-pointer w-1/2 p-5 focus:outline-none focus:inset-shadow-[0_-3px_0_0_#ffc72c] focus:text-white hover:bg-hover-blue rounded-tr-xl focus:bg-hover-blue ">Register</button> */}

                    {/* new login and register button */}
                    <div className="flex w-full">
                        <label className={`cursor-pointer w-1/2 p-5 text-center rounded-tl-xl transition-colors
                            ${mode === 'login' 
                            ? 'inset-shadow-[0_-3px_0_0_#ffc72c] text-white bg-primary-blue' 
                            : 'hover:bg-hover-blue'}`}>
                            <input
                            type="radio"
                            name="authMode"
                            value="login"
                            checked={mode === 'login'}
                            onChange={() => setMode('login')}
                            className="sr-only"
                            />
                            Login
                        </label>
                        <label className={`cursor-pointer w-1/2 p-5 text-center rounded-tr-xl transition-colors
                            ${mode === 'register' 
                            ? 'inset-shadow-[0_-3px_0_0_#ffc72c] text-white bg-primary-blue' 
                            : 'hover:bg-hover-blue'}`}>
                            <input
                            type="radio"
                            name="authMode"
                            value="register"
                            checked={mode === 'register'}
                            onChange={() => setMode('register')}
                            className="sr-only"
                            />
                            Register
                        </label>
                    </div>

                </div>


                {/* this the login page */}
                {mode === 'login' && (
                    
                <form action={handleLogin}>
                    <div id="login" className="flex p-8 flex-col justify-start gap-5 h-4/5 animate-ease ">
                        <label htmlFor="userEmail">
                            <h2 className=" font-bold text-black pb-2" >Email:</h2>
                            <input 
                            onChange={(e)=> setLoginData({...loginData, email: e.target.value})}
                            type="email" id="userEmail" className=" outline-2 outline-gray-300 p-3 rounded-md placeholder:text-gray-400 w-full " placeholder="student@adab.umpsa.edu.my"/>
                        </label>

                        <label htmlFor="userPassword">
                            <h2 className=" font-bold text-black pb-2" >Password:</h2>
                            <input 
                            onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                            type="password" id="userPassword" className=" outline-2 outline-gray-300 p-3 rounded-md placeholder:text-gray-400 w-full " placeholder="**********"/>
                        </label>


                        <div className="flex flex-col md:flex-row ">

                            {/* this is the remember me function */}
                            {/* <label className="h-full mb-3" htmlFor="rememberMe">
                                <input type="checkbox" id="rememberME" className="peer-checked:bg-primary-blue scale-[1.5] " />
                                <p className=" text-[14px] pl-2 inline self-start text-center justify-self-start h-full"> Remember Me</p>
                            </label> */}


                            <button className=" self-start text-[#00A79D] text-[14px] ml-0 md:ml-auto cursor-pointer line-through ">Forgot Password?</button>
                        </div>

                        {/* {errorMsg && <ErrorBox message={errorMsg} onDismiss={()=>{setErrorMsg(null)}} />} */}


                        {/* this is the submit button */}
                        <button onClick={handleLogin} className=" mt-3 text-white bg-hover-green hover:bg-primary-green cursor-pointer w-full rounded-xl h-12" type="button">Login</button>
                    </div>


                    {/* THIS IS ANONYMOUS LOGIN */}
                    {/* <div className="text-center text-gray-400 pt-5 pb-5">
                        <p onClick={AnonLogin} className="cursor-pointer inline hover:underline hover:text-gray-600">Continue as Guest</p>
                    </div> */}


                </form>
                    
                )}


                {/* this the register page */}
                {mode === 'register' && (

                <form action={handleRegister}>
                    <div id="register" className="flex p-8 flex-col justify-start gap-3 animate-ease ">
                        <label htmlFor="userName" required>
                            <h2 className=" font-bold text-black pb-2" >Name:</h2>
                            <input required
                            onChange={(e)=> setRegisterData({...registerData, name: e.target.value.toUpperCase()})}
                            type="text" id="userName" className=" outline-2 outline-gray-300 p-3 rounded-md placeholder:text-gray-400 w-full " placeholder="Name...."/>
                        </label>


                        <label htmlFor="userEmail">
                            <h2 className=" font-bold text-black pb-2" >Email:</h2>
                            <input 
                            onChange={(e)=> setRegisterData({...registerData, email: e.target.value})}
                            type="email" id="userEmail" className=" outline-2 outline-gray-300 p-3 rounded-md placeholder:text-gray-400 w-full " placeholder="student@adab.umpsa.edu.my"/>
                        </label>

                        <label htmlFor="userPassword">
                            <h2 className=" font-bold text-black pb-2" >Password:</h2>
                            <input 
                            onChange={(e) => setRegisterData({...registerData, userPass: e.target.value, password: e.target.value})}
                            type="password" id="userPass" className=" outline-2 outline-gray-300 p-3 rounded-md placeholder:text-gray-400 w-full " placeholder="**********"/>
                        </label>


                        <label htmlFor="userRole">
                            <h2 className="font-bold text-black pb-2">I'm a</h2>

                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-md outline-2 outline-gray-300 has-checked:outline-primary-blue has-checked:bg-blue-50 ">
                                    <input
                                        onChange={(e) => setRegisterData({...registerData, role: e.target.value})}
                                        type="radio"
                                        name="userRole"
                                        value="STUDENT"
                                        className="accent-primary-blue"
                                    />
                                    <p>Student</p>
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-md outline-2 outline-gray-300 has-checked:outline-primary-blue has-checked:bg-blue-50">
                                    <input
                                        onChange={(e) => setRegisterData({...registerData, role: e.target.value})}
                                        type="radio"
                                        name="userRole"
                                        value="STAFF"
                                        className="accent-primary-blue"
                                    />
                                    <p>Staff</p>
                                </label>
                            </div>
                        </label>

                        {/* this is the submit button */}
                        <input onClick={handleRegister} className=" text-white bg-hover-green hover:bg-primary-green cursor-pointer rounded-xl h-12 mt-6 " type="button" value="Register" />
                        {/* <button onClick={handleRegister} className=" text-white bg-hover-green hover:bg-primary-green cursor-pointer rounded-xl h-12 mt-6 ">Register</button> */}

                        {/* {errorMsg && <ErrorBox message={errorMsg} onDismiss={()=>setErrorMsg(null)} />} */}

                        {success && <GoodBox message='Registration Successful !!' onDismiss={()=>{setSuccess(false), setMode('login')}} />}
                        

                    </div>
                </form>
                
                    
                )}


                {errorMsg && <ErrorBox message={errorMsg} onDismiss={()=>{setErrorMsg(null)}} />}

                
            </div>

            


        </div>
    )
}