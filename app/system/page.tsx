'use client'

import { FormEvent, useRef, useState } from "react"
import GetLocalUser from "../utils/getLocalStorage"
import { Product, Withdraws } from "../types/types"
import style from '@/app/styles/systemPage.module.scss'
import Image from "next/image"
import logo from '@/public/logo.svg'
import menuIcon from '@/public/menu.svg'
import profile from '@/public/account_circle_FILL0_wght400_GRAD0_opsz24 1.svg'

export default function Page(){
    const mainRef = useRef<HTMLBodyElement>(null)
    const tableRef = useRef<HTMLTableElement>(null)
    const[prohibited,setProhibited] = useState('s')
    const[withdrawal,setWithdrawal] = useState('')
    const[query,setQuery] = useState('')
    const[layout,setLayout] = useState('')

    const [productName,setProductName] = useState('')
    const [expireDate,setExpireDate] = useState('')
    const [quantity,setQuantity] = useState('')


    const [batchWithdraw,setBatchWithdraw] = useState('')
    const [quantityWithdraw,setQuantityWithdraw] = useState(0)
    const [employeeWithdraw,setEmployeeWithdraw] = useState('')

    const [searchBatch,setSearchBatch] = useState('')

    const [dateOrBatch,setDateOrBatch] = useState('')
    
    const warningMessage = useRef<HTMLHeadingElement>(null)
    const nameProduct = useRef<HTMLHeadingElement>(null)
    const batchProduct = useRef<HTMLParagraphElement>(null)
    const dateProduct = useRef<HTMLParagraphElement>(null)
    const quantityProduct = useRef<HTMLParagraphElement>(null)

    function generateAleatoryBatch(){
        const hexCharacter = '0123456789ABCDEFGHIJKLMNOPRSTUVWXYZ'
        let aleatoryHex = ''
      
        for (let i = 0; i<8; i++){
          const aleatoryIndex = Math.floor(Math.random()* hexCharacter.length)
          aleatoryHex += hexCharacter.charAt(aleatoryIndex)
        }
        return aleatoryHex
      }
    

    async function registerProduct(ev:FormEvent) {
    ev.preventDefault()
    const getUser = GetLocalUser()
    const aleatoryBatch = generateAleatoryBatch()
    const createProduct = await fetch(`http://localhost:3333/product`,{
        method:'POST',
        body:JSON.stringify(
            {name:productName,quantity,expireDate,batch:aleatoryBatch,employee:getUser.email}
        ),
        headers:{
            "Content-Type" : "application/json"
        }
    })
    if(createProduct.status === 201){
        alert('Produto criado com sucesso')
        setProductName('')
        setExpireDate('')
        setQuantity('')
    }else{
        alert('Erro na criação do produto')
    }  
    }

    async function withdrawProduct(ev:FormEvent) {
    ev.preventDefault()     
    const getUser = GetLocalUser()
    const dateNow = new Date()
    const getProduct = await fetch(`http://localhost:3333/product/${batchWithdraw}`)
    const conversedProduct:Product = await getProduct.json()
    const day = dateNow.getDate()
    let month = dateNow.getMonth()
    month = month+1
    const year = dateNow.getFullYear()
    const formatedDay = day.toString().padStart(2,'0')
    const formatedMonth = month.toString().padStart(2,'0')
    const formatedDate = formatedDay + '/' + formatedMonth + '/' + year
    const hour = dateNow.getHours()
    const minutes = dateNow.getMinutes()
    const formatedHour = hour.toString().padStart(2,'0')
    const formartedMinutes = minutes.toString().padStart(2,'0')
    const formatedFullHour = formatedHour + ':' + formartedMinutes

    if(Number(conversedProduct.quantity)===0){
    alert('Produtos desse lote acabaram!!')
    }else if(quantityWithdraw>Number(conversedProduct.quantity)){
    alert('Quantidade maior do que o disponivel no estoque!!')
    setQuantityWithdraw(Number(conversedProduct.quantity))
    }else{
        const withdrawProduct = await fetch(`http://localhost:3333/product/${batchWithdraw}`,{
            method:'PUT',
            body:JSON.stringify(
                {quantity:Number(conversedProduct.quantity) - quantityWithdraw}
            ),
            headers:{
                "Content-Type" : "application/json"
            }
        })
        if(withdrawProduct.status === 200){
            alert('Produto atualizado com sucesso')
            setProductName('')
            setExpireDate('')
            setQuantity('')
        }else{
            alert('Erro na atualização do produto')
        }  
    
        const withdrawDb = await fetch(`http://localhost:3333/withdraw`,{
            method:'POST',
            body:JSON.stringify(
                {employee:employeeWithdraw,responsible:getUser.name,productName:conversedProduct.name,date:formatedDate,quantity:quantityWithdraw,hour:formatedFullHour,batch:batchWithdraw}
            ),
            headers:{
                "Content-Type" : "application/json"
            }
        })
    }
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
    if(ev.currentTarget.innerText === 'CADASTRO DE PRODUTOS') {
        setProhibited(ev.currentTarget.innerText)
        setWithdrawal('')
        setQuery('')
        setLayout('')
    }else if(ev.currentTarget.innerText === 'RETIRADA DE PRODUTOS') {
        setProhibited('')
        setWithdrawal(ev.currentTarget.innerText)
        setQuery('')
        setLayout('')
    }else if(ev.currentTarget.innerText === 'CONSULTA DE PRODUTOS') {
        setProhibited('')
        setWithdrawal('')
        setQuery(ev.currentTarget.innerText)
        setLayout('')
    }else if(ev.currentTarget.innerText === 'CONSULTAR RETIRADAS') {
        setProhibited('')
        setWithdrawal('')
        setQuery('')
        setLayout(ev.currentTarget.innerText)
    }
    }

    async function checkWithdraws(ev:FormEvent) {
    ev.preventDefault()
    const withdrawsDb = await fetch('http://localhost:3333/withdraws')
    const conversedDb:Withdraws[] = await withdrawsDb.json()
    if(dateOrBatch.match(/\d{2}\/\d{1,}\/\d{4}/g)){
        const filterForData = conversedDb.filter(withdraw=>(withdraw.date === dateOrBatch)) 
        for(let i=0; i<filterForData.length;i++){
        const rowRef = document.createElement('tr') 
        const tdName = document.createElement('td')
        tdName.innerText = filterForData[i].productName
        const tdBatch = document.createElement('td')
        tdBatch.innerText = filterForData[i].batch
        const tdQuantity = document.createElement('td')
        tdQuantity.innerText = filterForData[i].quantity
        const tdStockEmployee = document.createElement('td')
        tdStockEmployee.innerText = filterForData[i].responsible
        const tdEmployee = document.createElement('td')
        tdEmployee.innerText = filterForData[i].employee
        const tdDate = document.createElement('td')
        tdDate.innerText = filterForData[i].date
        const tdHour = document.createElement('td')
        tdHour.innerText = filterForData[i].hour

        rowRef.append(tdName,tdBatch,tdQuantity,tdStockEmployee,tdEmployee,tdDate,tdHour)

        if(tableRef.current){
            tableRef.current.appendChild(rowRef)
        }
    }
    }else{
        const filterForBatch = conversedDb.filter(withdraw=>(withdraw.batch === dateOrBatch))    
        for(let i=0; i<filterForBatch.length;i++){
            const rowRef = document.createElement('tr') 
            const tdName = document.createElement('td')
            tdName.innerText = filterForBatch[i].productName
            const tdBatch = document.createElement('td')
            tdBatch.innerText = filterForBatch[i].batch
            const tdQuantity = document.createElement('td')
            tdQuantity.innerText = filterForBatch[i].quantity
            const tdStockEmployee = document.createElement('td')
            tdStockEmployee.innerText = filterForBatch[i].responsible
            const tdEmployee = document.createElement('td')
            tdEmployee.innerText = filterForBatch[i].employee
            const tdDate = document.createElement('td')
            tdDate.innerText = filterForBatch[i].date
            const tdHour = document.createElement('td')
            tdHour.innerText = filterForBatch[i].hour
    
            rowRef.append(tdName,tdBatch,tdQuantity,tdStockEmployee,tdEmployee,tdDate,tdHour)
    
            if(tableRef.current){
                tableRef.current.appendChild(rowRef)
            }
        }  
    }
    }

    return(
        <>
        <header className={style.header}>
            <nav>
                <Image
                width={100}
                height={100}
                alt="logo"
                src={logo}
                />

                <div>
                <Image
                width={50}
                height={50}
                alt="profile"
                src={profile}
                />
                <Image
                width={50}
                height={50}
                alt="menu"
                src={menuIcon}
                />
                </div>
            </nav>
        </header>
        <main className={style.main}>
        <div className={style.tabs}>
            <button onClick={(ev)=>checkTab(ev)}>CADASTRO DE PRODUTOS</button>
            <button onClick={(ev)=>checkTab(ev)}>RETIRADA DE PRODUTOS</button>
            <button onClick={(ev)=>checkTab(ev)}>CONSULTA DE PRODUTOS</button>
            <button onClick={(ev)=>checkTab(ev)}>CONSULTAR RETIRADAS</button>
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
            <label htmlFor="">Data de Validade</label>
            <input 
            type="text" 
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
            <form onSubmit={(ev)=>withdrawProduct(ev)}>
            <label htmlFor="">Lote do Produto</label>
            <input 
            type="text"
            value={batchWithdraw}
            onChange={(ev)=>setBatchWithdraw(ev.currentTarget.value)}
            />
            <label htmlFor="">Quantidade do produto</label>
            <input 
            type="number"
            value={quantityWithdraw}
            onChange={(ev)=>setQuantityWithdraw(Number(ev.currentTarget.value))}
            />
            <label htmlFor="">Responsavel pela retirada</label>
            <input 
            type="text"
            value={employeeWithdraw}
            onChange={(ev)=>setEmployeeWithdraw(ev.currentTarget.value)}
            />
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
        <div>
            <form onSubmit={(ev)=>checkWithdraws(ev)}>
                <label htmlFor="">Lote do produto ou data de retirada</label>
                <input 
                type="text" 
                value={dateOrBatch}
                onChange={(ev)=>setDateOrBatch(ev.currentTarget.value)}
                />
                <button>PESQUISAR</button>
            </form>
            <table ref={tableRef}>
                <tr>
                    <td>Nome do Produto</td>
                    <td>Lote do Produto</td>
                    <td>Funcionario do estoque</td>
                    <td>Solicitante</td>
                    <td>Data do pedido</td>
                    <td>Horario do pedido</td>
                </tr>
            </table>
        </div>
        ):(
        <div><h1></h1></div>
        )}
        </main>
        </>
    )
}