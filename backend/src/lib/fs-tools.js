import { fileURLToPath, format } from "url"
import {dirname, join} from "path"
import fs from "fs-extra"
import { createReadStream } from "fs"
// import finder from "findit"

export const publicPath = join(dirname(fileURLToPath(import.meta.url)), "../public")
export const filesPath = join(publicPath, "img")
export const dataPath = join(dirname(fileURLToPath(import.meta.url)), "../data")


//******************local methods
const getFilePath = (path, fileName) => join(path,fileName)


const fullUrlFn = (req)=> format({
      protocol: req.protocol,
      host: req.get('host')
    })

export const getImagePath = (req) => {
    let fullUrl = fullUrlFn(req)
    return fullUrl + "/img"
}

// finder.on('directory', function (dir, stat, stop) {
//     var base = path.basename(dir);
//     if (base === '.git' || base === 'node_modules') stop()
//     else console.log(dir + '/')
// });

//******************Shared methods
export const getItemsFromFile = async (fileName) => 
await fs.readJson(getFilePath(dataPath,fileName))


export const getItemFromFile = async (fileName, id) => {
    const items = await getItemsFromFile(fileName)
    return items.filter(item => item._id === id)
}

export const writeItemsToFile = async (filename, content) => 
await fs.writeJson(getFilePath(dataPath,filename), content)

export const getItemsExceptOneWithIdFromFile = async (fileName, id) => {
    const items = await getItemsFromFile(fileName)
    return items.filter(item => item._id !== id)
}

export const writeImageFile = async (filename, content) => 
await fs.writeFile(getFilePath(filesPath,filename), content)

export const readImage =  (fileName) => createReadStream(join(filesPath,fileName)) 




