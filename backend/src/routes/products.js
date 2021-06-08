import express from "express"
import { getItemFromFile, getItemsFromFile, writeItemsToFile,getItemsExceptOneWithIdFromFile } from './../lib/fs-tools.js';
import createError  from 'http-errors';
import { checkContentType, checkProductSchema, checkValidation, headerValidation } from './../lib/reqValidation.js';
import {nanoid} from "nanoid";



const pr = express.Router()

const fileName = "products.json"

pr.get("/", async(req, res, next) => {
  try {
    const items = await getItemsFromFile(fileName)
    res.status(200).send(items)
  } catch (error) {
    next(error)
  }
})

pr.get("/:id", async(req, res, next) => {
  try {
    const item = await getItemFromFile(fileName, req.params.id)
    if(!item.length){
      next(createError(404,{message: "Item not found"}))
    } else{
      res.status(200).send(item)
    }
  } catch (error) {
    next(error)
  }
})

pr.post("/", 
headerValidation,
checkProductSchema, 
checkValidation, async(req, res, next) => {
  try {
    const items = await getItemsFromFile(fileName)
    let item = {
      ...req.body, 
      _id: nanoid(), 
      createdAt: new Date(), 
      updatedAt: new Date()
    }
    items.push(item)
    await writeItemsToFile(fileName, items)
    res.status(201).send({id: item._id})
  } catch (error) {
    next(error)
  }
})
pr.delete("/:id", async(req, res, next) => {
  try {
    const item = await getItemFromFile(fileName, req.params.id)
    if(!item.length){
      next(createError(404,{message: "Item not found"}))
    } else{
      const items = await 
      getItemsExceptOneWithIdFromFile(fileName, req.params.id)
      await writeItemsToFile(fileName, items)
      res.status(204).send()
    }
  } catch (error) {
    next(error)
  }
})
pr.put("/:id",
headerValidation, 
checkProductSchema, 
checkValidation, 
async(req, res, next) => {
  try {
    const item = await getItemFromFile(fileName, req.params.id)
    if(!item.length){
      next(createError(404,{message: "Item not found"}))
    } else{
      const items = await 
      getItemsExceptOneWithIdFromFile(fileName, req.params.id)
      const newItem = {...item[0], 
        ...req.body, 
        _id: item[0]._id, 
        updatedAt: new Date()}
      items.push(newItem)
      await writeItemsToFile(fileName, items)
      res.status(201).send({id: item[0]._id})
    }
  } catch (error) {
    next(error)
  }
})

export default pr