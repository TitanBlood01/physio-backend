import User from "../models/user.js";
import Team from "../models/team.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Role from "../models/Role.js";

dotenv.config();

export const signUp = async (req, res) => {

    const { teamMember, password, roles } = req.body;

    const newUser = new User({
        teamMember,
        password: await User.encryptPassword(password),
        roles
    })

    if (teamMember) {
        const foundTeam = await Team.findOne({ carnetIdentidad: teamMember });
        if (!foundTeam) {
            return res.status(404).json({ message: "No se encontró un miembro del equipo con ese CI" });
        }
        newUser.teamMember = foundTeam._id
    } else {
        return res.status(400).json({ message: "El CI del miembro del equipo es obligatorio" });
    } if (roles) {
        const foundRoles = await Role.find({ name: { $in: roles } });
        newUser.roles = foundRoles.map(role => role._id)
    } else {
        const role = await Role.findOne({ name: "user" });
        if (!role) return res.status(500).json({ message: "Rol por defecto 'user' no encontrado" });
        newUser.roles = [role._id];
    }

    try {
        const savedUser = await newUser.save();
        const token = jwt.sign(
            {
                id: savedUser._id,
                role: savedUser.roles[0],
            },
            process.env.SECRET,
            {
                expiresIn: 86400,
            }
        )
        res.status(200).json({ success: true, data: { token } })
    } catch (error) {
        return res.status(500).json({ message: "Error al guardar el usuario", error });
    }


}

export const signIn = async (req, res) => {
    const { teamMember, password } = req.body;
  
    try {
      // Buscar al miembro del equipo
      const teamMemberF = await Team.findOne({ carnetIdentidad: teamMember });
      console.log("Miembro del equipo encontrado:", teamMemberF);
      if (!teamMemberF) return res.status(404).json({ message: "No se encontró un miembro del equipo con ese CI" });
  
      // Buscar usuario asociado al miembro del equipo
      const userFound = await User.findOne({ teamMember: teamMemberF._id }).populate("roles");
      console.log("Usuario asociado encontrado:", userFound);
      if (!userFound) return res.status(400).json({ message: "Usuario no encontrado" });

      if (!userFound.roles) 
        return res.status(400).json({ message: "Rol no definido para el usuario" });

      // Comparar contraseñas
      const matchPassword = await User.comparePassword(password, userFound.password);
      if (!matchPassword) return res.status(401).json({ token: null, message: "Contraseña Incorrecta" });
  
      // Generar token
      const token = jwt.sign(
        {
          id: userFound._id,
          role: userFound.roles[0]?.name,
        },
        process.env.SECRET,
        {
          expiresIn: 86400, // 24 horas
        }
      );
  
      // Responder con datos del usuario
      const response = {
        token,
        userId: userFound._id,
        nombre: teamMemberF.nombre,
        apellido: teamMemberF.apellido,
        posicion: teamMemberF.posicion,
        role: userFound.roles[0]?.name || "Sin rol definido",
      };
  
      res.status(200).json(response);
    } catch (error) {
        console.error("Error en signIn;", error);
        res.status(500).json({ message: "Error al iniciar sesión", error });
    }
  };

export const createSuperAdmin = async (req, res) => {
    try {
        const {password} = req.body;

        if (req.body.secretKey !== process.env.SUPERADMIN_SECRET) {
            return res.status(403).json({ message: "Clave secreta invalida"});
        }

        const existingSuperAdmin = await User.findOne({ roles: await Role.findOne({ name: "superAdmin"}) });
        if (existingSuperAdmin) {
            return res.status(400).json({ message: "El superAdmin ya existe" });
        }

        let superAdminRole = await Role.findOne({ name: "superAdmin"});
        if (!superAdminRole) {
            superAdminRole = await Role.create({ name: "superAdmin" });
        }

        const newSuperAdmin = new User({
            password: await User.encryptPassword(password),
            roles: superAdminRole._id,
        });

        await newSuperAdmin.save();
        res.status(201).json({ message: "Superadmin creado exitosamente"})
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al crear el superadmin", error});
    }
}

export const superAdminSignIn = async (req, res) => {
    try {
        const { secretKey, password } = req.body;
        console.log("SECRET_KEY:", process.env.SUPERADMIN_SECRET);

        // Verificar la clave secreta
        if (secretKey !== process.env.SUPERADMIN_SECRET) {
            return res.status(403).json({ message: "Clave secreta inválida" });
        }

        // Buscar al SuperAdmin
        const superAdminRole = await Role.findOne({ name: "superAdmin" });
        console.log("superAdminRole", superAdminRole);
        if (!superAdminRole) {
            return res.status(500).json({ message: "El rol 'superAdmin' no está configurado" });
        }

        const superAdmin = await User.findOne({ roles: superAdminRole._id });
        console.log("superAdmin", superAdmin);
        if (!superAdmin) {
            return res.status(404).json({ message: "SuperAdmin no encontrado" });
        }

        // Verificar contraseña
        const isPasswordValid = await User.comparePassword(password, superAdmin.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }

        // Generar token
        const token = jwt.sign(
            {
                id: superAdmin._id,
                role: "superAdmin",
            },
            process.env.SECRET,
            { expiresIn: 86400 }
        );

        res.status(200).json({
            token,
            message: "Inicio de sesión exitoso",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al autenticar al SuperAdmin", error });
    }
};
