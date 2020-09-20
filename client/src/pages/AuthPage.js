import React, {useState, useEffect} from 'react'
import {useHttp} from '../hooks/http.hook'
import {useMessage} from '../hooks/message.hook'

export const AuthPage = () => {
	const message = useMessage()
	const {loading, error, request, clearErrors} = useHttp()
	const [form, setForm] = useState({email: '', password: ''})

	useEffect(() => {
		message(error)
		clearErrors()
	}, [error])

	const handleChange = event => {
		setForm({...form, [event.target.name]: event.target.value})
	}

	const handleRegister = async () => {
		try {
			const data = await request('/api/auth/register', 'POST', {...form})
			message(data.message)
		} catch (e) {

		}
	}

	const handleLogin = async () => {
		try {
			const data = await request('/api/auth/login', 'POST', {...form})
			message(data.message)
		} catch (e) {

		}
	}


	return (
		<div className="row">
			<div className="col s6 offset-s3">
				<h1>Shorten Your Link</h1>
				<div className="card green darken-3">
			        <div className="card-content white-text">
			          	<span className="card-title">Authorization</span>
			          	<div className="input-field">
				          	<input 
				          		placeholder="email" 
				          		id="email" 
				          		type="text" 
				          		name="email"
				          		className="input-white"
				          		onChange={handleChange}
				          	/>
				          	<label htmlFor="email"></label>
				       	</div>
				       	<div className="input-field">
				          	<input 
				          		placeholder="password" 
				          		id="password" 
				          		type="password"
				          		name="password" 
				          		className="input-white"				          		
				          		onChange={handleChange}

				          	/>
				          	<label htmlFor="password"></label>
				       	</div>
			        </div>
			        <div className="card-action">
			          <button 
			          	className="btn white black-text" 
			          	style={{marginRight: 10}}	
			          	onClick={handleLogin}	          	
			          	disabled={loading}
			          >	Log In
			          </button>
			          
			          <button 
			          	className="btn grey lighten-1 black-text"
			          	onClick={handleRegister}
			          	disabled={loading}
			          > Sign Up
			          </button>

			        </div>
			      </div>
			</div>
		</div>
	)
}