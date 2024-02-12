'use client'
import { FormEvent, useState } from "react";

export default function Page(){
const [name,setName] = useState('')
const [email,setEmail] = useState('')
const [password,setPassword] = useState('')
const [confirmPassword,setConfirmPassword] = useState('')
    async function createUser(ev:FormEvent) {
    ev.preventDefault()    
    if(name==='' || email === '' || password==='' || confirmPassword===''){
        alert('Preencha todos os campos')
    }else if(confirmPassword!==password){
        alert('Senhas não conferem')
    }else{
        const createUser = await fetch(`http://localhost:3333/user`,{
            method:'POST',
            body:JSON.stringify(
                {
                    name,email,password
                }
            ),
            headers:{
                "Content-Type" : "application/json"
            }
        })
        alert('Usuario cadastrado com sucesso')
    }
    }
    return(
        <>
        <form onSubmit={(ev)=>createUser(ev)}>
        <label htmlFor="">Nome</label>
        <input 
        type="text"
        value={name}
        onChange={(ev)=>setName(ev.currentTarget.value)}
        />
        <label htmlFor="">Email</label>
        <input 
        type="text"
        value={email}
        onChange={(ev)=>setEmail(ev.currentTarget.value)}
        />
        <label htmlFor="">Senha</label>
        <input 
        type="password"
        value={password}
        onChange={(ev)=>setPassword(ev.currentTarget.value)}
        />
        <label htmlFor="">Confirmar Senha</label>
        <input 
        type="password"
        value={confirmPassword}
        onChange={(ev)=>setConfirmPassword(ev.currentTarget.value)}
        />
        <button>REGISTRAR</button>
        </form>
        </>
    )
}