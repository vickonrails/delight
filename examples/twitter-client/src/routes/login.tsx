import { FormEvent, useState } from "react"
import { useNavigate } from "react-router-dom"

export const host = 'http://localhost:3000/api'

export const Login = () => {
    const [email, setEmail] = useState('victor2@gmail.com')
    const [password, setPassword] = useState('Password***')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (ev: FormEvent<HTMLFormElement>) => {
        ev.preventDefault()

        if (!email || !password) return

        setLoading(true)
        // TODO: error handling 
        try {
            const response = await fetch(`${host}/login`, {
                method: 'POST',
                mode: 'cors',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            })

            const { data } = await response.json()
            window.localStorage.setItem('user', JSON.stringify(data))
            navigate('/app')

        } catch (err) {
            // TODO: handle error
        }
    }

    return (
        <div className="bg-gray-700">
            <div className="flex items-center justify-center min-h-screen">
                <div className="bg-gray-800 p-8 rounded-lg w-full max-w-sm mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-white">Sign in to X</h2>
                        <button className="text-white text-2xl">×</button>
                    </div>
                    <div className="space-y-4">
                        <button className="flex items-center justify-center p-3 py-1.5 w-full bg-white rounded-full">
                            <img alt="Google logo" className="mr-2" src="https://placehold.co/24x24" width="24" height="24" />
                            Sign in as Victor
                        </button>
                        <button className="flex items-center justify-center p-3 py-1.5 w-full bg-white rounded-full">
                            <i className="fab fa-apple mr-2"></i>
                            Sign in with Apple
                        </button>
                        <div className="text-center text-white my-4">or</div>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <input
                                className="bg-gray-700 border-2 border-gray-600 rounded-lg p-3 w-full text-white focus:border-blue-600"
                                placeholder="Phone, email address, or username"
                                type="text"
                                value={email}
                                onChange={ev => setEmail(ev.target.value)}
                            />
                            <input
                                className="bg-gray-700 border-2 border-gray-600 rounded-lg p-3 w-full text-white focus:border-blue-600"
                                placeholder="Password"
                                type="password"
                                value={password}
                                onChange={ev => setPassword(ev.target.value)}
                            />
                            <button
                                disabled={loading}
                                className="flex items-center justify-center p-3 w-full bg-blue-600 rounded-lg text-white disabled:opacity-50 disabled:pointer-events-none"
                            >
                                Sign In
                            </button>
                        </form>
                        <a className="block text-center text-blue-600 hover:underline" href="#">Forgot password?</a>
                    </div>
                    <div className="text-center text-white mt-6">
                        Don’t have an account? <a className="text-blue-600 hover:underline" href="#">Sign up</a>
                    </div>
                </div>
            </div>
        </div>
    )
}
