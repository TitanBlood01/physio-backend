import User from "../models/user.js";
import Team from "../models/team.js";
import Role from "../models/Role.js";
import bcrypt from "bcryptjs";

// Crear un nuevo usuario
export const createUser = async (req, res) => {
  const { carnetIdentidad, password, roles } = req.body;

  try {
    // Buscar miembro del equipo asociado al CI
    const teamMember = await Team.findOne({ carnetIdentidad });
    if (!teamMember) {
      return res.status(404).json({ message: "No se encontró un miembro del equipo con ese CI" });
    }

    // Crear usuario
    const newUser = new User({
      teamMember: teamMember._id,
      password: await User.encryptPassword(password),
    });

    // Asignar roles
    if (roles) {
      const foundRoles = await Role.find({ name: { $in: roles } });
      newUser.roles = foundRoles.map((role) => role._id);
    } else {
      const defaultRole = await Role.findOne({ name: "user" });
      newUser.roles = [defaultRole._id];
    }

    await newUser.save();
    res.status(201).json({ message: "Usuario creado exitosamente", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Error al crear el usuario", error });
  }
};

// Obtener todos los usuarios
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().populate("teamMember").populate("roles");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los usuarios", error });
  }
};

// Obtener un usuario por ID
export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate("teamMember").populate("roles");
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el usuario", error });
  }
};

// Actualizar un usuario
export const updateUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const { password, roles } = req.body;

    const updatedData = {};
    if (password) {
      updatedData.password = await User.encryptPassword(password);
    }
    if (roles) {
      const foundRoles = await Role.find({ name: { $in: roles } });
      updatedData.roles = foundRoles.map((role) => role._id);
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.status(200).json({ message: "Usuario actualizado exitosamente", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el usuario", error });
  }
};

// Eliminar un usuario
export const deleteUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.status(200).json({ message: "Usuario eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el usuario", error });
  }
};
