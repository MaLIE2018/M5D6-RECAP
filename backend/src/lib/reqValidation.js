import {check, checkSchema, validationResult} from "express-validator"
import { header } from "express-validator";
import createError  from 'http-errors';

const pSchema = {
  name: {
    isString: {
      errorMessage:"name is required"
    },
    exists:{
      errorMessage:"price must present"
    },
    notEmpty:{
      errorMessage:"cannot be empty"
    }
  },
  description: {
    isString: {
      errorMessage:"description is required"
    },
    exists:{
      errorMessage:"price must present"
    },
    notEmpty:{
      errorMessage:"cannot be empty"
    }
  },
  brand: {
    isString: {
      errorMessage:"brand is required"
    },
    exists:{
      errorMessage:"price must present"
    },
    notEmpty:{
      errorMessage:"cannot be empty"
    }
  },
  category: {
    isString: {
      errorMessage:"category is required"
    },
    exists:{
      errorMessage:"price must present"
    },
    notEmpty:{
      errorMessage:"cannot be empty"
    }
  },
  price: {
    isNumeric: {
      errorMessage:"price must be number"
    },
    exists:{
      errorMessage:"price must present"
    },
    notEmpty:{
      errorMessage:"cannot be empty"
    }
  },
  imageUrl:{
    exists:{
      errorMessage:"imageUrl is required"
    }
  }
}

export const headerValidation = [
  header("content-type").exists().withMessage("content-type is required").equals("application/json").withMessage("needs to be application")
]
export const headerFileUploadValidation = [
  header("content-type").exists().withMessage("content-type is required").equals("multipart/form-data").withMessage("needs to be form-data")
]

export const checkProductSchema = checkSchema(pSchema)


export const checkValidation = (req, res,next) =>{
  const result = validationResult(req)
  if(!result.isEmpty()){
    next(createError(400, {errorsList: result}))
  }else{
    next()
  }
}
//TODO HOW DOES THAT WORK TO CHECK THE HEADER BEFORE
export const checkContentType = (req, res, next) => {
  try {
    validationResult(req).throw();
    header("content-type").exists()
    next()
  } catch (error) {
    error.mapped()
    next(createError(400, {errorsList: {message: "Content-type is not present"}}))
  }
}


export const checkImageUploadRequest = (req, res, next) => {
  // console.log(req.headers)
  try {
    header("content-type").exists()
    check("content-type").exists()
    const errors = validationResult(req)

    if(errors){

    }
    validationResult(req).throw();
    // .bail()
    // .not()
    // .equals("multipart/form-data")
    // .bail()
    next()
  } catch (error) {
    console.log('Error should have thrown')
    next(createError(400, {errorsList: {message: "Content-type must be image"}}))
  }
}