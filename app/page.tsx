'use client'

import Image from "next/image";
import styles from "./page.module.scss";
import logoBrand from '@/public/logo.svg'
import { FormEvent, useState } from "react";

export default function Home() {
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')


  async function loginInSystem(ev:FormEvent){
    ev.preventDefault()
    if(email!=='' && password!==''){
      localStorage.setItem('Usuario Logado',JSON.stringify({email,password}))
      setTimeout(() => {
        window.location.href = '/system'
      }, 2000);
    }else{
      alert('Preencha todos os campos')
    }
  }
  return (
    <>
    <main className={styles.main}>
    <Image
    width={400}
    height={400}
    src={logoBrand}
    alt="Logo brand"
    />
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
