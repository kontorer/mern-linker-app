import {useState, useCallback} from 'react'

// 1:50:00

export const useAuth = () => {
	const [token, setToken] = useState(null)
	const [userId, setUserId] = useState(null)


	const login = useCallback((jwtToken, id) => {
		setToken(jwtToken)
		setUserId(id)
	
	}, [])

	const logout = useCallback(() => {}, [])

	return {login, logout}
}