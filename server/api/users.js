const {
  getUsers,
  getUser,
  getUserAddress,
  createUser,
  updateUser,
  updateUserAddress,
  deleteUser,
  deleteUserAddress
} = require('../services/users')

const api = {}

api.readUsers = async (req, res) => {
  const users = await getUsers()
  if (!users || !users.length) {
    return res.status(404).json({ status: 'Not Found', statusCode: 404, message: 'Não há usuários cadastrados.' })
  }
  return res.status(200).json(users)
}

api.readUser = async (req, res) => {
  const { id } = req.params
  if (!id) {
    return res.status(400).json({ status: 'Bad Request', statusCode: 400, message: 'Parâmetro id faltando.' })
  }
  const user = await getUser(id)
  if (!user) {
    return res.status(404).json({ status: 'Not Found', statusCode: 404, message: 'Usuário não encontrado.' })
  }
  return res.status(200).json(user)
}

api.readUserAddress = async (req, res) => {
  const { id } = req.params
  if (!id) {
    return res.status(400).json({ status: 'Bad Request', statusCode: 400, message: 'Parâmetro id faltando.' })
  }
  const address = await getUserAddress(id)
  if (!address) {
    return res.status(404).json({ status: 'Not Found', statusCode: 404, message: 'Usuário não encontrado.' })
  }
  return res.status(200).json(address)
}

api.create = async (req, res) => {
  const { body } = req
  const { nome, email, senha, endereco } = body
  if (!nome || !email || !senha || !endereco) {
    return res.status(400).json({ status: 'Bad Request', statusCode: 400, message: 'Parâmetro(s) nome, email, senha e/ou endereco faltando.' })
  }
  const user = await createUser(body)
  if (!user) {
    return res.status(500).json({ status: 'Internal Server Error', statusCode: 500, message: 'Erro de servidor.' })
  }
  return res.status(201).json({ status: 'Created', statusCode: 201, message: 'Usuário criado com sucesso.' })
}

api.update = async (req, res) => {
  const { id } = req.params
  if (!id) {
    return res.status(400).json({ status: 'Bad Request', statusCode: 400, message: 'Parâmetro id faltando.' })
  }
  const { nome, email, senha } = req.body
  if (!nome || !email || !senha) {
    return res.status(400).json({ status: 'Bad Request', statusCode: 400, message: 'Parâmetro(s) nome, email e/ou senha faltando.' })
  }
  const { endereco } = req.body
  if (endereco) {
    await updateUserAddress(id, endereco[0])
  }
  const user = await updateUser(id, { nome, email, senha })
  if (!user) {
    return res.status(500).json({ status: 'Internal Server Error', statusCode: 500, message: 'Erro de servidor.' })
  }
  return res.status(200).json({ status: 'OK', statusCode: 200, message: 'Usuário atualizado com sucesso.' })
}

api.updateAddress = async (req, res) => {
  const { id } = req.params
  if (!id) {
    return res.status(400).json({ status: 'Bad Request', statusCode: 400, message: 'Parâmetro id faltando.' })
  }
  const { body } = req
  const { cep, uf, cidade, bairro, logradouro, numero } = body
  if (!cep || !uf || !cidade || !bairro || !logradouro || !numero) {
    return res.status(400).json({ status: 'Bad Request', statusCode: 400, message: 'Parâmetro(s) cep, uf, cidade, bairro, logradouro e/ou numero faltando.' })
  }
  const user = await updateUserAddress(id, body)
  if (!user) {
    return res.status(500).json({ status: 'Internal Server Error', statusCode: 500, message: 'Erro de servidor.' })
  }
  return res.status(200).json({ status: 'OK', statusCode: 200, message: 'Endereço atualizado com sucesso.' })
}

api.delete = async (req, res) => {
  const { id } = req.params
  if (!id) {
    return res.status(400).json({ status: 'Bad Request', statusCode: 400, message: 'Parâmetro id faltando.' })
  }
  await deleteUser(id)
  return res.status(200).json({ status: 'OK', statusCode: 200, message: 'Usuário excluído com sucesso.' })
}

api.deleteAddress = async (req, res) => {
  const { id } = req.params
  if (!id) {
    return res.status(400).json({ status: 'Bad Request', statusCode: 400, message: 'Parâmetro id faltando.' })
  }
  await deleteUserAddress(id)
  return res.status(200).json({ status: 'OK', statusCode: 200, message: 'Endereço excluído com sucesso.' })
}

module.exports = api