import { useState } from "react"
import axios from 'axios'
const Login = () => {
    const [formData, setFormData] = useState({});
     
    const handleChange = (e) => {
        setFormData({...formData, [e.target.id]:e.target.value
       })
    }

    console.log(formData);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            await axios.post('http://localhost:8080/api/register', JSON.stringify({formData}), 
            {
                headers: {'Content-Type':'application/json'},
                Withcredentials:true
            }
        )
        } catch(error) {
            console.log(error)
        }
    }

  return (
    <div className="p-3 max-w-lg mx-auto">
        <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input type="text" placeholder="username" 
            className="rounded-lg border p-3" id="username" onChange={handleChange}/>
            <input type="password" placeholder="username" 
            className="rounded-lg border p-3" id="password" onChange={handleChange}/>
            <button className="bg-slate-700 text-white">Sign Up</button>
        </form>
    </div>
  )
}

export default Login