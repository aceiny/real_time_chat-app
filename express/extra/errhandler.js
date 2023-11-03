const errhandler = (err,req,res,next) => {
    console.log(err)
    res.status(500).send('Server Breakdown')
}
module.exports = errhandler