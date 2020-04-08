// usei o express pra criar e configurar meu servidor
const express = require("express")
const server = express()

const db = require("./db")

// configurar arquivos estáticos (css, scripts, images)
server.use(express.static("public"))

// habilitar uso do pedido da req.body da url
server.use(express.urlencoded({extended: true}))

// configuração do nunjucks
const nunjucks = require("nunjucks")
nunjucks.configure("views", {
  express: server,
  noCache: true, //boolean
})

// criei uma rota /
// e capturo o pedido do cliente para responder
// home get
server.get("/", function(req, res) {
  
  db.all(`SELECT * FROM ideas`, function(err, rows) {
    if (err) {
      return res.send("Erro no banco de dados!")
    }

    const reversedIdeas = [...rows].reverse()

    let lastIdeas = []

    for (let idea of reversedIdeas) {
      if (lastIdeas.length < 2) {
        lastIdeas.push(idea)
      }
    }

    return res.render("index.html", { ideas: lastIdeas })
  })

})

// ideias get
server.get("/ideias", function (req, res) {
  
  db.all(`SELECT * FROM ideas`, function (err, rows) {
    if (err) {
      return res.send("Erro no banco de dados!")
    } 
    const reversedIdeas = [...rows].reverse()
    return res.render("ideias.html", { ideas: reversedIdeas })
  })
})

// ideias post
server.post("/", function(req, res) {
  // Inserir dados na tabela
  const query = `
      INSERT INTO ideas(
        image,
        title,
        category,
        description,
        link
      ) VALUES (?,?,?,?,?);
  `
  //pegar registros do array req.body
  const values = [
    req.body.image,
    req.body.title,
    req.body.category,
    req.body.description,
    req.body.link,
  ]

  db.run(query, values, function(err){
    if (err) {
      return res.send("Erro no banco de dados!")
    } 

    return res.redirect("/ideias")
  })
})

// liguei meu servidor na porta 3000
server.listen(3000)