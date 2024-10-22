import { User } from "@prisma/client";
import db from "@repo/db/client"

export function getAlldata(userid :string){
    try{
        const user = db.user.findFirst({
            where:{
                id:userid
            }
        })
        return user
    }catch(e){
        return null
    }
}

export function getCreditsInfo(userid :string){
    try{
        const creditsinfo = db.credits.findFirst({
            where:{
                userId:userid
            }
        })
        return creditsinfo
    }catch(e){
        return null
    }
}

export function getInterviweInfo(id:string){
    try{
        const info = db.interview.findFirst({
            where:{
                id
            }
        })
        return info
    }catch(e){
        return null
    }
}