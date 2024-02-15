
const clearHash=require("./../services/cache")

const clearMw=async (req,res,next)=>
   {
     await next()
     clearHash(req.user.id)
   }


module.exports=clearMw