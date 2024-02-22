export type User = {
    email:string,
    password:string
    name :string
}

export type Product = {
    _id: 'string',
    name:string,
    batch:string,
    expireDate:string,
    employee:string,
    quantity:string
}


export type Withdraws = {
    _id: 'string',
    employee:'string',
    responsible:'string',
    quantity:'string',
    productName:'string',
    batch:'string',
    date:'string',
    hour:'string'
}