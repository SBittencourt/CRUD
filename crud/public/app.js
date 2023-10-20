const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '12345678',
  database: 'crud'
});

db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao MySQL:', err);
    return;
  }
  console.log('Conectado ao MySQL');
});

// Rota para listar registros de clientes
app.get('/clientes', (req, res) => {
  db.query('SELECT * FROM clientes', (err, clientes) => {
    if (err) {
      console.error('Erro ao buscar registros de clientes:', err);
      return;
    }

    // Consulta para listar produtos com JOIN
    db.query('SELECT clientes.nome AS cliente, produtos.nome AS produto, produtos.preco FROM clientes JOIN produtos ON clientes.id = produtos.id', (err, produtos) => {
      if (err) {
        console.error('Erro ao buscar registros de produtos:', err);
        return;
      }
      res.render('index', { clientes, produtos });
    });
  });
});

// Rota para exibir o formulário de criação de clientes
app.get('/create', (req, res) => {
  res.render('create');
});

// Rota para criar um novo cliente
app.post('/create', (req, res) => {
  const { nome, email } = req.body;
  db.query('INSERT INTO clientes (nome, email) VALUES (?, ?)', [nome, email], (err, result) => {
    if (err) {
      console.error('Erro ao criar cliente:', err);
      return;
    }
    console.log('Cliente criado com sucesso:', result);
    res.redirect('/clientes');
  });
});

// Rota para criar um novo produto
app.post('/createprod', (req, res) => {
  const { nome, preco } = req.body; // Corrigido para pegar o valor de "preco"
  db.query('INSERT INTO produtos (nome, preco) VALUES (?, ?)', [nome, preco], (err, result) => {
    if (err) {
      console.error('Erro ao criar produto:', err);
      return;
    }
    console.log('Produto criado com sucesso:', result);
    res.redirect('/clientes'); // Redirecionado para '/clientes' ou '/produtos', dependendo de onde deseja redirecionar
  });
});


// Rota para exibir o formulário de edição
app.get('/edit/:id', (req, res) => {
  const id = req.params.id;
  db.query('SELECT * FROM usuarios WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('Erro ao buscar registro para edição:', err);
      return;
    }
    res.render('edit', { usuario: result[0] });
  });
});

// Rota para atualizar um registro
app.post('/edit/:id', (req, res) => {
  const id = req.params.id;
  const { nome, email } = req.body;
  db.query('UPDATE usuarios SET nome = ?, email = ? WHERE id = ?', [nome, email, id], (err, result) => {
    if (err) {
      console.error('Erro ao atualizar registro:', err);
      return;
    }
    console.log('Registro atualizado com sucesso:', result);
    res.redirect('/');
  });
});

// Rota para excluir um registro
app.get('/delete/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM usuarios WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('Erro ao excluir registro:', err);
      return;
    }
    console.log('Registro excluído com sucesso:', result);
    res.redirect('/');
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});


