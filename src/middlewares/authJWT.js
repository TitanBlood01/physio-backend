import jwt from "jsonwebtoken";
import User from "../models/user.js";
import Role from "../models/Role.js";
import dotenv from "dotenv";

dotenv.config()

export const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers["x-access-token"];

        console.log(token)

        if (!token) return res.status(403).json({ message: "No token Provided" })

        const decoded = jwt.verify(token, process.env.SECRET);
        req.userId = decoded.id;
        console.log("Decoded user ID:", req.userId);

        const user = await User.findById(req.userId, { password: 0 })
        console.log("User Found:", user);
        if (!user) return res.status(404).json({ message: "no user found" })
        next()

    } catch (error) {
        return res.status(401).json({message:"Unauthorized"})
    }
};

export const isUser = async (req, res, next) => {
    const user = await User.findById(req.userId);
    const roles = await Role.find({_id: { $in: user.roles } });

    for (let i = 0; i< roles.length; i++) {
        if(roles[i].name === "user") {
            next();
            return;
        }
    }

    return res.status(403).json({ message: "Requiere rol de Usuario"});
};

export const isAdmin = async (req, res, next) => {
    const user = await User.findById(req.userId);
    const roles = await Role.find({_id: { $in: user.roles } });

    for (let i = 0; i< roles.length; i++) {
        if(roles[i].name === "admin") {
            next();
            return;
        }
    }

    return res.status(403).json({ message: "Requiere rol de Admin"});
};

export const isSuperAdmin = async (req, res, next) => {
    const user = await User.findById(req.userId);
    const roles = await Role.find({_id: { $in: user.roles } });

    for (let i = 0; i< roles.length; i++) {
        if(roles[i].name === "superAdmin") {
            next();
            return;
        }
    }

    return res.status(403).json({ message: "Requiere rol de SuperAdmin"});
};

export const isAdminOrSuperAdmin = async (req, res, next) => {
    try {
        const token = req.headers["x-access-token"];
        if (!token) return res.status(403).json({ message: "Token no proporcionado"});

        const decoded = jwt.verify(token, process.env.SECRET);
        req.userId = decoded.id

        const user = await User.findById(req.userId); 
        if (!user) return res.status(404).json({ message: "User not found" });

        const roles = await Role.find({_id: { $in: user.roles } });

        //Check if user has 'admin' or 'superAdmin' role
        for (let role of roles) {
            if (role.name === "admin" || role.name === "superAdmin") {
                return next();
            }
        }

        return res.status(403).json({ message: "Requiere rol de Admin o SuperAdmin"});

    } catch (error) {
        return res.status(401).json({ message: "No autorizado"});
    }
}

export const isAdminOrUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

        const roles = await Role.find({ _id: { $in: user.roles } });

        // Verifica si el usuario tiene el rol 'admin' o 'user'
        for (let role of roles) {
            if (role.name === "admin" || role.name === "user") {
                return next(); // Permite acceso si cumple con alguno de los roles
            }
        }

        return res.status(403).json({ message: "Requiere rol de Admin o Usuario" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
};
