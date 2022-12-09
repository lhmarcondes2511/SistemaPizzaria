import prismaClient from "../../prisma"
import { compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'

interface AuthRequest{
    email: string,
    password: string
}

class AuthUserService {
    async execute({ email, password}: AuthRequest){
        //verificar se o email existe
        const user = await prismaClient.user.findFirst({
            where: {
                email: email
            }
        })

        if(!user){
            // throw new Error('Email/Senha incorreto')
            return ({ error: 'Email/Senha incorreto'})
        }

        //verificar se a senha está correta
        const passwordMatch = await compare(password, user.password)

        if(!passwordMatch){
            // throw new Error('Email já existente')
            return ({ error: 'Email/Senha incorreto'})
        }

        //gerar token de email e senha em jwt
        const token = sign(
            {
                name: user.name,
                email: user.email
            },
            process.env.JWT_SECRET,
            {
                subject: user.id,
                expiresIn: '30d'
            }
        )

        return { 
            id: user.id,
            name: user.name,
            email: user.email,
            token: token
         }
    }
}

export { AuthUserService }