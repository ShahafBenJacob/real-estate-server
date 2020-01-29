const isUser = (req, res, next) => {
    if(req.cookies.auth){
        if(req.cookies.auth.role_id == 2){
            next();
            return;
        }
    }
    res.status(401).json({error: 'Unauthorized'});
}



module.exports = {
    isUser
}