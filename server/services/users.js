const { User, Address } = require('../database/models')
const services = {}

services.getUsers = async () => await User.findAll({ include: { association: 'endereco' } })

services.getUser = async id => await User.findByPk(id, { include: { association: 'endereco' } })
services.getUserAddress = async UserId => await Address.findOne({ where: { UserId } })

services.createUser = async body => await User.create(body, { include: { association: 'endereco' } })

services.updateUser = async (id, body) => await User.update(body, { where: { id } })
services.updateUserAddress = async (id, body) => {
  const addressExists = await Address.findOne({ where: { UserId: id } })
  return !addressExists
    ? await Address.create({ UserId: id, ...body })
    : await Address.update(body, { where: { UserId: id } })
}

services.deleteUser = async id => {
  await Address.destroy({ where: { UserId: id } })
  await User.destroy({ where: { id } })
  return
}
services.deleteUserAddress = async UserId => await Address.destroy({ where: { UserId } })

module.exports = services