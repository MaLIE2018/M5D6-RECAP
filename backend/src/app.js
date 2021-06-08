//******************Imports
import express from "express"
import cors from "cors"
import createError from "http-errors"
import { publicPath } from "./lib/fs-tools.js"
import { badRequestHandler, catchAllHandler, forbiddenHandler, notFoundHandler } from "./lib/errorHandler.js"
import pr from './routes/products.js';
import fr from "./lib/fileHandler.js"
import listEndpoints from "express-list-endpoints"

const port = 3001 
const app = express()

app.use(cors({
  origin: "http://localhost:3000",
  methods: "GET,PUT,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204
}))
app.use(express.static(publicPath))
app.use(express.json())

// ******************Routes
app.use ("/products", pr)
app.use ("/product", fr)
//*******************Errors
app.use(notFoundHandler, badRequestHandler, forbiddenHandler, catchAllHandler)


app.get("/", (req, res, next) => {
  if(!req.route && !res.headersSent){
    res.send(createError(404, {message: "Not found"}))
  }
})

console.table(listEndpoints(app))


app.listen(port, () => {
  console.log(`Server listening at port ${port}`)
})
