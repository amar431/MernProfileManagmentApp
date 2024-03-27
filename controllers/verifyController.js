export const verifyController = async(req,res)=>{
    if(!req.user){
        return res.status(401).json({ authenticated: false });
    }
    try {
        return res.status(200).json({authenticated:true})
    } catch (error)  {
        return res.status(500).json({
          authenticated: false,
          message: 'Internal Server Error',
        });
    }
}