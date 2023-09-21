const express = require('express')
var morgan = require('morgan')
const app = express()

app.use(morgan(function (tokens, req, res){
  return [
    tokens.method(req,res),
    tokens.url(req,res),
    tokens.status(req,res),
    tokens.res(req,res,'content-length'),'-',
    tokens['response-time'](req,res),'ms',
    JSON.stringify(req.body)
  ].join(' ')
}))

app.use(express.json())

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }  

let phonebook = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
];

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {
    const d = new Date();
    const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    response.send(`<p>Phonebook has info for ${phonebook.length} people</p><p>${days[d.getDay()]} ${months[d.getMonth()]} ${d.getDate()} ${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}:${d.getMinutes()} GMT${d.getTimezoneOffset()} (${Intl.DateTimeFormat().resolvedOptions().timeZone})</p>`)
})

app.get('/api/persons', (request, response) => {
  response.json(phonebook)
})

app.get('/api/persons/:id', (request, response) => {
    const person = phonebook.find(p => p.id == request.params.id)
    if(person)response.json(person);
    else response.status(404).end();
  })
  
app.delete('/api/persons/:id', (request, response) => {
    phonebook = phonebook.filter(p => p.id != request.params.id)
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const person = request.body;

    if(!person){return response.status(400).json({error:"Content missing"})}
    if(!person.name || person.name == ""){return response.status(400).json({error:"Invalid name"})}
    if(!person.number || person.number == ""){return response.status(400).json({error:"Invalid number"})}
    if(phonebook.find(p => p.name == person.name)){return response.status(400).json({error:"Name must be unique"})}

    person.id = getRandomInt(99999999);
    phonebook = phonebook.concat(person);
    response.json(person);
})

const PORT = 3002
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})