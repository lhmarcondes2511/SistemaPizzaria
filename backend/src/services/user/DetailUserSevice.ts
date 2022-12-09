import prismaClient from "../../prisma";

class DetailUserService{
    async execute(user_id: string){
        
        const userDetail = await prismaClient.user.findFirst({
            where: {
                id: user_id
            },
            select: {
                id: true,
                name: true,
                email: true
            }
        })

        if(!userDetail){
            throw new Error('Erro ao receber o usuário')
        }

        return userDetail
    }
}

export { DetailUserService }