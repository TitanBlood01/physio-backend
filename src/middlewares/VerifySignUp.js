import { Roles } from "../models/Role.js";
import User from "../models/user.js";
import Team from "../models/team.js";

export const checkDuplicateCI = async (req, res, next) => {
    try {
        const teamMember = await Team.findOne({carnetIdentidad: req.body.carnetIdentidad})
        
        if (teamMember) {
            const user = await User.findOne({ci: req.body.carnetIdentidad})
            if (user) {
                return res.status(400).json({message:"El usuario ya existe"})
            }
        }    
        next()
    } catch (error) {
        return res.status(500).json({ message: "Error en la validacion de CI", error: error.message})    
    }
}

export const checkRolesExisted = (req, res, next) => {
    if (req.body.roles) {
        for (let i=0; i<req.body.roles.lenght; i++) {
            if(!Roles.includes(req.body.roles[i])) {
                return res.status (400).json({
                    message: `Role ${req.body.roles[i]} no existe`
                })
            }
        }
    } 

    next()
}

