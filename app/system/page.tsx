'use client'

import { ButtonHTMLAttributes, FocusEvent, useState } from "react"

export default function Page(){
    const[prohibited,setProhibited] = useState('')
    const[withdrawal,setWithdrawal] = useState('')
    const[query,setQuery] = useState('')
    const[layout,setLayout] = useState('')

    function checkTab(ev:any) {
    if(ev.currentTarget.innerText === 'ENTRADA DE PRODUTO') {
        setProhibited(ev.currentTarget.innerText)
        setWithdrawal('')
        setQuery('')
        setLayout('')
    }else if(ev.currentTarget.innerText === 'RETIRADA DE PRODUTO') {
        setProhibited('')
        setWithdrawal(ev.currentTarget.innerText)
        setQuery('')
        setLayout('')
    }else if(ev.currentTarget.innerText === 'CONSULTA DE PRODUTO') {
        setProhibited('')
        setWithdrawal('')
        setQuery(ev.currentTarget.innerText)
        setLayout('')
    }else if(ev.currentTarget.innerText === 'CONSULTAR LAYOUT DO ESTOQUE') {
        setProhibited('')
        setWithdrawal('')
        setQuery('')
        setLayout(ev.currentTarget.innerText)
    }
    }
    return(
        <>
        <div>
            <button onClick={(ev)=>checkTab(ev)}>ENTRADA DE PRODUTO</button>
            <button onClick={(ev)=>checkTab(ev)}>RETIRADA DE PRODUTO</button>
            <button onClick={(ev)=>checkTab(ev)}>CONSULTA DE PRODUTO</button>
            <button onClick={(ev)=>checkTab(ev)}>CONSULTAR LAYOUT DO ESTOQUE</button>
        </div>

        {prohibited!==''?(
        <div><h1>Entrada</h1></div>
        ):(
        <div><h1></h1></div>
        )}

        {withdrawal!==''?(
        <div><h1>Retirada</h1></div>
        ):(
        <div><h1></h1></div>
        )}

        {query!==''?(
        <div><h1>Consulta</h1></div>
        ):(
        <div><h1></h1></div>
        )}

        {layout!==''?(
        <div><h1>Consulta de layout</h1></div>
        ):(
        <div><h1></h1></div>
        )}
        </>
    )
}