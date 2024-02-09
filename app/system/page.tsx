'use client'

import { FormEvent, useRef, useState } from "react"
import GetLocalUser from "../utils/getLocalStorage"
import { Product } from "../types/types"
import style from '@/app/styles/systemPage.module.scss'

export default function Page(){
    const mainRef = useRef<HTMLBodyElement>(null)
    const[prohibited,setProhibited] = useState('s')
    const[withdrawal,setWithdrawal] = useState('')
    const[query,setQuery] = useState('')
    const[layout,setLayout] = useState('')

    const [productName,setProductName] = useState('')
    const [productBatch,setProductBatch] = useState('')
    const [expireDate,setExpireDate] = useState('')
    const [quantity,setQuantity] = useState('')


    const [searchBatch,setSearchBatch] = useState('')
    
    const warningMessage = useRef<HTMLHeadingElement>(null)
    const nameProduct = useRef<HTMLHeadingElement>(null)
    const batchProduct = useRef<HTMLParagraphElement>(null)
    const dateProduct = useRef<HTMLParagraphElement>(null)
    const quantityProduct = useRef<HTMLParagraphElement>(null)

    async function registerProduct(ev:FormEvent) {
    ev.preventDefault()
    const getUser = GetLocalUser()
    const createProduct = await fetch(`http://localhost:3333/product`,{
        method:'POST',
        body:JSON.stringify(
            {name:productName,quantity,expireDate,batch:productBatch,employee:getUser.email}
        ),
        headers:{
            "Content-Type" : "application/json"
        }
    })
    if(createProduct.status === 201){
        alert('Produto criado com sucesso')
        setProductName('')
        setProductBatch('')
        setExpireDate('')
        setQuantity('')
    }else{
        alert('Erro na criação do produto')
    }  
    }

    async function withdrawalProduct(ev:FormEvent) {
    ev.preventDefault()     
    }

    async function queryProduct(ev:FormEvent) {
    ev.preventDefault()   
    const getProduct = await fetch('http://localhost:3333/products')
    const converseProducts:Product[] = await getProduct.json()
    const searchProduct = converseProducts.filter(product=>(product.batch === searchBatch))
    if(searchProduct.length>0){
        if(nameProduct.current && batchProduct.current && dateProduct.current && quantityProduct.current && warningMessage.current){
            warningMessage.current.innerText  = ''
            nameProduct.current.innerText = `Nome do produto : ${searchProduct[0].name}`
            batchProduct.current.innerText = `Lote do produto : ${searchProduct[0].batch}`
            dateProduct.current.innerText = `Prazo de validade : ${searchProduct[0].expireDate}`
            quantityProduct.current.innerText = `Qauntidade de produto : ${searchProduct[0].quantity}`
        }
    }else{
       if(warningMessage.current){
        warningMessage.current.innerText  = 'Nenhum produto foi encontrado'
       }
    }
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
        <main className={style.main}>
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
            <input 
            type="text" 
            value={productName}
            onChange={(ev)=>setProductName(ev.currentTarget.value)}
            />
            <label htmlFor="">Lote Produto</label>
            <input 
            type="text"
            value={productBatch}
            onChange={(ev)=>setProductBatch(ev.currentTarget.value)}
            />
            <label htmlFor="">Data de Validade</label>
            <input 
            type="date" 
            value={expireDate}
            onChange={(ev)=>setExpireDate(ev.currentTarget.value)}
            />
            <label htmlFor="">Quantidade</label>
            <input 
            type="number" 
            name="" 
            id="" 
            value={quantity}
            onChange={(ev)=>setQuantity(ev.currentTarget.value)}
            />
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
                <input 
                type="text"
                value={searchBatch}
                onChange={(ev)=>setSearchBatch(ev.currentTarget.value)}
                />
                <button>CONSULTAR</button>
            </form>

            <main ref={mainRef}>
            <article>
            <h1 ref={warningMessage}></h1>
            <h4 ref={nameProduct}></h4>
            <p ref={dateProduct}></p>
            <p ref={batchProduct}></p>
            <p ref={quantityProduct}></p>
            <span></span>
            </article>

        </main>
        </div>
        ):(
        <div><h1></h1></div>
        )}

        {layout!==''?(
        <div><h1>DESENHO DO ESTOQUE</h1></div>
        ):(
        <div><h1></h1></div>
        )}

      
        </main>
    )
}