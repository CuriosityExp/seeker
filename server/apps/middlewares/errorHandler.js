const errorHandler = (err,req,res,next)=>{
    console.log(err)
    if (err.name === 'CustomError') {
        res.status(err.status).json({message: err.message})
    }else{
        res.status(500).json({message: "Internal Server Error"})
    }
}

module.exports = errorHandler