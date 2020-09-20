const {Router} = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {check, validationResult} = require('express-validator')
const User = require('../models/User')
const router = Router()
const config = require('config')


//api/auth/

router.post(
	'/register', 
	[
		check('email', 'Некорректный email').isEmail(),
		check('password', 'Пароль должен быть длиннее 6 символов').isLength({min: 6})
	],
	async (req, res) => {
		try {
			const errors = validationResult(req)

			if(!errors.isEmpty()) {
				return res.status(400).json({
					errors: errors.array(), 
					message: 'Некорректные даныне регистрации'
				})
			}
 
			const {email, password} = req.body

			const registrant = await User.findOne({ email })

			if (registrant) {
				return res.status(400).json({ message: 'Пользователь с таким email уже существует' })
			}

			const hashedPassword = await bcrypt.hash(password, 12)
			const user = new User({email, password: hashedPassword})

			await user.save()

			res.status(201).json({message: 'Пользователь успешно создан'})


		} catch (e) {
			res.status(500).json({ message: 'Что-то пошло не так...' })
		}
	}
)

router.post(
	'/login', 
	[
		check('email', 'Некорректный email').normalizeEmail().isEmail(),
		check('password', 'Введите пароль').exists()
	],
	async (req, res) => {
		try {
			const errors = validationResult(req)

			if(!errors.isEmpty()) {
				return res.status(400).json({
					errors: errors.array(), 
					message: 'Некорректные даныне авторизации'
				})
			}
 
			const {email, password} = req.body

			const user = await User.findOne({ email })

			if (!user) {
				return res.status(400).json({ message: 'Пользователь с таким email не найден' })
			}

			const isMatch = await bcrypt.compare(password, user.password)

			if (!isMatch) {
				return res.status(400).json({message: 'Неверный пароль'})
			}

			const token = jwt.sign(
				{ userId: user.id },
				{ config.get('jwtSecret') },
				{ expiresIn: '1h' }
			)

			res.json({ token, userId: user.id })


		} catch (e) {
			res.status(500).json({ message: 'Что-то пошло не так...' })
		}

})


module.exports = router