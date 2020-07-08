import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export function auth(req: Request, res: Response, next: NextFunction) {
    console.log(req)
    console.log('-------------')
    const token = req.header("auth-token");

    try{
        if (!token) return res.status(401).send("Acces Denied");
        const verified= jwt.verify(token,process.env.TOKEN_SECRET!);
        req.user=verified;
        return next();
    }catch(err){
        return res.status(400).send("Invalid Token");
    }
}
