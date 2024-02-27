'use client'

import Image from "next/image";
import styles from "./page.module.scss";
import logoBrand from '@/public/logo.svg'
import { FormEvent, useState } from "react";
import { User } from "./types/types";
import bg from '@/public/kevin-mccutcheon-APDMfLHZiRA-unsplash.jpg'

export default function Home() {
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')


  async function loginInSystem(ev:FormEvent){
    ev.preventDefault()
    const getDB = await fetch('http://localhost:3333/users')
    const conversedUser:User[] = await getDB.json()
    const searchEmail = conversedUser.filter(user=>(user.email === email))
    const searchPassword = searchEmail.filter(user=>(user.password === password))
    if(searchEmail.length>0 && searchPassword.length>0){
    localStorage.setItem('Usuario Logado',JSON.stringify({email,name:searchPassword[0].name}))
    setTimeout(() => {
      window.location.href = '/system'
    }, 1000);
    }else{
    alert('Usuario não encontrado')
    }
  
  }
  return (
    <>
    <main className={styles.main}>
    <div>
    <Image
    width={800}
    height={800}
    src={bg}
    alt="BG"
    />
    </div>
    <form onSubmit={(ev)=>loginInSystem(ev)}>
      <label htmlFor="email">Email</label>
      <input 
      type="text" 
      name="email" 
      id="email"
      value={email}
      onChange={(ev)=>setEmail(ev.currentTarget.value)}
      />
      <label htmlFor="password">Senha</label>
      <input 
      type="password" 
      name="password" 
      id="password"
      value={password}
      onChange={(ev)=>setPassword(ev.currentTarget.value)}
      />
      <button>LOGIN</button>
    </form>
    </main>
    </>
  );
}
