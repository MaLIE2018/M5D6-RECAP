import express from 'express';
import multer from "multer"
import  createError  from 'http-errors';
import { getImagePath, getItemFromFile, 
  writeItemsToFile,writeImageFile, 
  getItemsExceptOneWithIdFromFile, 
  readImage} from './fs-tools.js';
import {  headerFileUploadValidation, 
  checkValidation } from './reqValidation.js';
import {extname, join } from "path"
import { pipeline } from 'stream';

const fr = express.Router();

const fileName = "products.json"

fr.post("/:id/upload",
headerFileUploadValidation,
checkValidation,
multer().single("cover"), 
async (req, res, next) =>{
  console.log(req.headers)
  try {
    let item = await getItemFromFile(fileName, req.params.id)
    if (!item.length){
      next(createError(404,{message: "Item not found"}))
    } else{
      const newFileName = `${req.params.id}${extname(req.file.originalname)}`
      const newFilePath = getImagePath(req)
      writeImageFile(newFileName,req.file.buffer)
      const items = await getItemsExceptOneWithIdFromFile(fileName, req.params.id)
      item[0].imageUrl = join(newFilePath , newFileName)
      items.push(item[0])
      await writeItemsToFile(fileName, items)
      res.status(201).send("ImagePost")
    }
  } catch (error) {
    
  }
})


fr.get("/:fileName/download", async ( req, res, next) => {
  try {
    res.setHeader("Content-Disposition", `attachment; filename=${req.params.fileName}`)
    const source = readImage(req.params.fileName)
    const des = res
    pipeline(source, des, err => next(err))
    
  } catch (error) {
    next(error)
  }

})

export default fr