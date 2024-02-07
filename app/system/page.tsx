'use client'

import { FormEvent, useState } from "react"

export default function Page(){
    const[prohibited,setProhibited] = useState('s')
    const[withdrawal,setWithdrawal] = useState('')
    const[query,setQuery] = useState('')
    const[layout,setLayout] = useState('')

    async function registerProduct(ev:FormEvent) {
    ev.preventDefault()  
    }

    async function withdrawalProduct(ev:FormEvent) {
    ev.preventDefault()     
    }

    async function queryProduct(ev:FormEvent) {
    ev.preventDefault()    
    }


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
        <div>
            <form onSubmit={(ev)=>registerProduct(ev)}>
            <label htmlFor="">Nome Produto</label>
            <input type="text" />
            <label htmlFor="">Lote Produto</label>
            <input type="text" />
            <label htmlFor="">Data de Validade</label>
            <input type="date" />
            <label htmlFor="">Quantidade</label>
            <input type="number" name="" id="" />
            <button>REGISTRAR PRODUTO</button>
            </form>
        </div>
        ):(
        <div><h1></h1></div>
        )}

        {withdrawal!==''?(
        <div>
            <form onSubmit={(ev)=>withdrawalProduct(ev)}>
            <label htmlFor="">Lote do Produto</label>
            <input type="text" />
            <label htmlFor="">Quantidade do produto</label>
            <input type="number" />
            <label htmlFor="">Responsavel pela retirada</label>
            <input type="text" />
            <button>RETIRAR</button>
            </form>
        </div>
        ):(
        <div><h1></h1></div>
        )}

        {query!==''?(
        <div>
            <form onSubmit={(ev)=>queryProduct(ev)}>
                <label htmlFor="">Lote do produto</label>
                <input type="text" />
                <button>CONSULTAR</button>
            </form>
        </div>
        ):(
        <div><h1></h1></div>
        )}

        {layout!==''?(
        <div><h1>DESENHO DO ESTOQUE</h1></div>
        ):(
        <div><h1></h1></div>
        )}
        </>
    )
}