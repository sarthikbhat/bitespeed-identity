const test  = [
    {
      id: 4,
      phoneNumber: '12345',
      email: 'sarthik@gmail.com',
      linkedId: null,
      linkPrecedence: 'primary',
      createdAt: "2024-05-09T17:35:19.925Z",
      updatedAt: "2024-05-09T17:35:19.925Z",
      deletedAt: null
    },
    {
      id: 3,
      phoneNumber: '1',
      email: 'sarthik@gmail.com',
      linkedId: 4,
      linkPrecedence: 'secondary',
      createdAt: "2024-05-09T14:48:56.312Z",
      updatedAt: "2024-05-09T14:48:56.312Z",
      deletedAt: null
    }
  ]

const existsInformation = ()=>{
    const phone = test.findIndex(elm=>elm.phoneNumber==="12345")
    if(phone===-1) return false;
    const email = test.findIndex(elm=>elm.email==="sarthik@gmail.com")
    if(email === -1) return false;
    return true;
}

console.log(existsInformation())
