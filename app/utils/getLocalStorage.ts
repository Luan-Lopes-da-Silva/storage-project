import { User } from "../types/types"

export default function GetLocalUser():User{
    const localUser = localStorage.getItem('Usuario Logado')

    if(localUser){
    const parseLocal = JSON.parse(localUser)
    return parseLocal
    }else{
    const undefinedUser:User={
        email: 'undefined',
        password:'undefined'
    }   
    return undefinedUser 
    }
}