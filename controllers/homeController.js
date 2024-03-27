export const homeController = async(req,res)=>{
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

export const adminHomeController = async (req, res) => {
  
    try {
        // Check if the user is an admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ authenticated: false, message: 'Forbidden' });
        }
        return res.status(200).json({ authenticated: true });
    } catch (error) {
        return res.status(500).json({
            authenticated: false,
            message: 'Internal Server Error',
        });
    }
}