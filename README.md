# Axios Server Base

## Preset

### Geral

```sh
# Cria servidor com express generator
express server --view=ejs

# Instala dependências
npm install sequelize mysql2 method-override --save

# Instala dependências de desenvolvimento
npm install nodemon sequelize-cli --save -D
```

**server/package.json**

```json
{
  "name": "server",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "start": "node ./bin/www",
    "dev": "nodemon ./bin/www"
  },
  "dependencies": {
    "cookie-parser": "~1.4.4",
    "debug": "~2.6.9",
    "ejs": "~2.6.1",
    "express": "~4.16.1",
    "http-errors": "~1.6.3",
    "method-override": "^3.0.0",
    "morgan": "~1.9.1",
    "mysql2": "^2.3.3",
    "sequelize": "^6.21.3"
  },
  "devDependencies": {
    "nodemon": "^2.0.19",
    "sequelize-cli": "^6.4.1"
  }
}
```

**server/app.js**

```js
// ...
const methodOverride = require('method-override') // <- Pacote para sobrescrita de métodos HTTP

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(methodOverride('_method')) // <- Definição do query param para sobrescrita do método HTTP
app.use(logger('dev'));
// ...
```

### Banco de Dados x Sequelize

```sql
CREATE DATABASE axios_server;
```

**server/.sequelizerc**

```js
const path = require('path')
module.exports = {
    config: path.resolve('./database/config', 'config.json'),
    'models-path': path.resolve('./database/models'),
    'seeders-path': path.resolve('./database/seeders'),
    'migrations-path': path.resolve('./database/migrations'),
}
```

```sh
# Criação dos arquivos base para conexãom com Banco de Dados
npx sequelize-cli init
```

Serão criadas a pasta database e, dentro dela, as pastas config, models, seeders e migrations.

Dentro da pasta config, temos o arquivo `config.json` (precisamos atualizar os dados de conexão ao banco do ambiente - environment - development):

```json
{
  "development": {
    "username": "root",
    "password": null,
    "database": "axios_server",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
```

## Models e Migrations

```sh
# Cria Model e Migration User
npx sequelize-cli model:generate --name User --attributes nome:string,email:string,senha:string
```

**server/database/models/user.js**

```js
'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            User.hasMany(models.Address, {
                as: 'endereco'
            })
        }
    }
    User.init({
        nome: DataTypes.STRING,
        email: DataTypes.STRING,
        senha: DataTypes.STRING
    }, {
        sequelize,
        timestamps: true,
        modelName: 'User',
    });
    return User;
};
```

**server/database/migrations/{AAAAMMDDHHMMSS}-create-user.js**

```js
'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Users', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            nome: {
                type: Sequelize.STRING,
                allowNull: false
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false
            },
            senha: {
                type: Sequelize.STRING,
                allowNull: false
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Users');
    }
};
```

```sh
# Cria Model e Migration Address
npx sequelize-cli model:generate --name Address --attributes cep:string,uf:string,cidade:string,bairro:string,logradouro:string,numero:string,complemento:string
```

**server/database/models/address.js**

```js
'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Address extends Model {
        static associate(models) {
            Address.belongsTo(models.User, {
                foreignKey: 'UserId',
                as: 'endereco'
            })
        }
    }
    Address.init({
        cep: DataTypes.STRING(8),
        uf: DataTypes.STRING,
        cidade: DataTypes.STRING,
        bairro: DataTypes.STRING,
        logradouro: DataTypes.STRING,
        numero: DataTypes.STRING,
        complemento: DataTypes.STRING
    }, {
        sequelize,
        timestamps: true,
        modelName: 'Address',
    });
    return Address;
};
```

**server/database/migrations/{AAAAMMDDHHMMSS}-create-address.js**

```js
'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Addresses', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            cep: {
                type: Sequelize.STRING(8),
                allowNull: false
            },
            uf: {
                type: Sequelize.STRING,
                allowNull: false
            },
            cidade: {
                type: Sequelize.STRING,
                allowNull: false
            },
            bairro: {
                type: Sequelize.STRING,
                allowNull: false
            },
            logradouro: {
                type: Sequelize.STRING,
                allowNull: false
            },
            numero: {
                type: Sequelize.STRING,
                allowNull: false
            },
            complemento: {
                type: Sequelize.STRING
            },
            UserId: {
                allowNull: false,
                unique: true,
                type: Sequelize.INTEGER,
                references: {
                    model: 'users',
                    key: 'id'
                }
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Addresses');
    }
};
```

## Seeders

```sh
# Executa as migrations
npx sequelize-cli db:migrate
```

```sh
# Cria o seeder 'mock-users'
npx sequelize-cli seed:generate --name mock-users
```

**server/database/seeders/{AAAAMMDDHHMMSS}-mock-users.js**

```js
'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('Users', [{
                nome: 'Fulano da Silva',
                email: 'fulanodasilva@email.com',
                senha: '123456',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                nome: 'Ciclano dos Santos',
                email: 'ciclanodossantos@email.com',
                senha: '123456',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                nome: 'Beltrano Dias',
                email: 'beltranodias@email.com',
                senha: '123456',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ], {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Users', null, {});
    }
};
```

```sh
# Cria o seeder 'mock-adresses'
npx sequelize-cli seed:generate --name mock-addresses
```

**server/database/seeders/{AAAAMMDDHHMMSS}-mock-addresses.js**

```js
'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('Addresses', [{
                cep: "01001000",
                uf: "SP",
                cidade: "São Paulo",
                bairro: "Sé",
                logradouro: "Praça da Sé",
                numero: "1",
                complemento: "123-B",
                UserId: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                cep: "01002000",
                uf: "SP",
                cidade: "São Paulo",
                bairro: "Sé",
                logradouro: "Rua Direita",
                numero: "12",
                complemento: null,
                UserId: 2,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                cep: "01003000",
                uf: "SP",
                cidade: "São Paulo",
                bairro: "Sé",
                logradouro: "Rua José Bonifácio",
                numero: "420",
                complemento: "4o andar",
                UserId: 3,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ], {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Addresses', null, {});
    }
};
```

```sh
# Executa os seeders
npx sequelize-cli db:seed:all
```

## API Própria

### Rotas

**server/app.js**

```js
var apiRouter = require('./routes/api');
// ...

// app.use('/users', usersRouter); <- Substituir pelo trecho abaixo ('users' por 'usuarios')
app.use('/usarios', usersRouter);
app.use('/api', apiRouter);
```

**server/routes/api.js**

```js
const express = require('express');
const router = express.Router();
const usersApi = require('../api/users')

router.put('/usuarios/:id/editar/endereco', usersApi.updateAddress);

router.delete('/usuarios/:id/excluir/endereco', usersApi.deleteAddress);

router.get('/usuarios/:id/endereco', usersApi.readUserAddress);

router.put('/usuarios/:id/editar', usersApi.update);

router.delete('/usuarios/:id/excluir', usersApi.delete);

router.post('/usuarios/adicionar', usersApi.create);

router.get('/usuarios/:id', usersApi.readUser);

router.get('/usuarios', usersApi.readUsers);

module.exports = router;
```

### Services

```sh
# Cria a pasta services em server (deve estar dentro da pasta server)
# E o arquivo users em server/services
mkdir services && touch services/users.js
```

**server/services/users.js**

```js
const {
    User,
    Address
} = require('../database/models')
const services = {}

services.getUsers = async () => await User.findAll({
    include: {
        association: 'endereco'
    }
})

services.getUser = async id => await User.findByPk(id, {
    include: {
        association: 'endereco'
    }
})
services.getUserAddress = async UserId => await Address.findOne({
    where: {
        UserId
    }
})

services.createUser = async body => await User.create(body, {
    include: {
        association: 'endereco'
    }
})

services.updateUser = async (id, body) => await User.update(body, {
    where: {
        id
    }
})
services.updateUserAddress = async (id, body) => {
    const addressExists = await Address.findOne({
        where: {
            UserId: id
        }
    })
    return !addressExists ?
        await Address.create({
            UserId: id,
            ...body
        }) :
        await Address.update(body, {
            where: {
                UserId: id
            }
        })
}

services.deleteUser = async id => {
    await Address.destroy({
        where: {
            UserId: id
        }
    })
    await User.destroy({
        where: {
            id
        }
    })
    return
}
services.deleteUserAddress = async UserId => await Address.destroy({
    where: {
        UserId
    }
})

module.exports = services
```

### API Users

```sh
# Cria a pasta api em server (deve estar dentro da pasta server)
# E o arquivo users em server/api
mkdir api && touch api/users.js
```

**server/api/users.js**

```js
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
        return res.status(404).json({
            status: 'Not Found',
            statusCode: 404,
            message: 'Não há usuários cadastrados.'
        })
    }
    return res.json(users)
}

api.readUser = async (req, res) => {
    const {
        id
    } = req.params
    if (!id) {
        return res.status(400).json({
            status: 'Bad Request',
            statusCode: 400,
            message: 'Parâmetro id faltando.'
        })
    }
    const user = await getUser(id)
    if (!user) {
        return res.status(404).json({
            status: 'Not Found',
            statusCode: 404,
            message: 'Usuário não encontrado.'
        })
    }
    return res.status(200).json(user)
}

api.readUserAddress = async (req, res) => {
    const {
        id
    } = req.params
    if (!id) {
        return res.status(400).json({
            status: 'Bad Request',
            statusCode: 400,
            message: 'Parâmetro id faltando.'
        })
    }
    const address = await getUserAddress(id)
    if (!address) {
        return res.status(404).json({
            status: 'Not Found',
            statusCode: 404,
            message: 'Usuário não encontrado.'
        })
    }
    return res.status(200).json(address)
}

api.create = async (req, res) => {
    const {
        body
    } = req
    const {
        nome,
        email,
        senha,
        endereco
    } = body
    if (!nome || !email || !senha || !endereco) {
        return res.status(400).json({
            status: 'Bad Request',
            statusCode: 400,
            message: 'Parâmetro(s) nome, email, senha e/ou endereco faltando.'
        })
    }
    const user = await createUser(body)
    if (!user) {
        return res.status(500).json({
            status: 'Internal Server Error',
            statusCode: 500,
            message: 'Erro de servidor.'
        })
    }
    return res.status(201).json({
        status: 'Created',
        statusCode: 201,
        message: 'Usuário criado com sucesso.'
    })
}

api.update = async (req, res) => {
    const {
        id
    } = req.params
    if (!id) {
        return res.status(400).json({
            status: 'Bad Request',
            statusCode: 400,
            message: 'Parâmetro id faltando.'
        })
    }
    const {
        nome,
        email,
        senha
    } = req.body
    if (!nome || !email || !senha) {
        return res.status(400).json({
            status: 'Bad Request',
            statusCode: 400,
            message: 'Parâmetro(s) nome, email e/ou senha faltando.'
        })
    }
    const {
        endereco
    } = req.body
    if (endereco) {
        await updateUserAddress(id, endereco[0])
    }
    const user = await updateUser(id, {
        nome,
        email,
        senha
    })
    if (!user) {
        return res.status(500).json({
            status: 'Internal Server Error',
            statusCode: 500,
            message: 'Erro de servidor.'
        })
    }
    return res.status(200).json({
        status: 'OK',
        statusCode: 200,
        message: 'Usuário atualizado com sucesso.'
    })
}

api.updateAddress = async (req, res) => {
    const {
        id
    } = req.params
    if (!id) {
        return res.status(400).json({
            status: 'Bad Request',
            statusCode: 400,
            message: 'Parâmetro id faltando.'
        })
    }
    const {
        body
    } = req
    const {
        cep,
        uf,
        cidade,
        bairro,
        logradouro,
        numero
    } = body
    if (!cep || !uf || !cidade || !bairro || !logradouro || !numero) {
        return res.status(400).json({
            status: 'Bad Request',
            statusCode: 400,
            message: 'Parâmetro(s) cep, uf, cidade, bairro, logradouro e/ou numero faltando.'
        })
    }
    const user = await updateUserAddress(id, body)
    if (!user) {
        return res.status(500).json({
            status: 'Internal Server Error',
            statusCode: 500,
            message: 'Erro de servidor.'
        })
    }
    return res.status(200).json({
        status: 'OK',
        statusCode: 200,
        message: 'Endereço atualizado com sucesso.'
    })
}

api.delete = async (req, res) => {
    const {
        id
    } = req.params
    if (!id) {
        return res.status(400).json({
            status: 'Bad Request',
            statusCode: 400,
            message: 'Parâmetro id faltando.'
        })
    }
    await deleteUser(id)
    return res.status(200).json({
        status: 'OK',
        statusCode: 200,
        message: 'Usuário excluído com sucesso.'
    })
}

api.deleteAddress = async (req, res) => {
    const {
        id
    } = req.params
    if (!id) {
        return res.status(400).json({
            status: 'Bad Request',
            statusCode: 400,
            message: 'Parâmetro id faltando.'
        })
    }
    await deleteUserAddress(id)
    return res.status(200).json({
        status: 'OK',
        statusCode: 200,
        message: 'Endereço excluído com sucesso.'
    })
}

module.exports = api
```

## Users

### Estilo

| Estilo importado de outro projeto, não entraremos em detalhes.

### Views

#### Base

**server/views/partials/head.ejs**

```ejs
<!DOCTYPE html>
<html lang="pt-BR">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><%= title %></title>
  <link rel='stylesheet' href='/stylesheets/style.css' />
</head>

<body>
```

**server/views/partials/header.ejs**

```ejs
<header>
  <p><%= title %></p>
</header>
```

**server/views/partials/footer.ejs**

```ejs
<footer>
  <p><%= title %> - <%= new Date().getFullYear() %> <sup>&copy;</sup></p>
</footer>
</body>

</html>
```

**server/views/index.ejs**

```ejs
<%- include('partials/head', title) %>
<%- include('partials/header', title) %>
<main>
  <section>
    <article>
      <h1><%= title %></h1>
      <p>Boas vindas ao <%= title %></p>
    </article>
  </section>
</main>
<%- include('partials/footer', title) %>
```

#### Users

**server/views/usuarios.ejs**

```ejs
<%- include('partials/head', title) %>
<%- include('partials/header', title) %>

<main>
  <h1><%= title %></h1>
  <section>

    <% if(!locals.users) { %>

    <article class="card bg-tertiary-light">
      <h2 class="card__title">Ops...</h2>
      <p class="card__description">Sentimos muito, mas não há nenhum usuário cadastrado no momento. Que tal cadastrar-se?</p>
      <div class="btn-group btn-group--end">
        <a href="cadastro" class="btn btn--tertiary">Quero me cadastrar</a>
      </div>
    </article>

    <% } else { %>

    <% for(let user of users) { %>
    <article class="card bg-tertiary-light badge badge-tertiary" data-badge="#<%= user.id %>">

      <h2 class="card__title"><%= user.nome %></h2>
      <p class="card__description"><%= user.email %></p>
      <div class="btn-group btn-group--end">
        <a href="/usuarios/<%= user.id %>" class="btn btn--tertiary">Detalhes</a>
      </div>

    </article>
    <% } %>

    <% } %>
  </section>
</main>

<%- include('partials/footer', title) %>
```

**server/views/usuario.ejs**

```ejs
<%- include('partials/head', title) %>
<%- include('partials/header', title) %>

<main>
  <h1><%= title %></h1>
  <section class="bg-tertiary-light">

    <% if(!locals.user) { %>

    <article>
      <h2>Ops...</h2>
      <p>Sentimos muito, mas não encontramos o usuário buscado...</p>
      <div class="btn-group btn-group--end">
        <a href="/usuarios" class="btn btn--tertiary">Ver usuários</a>
      </div>
    </article>

    <% } else { %>

    <% const {cep, uf, cidade, bairro, logradouro, numero, complemento } = user.endereco[0] %>

    <article>
      <h2><%= user.nome %></h2>
      <p><b>Email:</b> <%= user.email %></p>
      <p><b>Endereço</b></p>
      <p><%= logradouro %>,<%= numero %><%= complemento ? ` - ${complemento}` : '' %></p>
      <p>CEP <%= cep %></p>
      <p><%= bairro %>, <%= cidade %>/<%= uf %></p>
      <div class="btn-group btn-group--end">
        <a href="/usuarios/<%= user.id %>/editar" class="btn btn--warning">Editar</a>
        <button form="apagarUsuario" class="btn btn--alert">Excluir</button>
      </div>
      <form action="/usuarios/<%= user.id %>/excluir?_method=delete" method="POST" id="apagarUsuario" class="hidden"></form>
    </article>
    <% } %>
  </section>
</main>

<%- include('partials/footer', title) %>
```

**server/views/usuario-adicionar.ejs**

```ejs
<%- include('partials/head', title) %>
<%- include('partials/header', title) %>

<main>
  <h1><%= title %></h1>
  <section class="bg-tertiary-light">

    <form action="" method="POST">
      <fieldset>
        <div class="input-group">
          <label for="nome">Nome</label>
          <input type="text" id="nome" name="nome">
        </div>
        <div class="input-group">
          <label for="email">Email</label>
          <input type="email" id="email" name="email">
        </div>
        <div class="input-group">
          <label for="senha">Senha</label>
          <input type="password" id="senha" name="senha">
        </div>
      </fieldset>
      <fieldset>
        <div class="input-group">
          <label for="cep">CEP</label>
          <input type="text" id="cep" name="cep" maxlength="9" minlength="8">
        </div>
        <div class="input-group">
          <label for="uf">UF</label>
          <select name="uf" id="uf">
            <option value="" disabled selected>Selecionar</option>
            <% for(let uf of ufs) { %>
            <option value="<%= uf.sigla %>"><%= uf.sigla %></option>
            <% } %>
          </select>
        </div>
        <div class="input-group">
          <label for="cidade">Cidade</label>
          <input type="text" id="cidade" name="cidade">
        </div>
        <div class="input-group">
          <label for="bairro">Bairro</label>
          <input type="text" id="bairro" name="bairro">
        </div>
        <div class="input-group">
          <label for="logradouro">Logradouro</label>
          <input type="text" id="logradouro" name="logradouro">
        </div>
        <div class="input-group">
          <label for="numero">Número</label>
          <input type="text" id="numero" name="numero">
        </div>
        <div class="input-group">
          <label for="complemento">Complemento</label>
          <input type="text" id="complemento" name="complemento">
        </div>
      </fieldset>
      <div class="btn-group btn-group--end">
        <button class="btn btn--tertiary">Enviar</button>
      </div>
    </form>

  </section>
</main>

<%- include('partials/footer', title) %>
```

**server/views/usuario-editar.ejs**

```ejs
<%- include('partials/head', title) %>
<%- include('partials/header', title) %>

<main>
  <h1><%= title %></h1>
  <section class="bg-tertiary-light">

    <%
      const {nome, email, senha } = locals.user
      const {cep, uf, cidade, bairro, logradouro, numero, complemento } = user.endereco[0]
      console.log(locals.user)
    %>

    <form action="?_method=put" method="POST">
      <fieldset>
        <div class="input-group">
          <label for="nome">Nome</label>
          <input type="text" id="nome" name="nome" value="<%= nome %>">
        </div>
        <div class="input-group">
          <label for="email">Email</label>
          <input type="email" id="email" name="email" value="<%= email %>">
        </div>
        <div class="input-group">
          <label for="senha">Senha</label>
          <input type="password" id="senha" name="senha" value="<%= senha %>">
        </div>
      </fieldset>
      <fieldset>
        <div class="input-group">
          <label for="cep">CEP</label>
          <input type="text" id="cep" name="cep" value="<%= cep %>" maxlength="9" minlength="8">
        </div>
        <div class="input-group">
          <label for="uf">UF</label>
          <select name="uf" id="uf">
            <option value="" disabled>Selecionar</option>
            <% for(let ufOption of ufs) { %>
            <option value="<%= ufOption.sigla %>" <%= (ufOption.sigla == uf) ? "selected" : "" %>><%= ufOption.sigla %></option>
            <% } %>
          </select>
        </div>
        <div class="input-group">
          <label for="cidade">Cidade</label>
          <input type="text" id="cidade" name="cidade" value="<%= cidade %>">
        </div>
        <div class="input-group">
          <label for="bairro">Bairro</label>
          <input type="text" id="bairro" name="bairro" value="<%= bairro %>">
        </div>
        <div class="input-group">
          <label for="logradouro">Logradouro</label>
          <input type="text" id="logradouro" name="logradouro" value="<%= logradouro %>">
        </div>
        <div class="input-group">
          <label for="numero">Número</label>
          <input type="text" id="numero" name="numero" value="<%= numero %>">
        </div>
        <div class="input-group">
          <label for="complemento">Complemento</label>
          <input type="text" id="complemento" name="complemento" value="<%= complemento %>">
        </div>
      </fieldset>
      <div class="btn-group btn-group--end">
        <button class="btn btn--tertiary">Enviar</button>
      </div>
    </form>

  </section>
</main>

<%- include('partials/footer', title) %>
```

### Rotas

**server/routes/users.js**

```js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/users')

router.get('/', controller.index);

router.get('/:id/editar', controller.edit);
router.put('/:id/editar', controller.update);

router.delete('/:id/excluir', controller.delete);

router.get('/adicionar', controller.add);
router.post('/adicionar', controller.create);

router.get('/:id', controller.read);

module.exports = router;
```

### Controllers

**server/controllers/users.js**

```js
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
```

## API EXTERNA (Axios)

### Axios no Node

```sh
# Instalando o axios como dependência (caso não tenha instalado) - dentro da pasta server
npm install axios --save

# Criando o arquivo server/api/ibge.js (estando dentro de server)
touch api/ibge.js
```

**server/api/ibge.js**

```js
const axios = require('axios')

const ibge = axios.create({
    baseURL: 'https://servicodados.ibge.gov.br/api/v1/localidades',
    timeout: 4000
})

module.exports = ibge
```

**server/controllers/users.js**

```js
// Imports
const ibge = require('../api/ibge')

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

// Outros métodos
```
