const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateUserAddress,
  deleteUser
} = require('../services/users')

const ufs = [{
  "id": 12,
  "sigla": "AC",
  "nome": "Acre",
  "regiao": {
    "id": 1,
    "sigla": "N",
    "nome": "Norte"
  }
},
{
  "id": 27,
  "sigla": "AL",
  "nome": "Alagoas",
  "regiao": {
    "id": 2,
    "sigla": "NE",
    "nome": "Nordeste"
  }
},
{
  "id": 16,
  "sigla": "AP",
  "nome": "Amapá",
  "regiao": {
    "id": 1,
    "sigla": "N",
    "nome": "Norte"
  }
},
{
  "id": 13,
  "sigla": "AM",
  "nome": "Amazonas",
  "regiao": {
    "id": 1,
    "sigla": "N",
    "nome": "Norte"
  }
},
{
  "id": 29,
  "sigla": "BA",
  "nome": "Bahia",
  "regiao": {
    "id": 2,
    "sigla": "NE",
    "nome": "Nordeste"
  }
},
{
  "id": 23,
  "sigla": "CE",
  "nome": "Ceará",
  "regiao": {
    "id": 2,
    "sigla": "NE",
    "nome": "Nordeste"
  }
},
{
  "id": 53,
  "sigla": "DF",
  "nome": "Distrito Federal",
  "regiao": {
    "id": 5,
    "sigla": "CO",
    "nome": "Centro-Oeste"
  }
},
{
  "id": 32,
  "sigla": "ES",
  "nome": "Espírito Santo",
  "regiao": {
    "id": 3,
    "sigla": "SE",
    "nome": "Sudeste"
  }
},
{
  "id": 52,
  "sigla": "GO",
  "nome": "Goiás",
  "regiao": {
    "id": 5,
    "sigla": "CO",
    "nome": "Centro-Oeste"
  }
},
{
  "id": 21,
  "sigla": "MA",
  "nome": "Maranhão",
  "regiao": {
    "id": 2,
    "sigla": "NE",
    "nome": "Nordeste"
  }
},
{
  "id": 51,
  "sigla": "MT",
  "nome": "Mato Grosso",
  "regiao": {
    "id": 5,
    "sigla": "CO",
    "nome": "Centro-Oeste"
  }
},
{
  "id": 50,
  "sigla": "MS",
  "nome": "Mato Grosso do Sul",
  "regiao": {
    "id": 5,
    "sigla": "CO",
    "nome": "Centro-Oeste"
  }
},
{
  "id": 31,
  "sigla": "MG",
  "nome": "Minas Gerais",
  "regiao": {
    "id": 3,
    "sigla": "SE",
    "nome": "Sudeste"
  }
},
{
  "id": 15,
  "sigla": "PA",
  "nome": "Pará",
  "regiao": {
    "id": 1,
    "sigla": "N",
    "nome": "Norte"
  }
},
{
  "id": 25,
  "sigla": "PB",
  "nome": "Paraíba",
  "regiao": {
    "id": 2,
    "sigla": "NE",
    "nome": "Nordeste"
  }
},
{
  "id": 41,
  "sigla": "PR",
  "nome": "Paraná",
  "regiao": {
    "id": 4,
    "sigla": "S",
    "nome": "Sul"
  }
},
{
  "id": 26,
  "sigla": "PE",
  "nome": "Pernambuco",
  "regiao": {
    "id": 2,
    "sigla": "NE",
    "nome": "Nordeste"
  }
},
{
  "id": 22,
  "sigla": "PI",
  "nome": "Piauí",
  "regiao": {
    "id": 2,
    "sigla": "NE",
    "nome": "Nordeste"
  }
},
{
  "id": 33,
  "sigla": "RJ",
  "nome": "Rio de Janeiro",
  "regiao": {
    "id": 3,
    "sigla": "SE",
    "nome": "Sudeste"
  }
},
{
  "id": 24,
  "sigla": "RN",
  "nome": "Rio Grande do Norte",
  "regiao": {
    "id": 2,
    "sigla": "NE",
    "nome": "Nordeste"
  }
},
{
  "id": 43,
  "sigla": "RS",
  "nome": "Rio Grande do Sul",
  "regiao": {
    "id": 4,
    "sigla": "S",
    "nome": "Sul"
  }
},
{
  "id": 11,
  "sigla": "RO",
  "nome": "Rondônia",
  "regiao": {
    "id": 1,
    "sigla": "N",
    "nome": "Norte"
  }
},
{
  "id": 14,
  "sigla": "RR",
  "nome": "Roraima",
  "regiao": {
    "id": 1,
    "sigla": "N",
    "nome": "Norte"
  }
},
{
  "id": 42,
  "sigla": "SC",
  "nome": "Santa Catarina",
  "regiao": {
    "id": 4,
    "sigla": "S",
    "nome": "Sul"
  }
},
{
  "id": 35,
  "sigla": "SP",
  "nome": "São Paulo",
  "regiao": {
    "id": 3,
    "sigla": "SE",
    "nome": "Sudeste"
  }
},
{
  "id": 28,
  "sigla": "SE",
  "nome": "Sergipe",
  "regiao": {
    "id": 2,
    "sigla": "NE",
    "nome": "Nordeste"
  }
},
{
  "id": 17,
  "sigla": "TO",
  "nome": "Tocantins",
  "regiao": {
    "id": 1,
    "sigla": "N",
    "nome": "Norte"
  }
}
]

const controller = {}

controller.index = async (req, res) => {
  const users = await getUsers()
  res.render('usuarios', {
    title: 'Usuários',
    users
  })
}

controller.read = async (req, res) => {
  const {
    id
  } = req.params
  const user = await getUser(id)
  res.render('usuario', {
    title: user.nome,
    user
  })
}

controller.add = (req, res) => {
  res.render('usuario-adicionar', {
    title: 'Adicionar Usuário',
    ufs
  })
}

controller.create = async (req, res) => {
  const {
    body
  } = req
  const {
    nome,
    email,
    senha,
    cep,
    uf,
    cidade,
    bairro,
    logradouro,
    numero,
    complemento = null
  } = body
  const data = {
    nome,
    email,
    senha,
    endereco: [{
      cep,
      uf,
      cidade,
      bairro,
      logradouro,
      numero,
      complemento
    }]
  }
  const user = await createUser(data)
  res.redirect('/usuarios')
}

controller.edit = async (req, res) => {
  const {
    id
  } = req.params
  const user = await getUser(id)
  res.render('usuario-editar', {
    title: `Editar Usuário ${user.nome}`,
    user,
    ufs
  })
}

controller.update = async (req, res) => {
  const {
    id
  } = req.params
  const {
    body
  } = req
  const {
    nome,
    email,
    senha,
    cep,
    uf,
    cidade,
    bairro,
    logradouro,
    numero,
    complemento = null
  } = body
  const data = {
    nome,
    email,
    senha,
    endereco: [{
      cep,
      uf,
      cidade,
      bairro,
      logradouro,
      numero,
      complemento
    }]
  }
  const address = await updateUserAddress(id, data.endereco[0])
  const user = await updateUser(id, {
    nome,
    email,
    senha
  })
  res.redirect('/usuarios')
}

controller.delete = async (req, res) => {
  const {
    id
  } = req.params
  const deleted = await deleteUser(id)
  res.redirect('/usuarios')
}

module.exports = controller