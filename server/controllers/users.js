const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateUserAddress,
  deleteUser
} = require('../services/users')

const ibge = require('../api/ibge')

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
  if (!user) {
    res.status(404).json({ message: 'Vê direito rapá' })
  }
  res.render('usuario', {
    title: user.nome,
    user
  })
}

controller.add = (req, res) => {
  ibge.get('/estados?orderBy=nome')
    .then(response => {
      const ufs = response.data
      res.render('usuario-adicionar', {
        title: 'Adicionar Usuário',
        ufs
      })
    })
    .catch(err => res.status(500).json({
      status: 'Internal Server Error',
      statusCode: 500,
      message: `Deu ruim... veja o erro: ${err}`
    }))
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
  ibge.get('/estados?orderBy=nome')
    .then(response => {
      const ufs = response.data
      res.render('usuario-editar', {
        title: `Editar Usuário ${user.nome}`,
        user,
        ufs
      })
    })
    .catch(err => res.status(500).json({
      status: 'Internal Server Error',
      statusCode: 500,
      message: `Deu ruim... veja o erro: ${err}`
    }))
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