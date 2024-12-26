import Team from "../models/team.js";
import cloudinary from "../libs/cloudinary.config.js";
Team.createIndexes();

export const createMemberTeam = async (req, res) => {
    try {
        const {
            nombre,
            apellido,
            carnetIdentidad,
            matriculaProf = null,
            experiencia,
            posicion,
            abreviacionCargo = "",
            isPhysiotherapeust
        } = req.body

        const experienciaArray = Array.isArray(experiencia) ? experiencia : [experiencia];
        const isPhysiotherapeustBool = JSON.parse(isPhysiotherapeust || "false");

        const existingMember = await Team.findOne({ carnetIdentidad });
        if (existingMember) {
            return res.status(400).json({ message: "El carnet de identidad ya esta registrado" })
        }

        let fotoPerfil = "https://res.cloudinary.com/djnufglwv/image/upload/v1735163192/user_6543634_gk6cs4.png";

        if (req.file) {
            fotoPerfil = req.file.path;
        }


        const newMemberTeam = new Team({
            nombre,
            apellido,
            carnetIdentidad,
            matriculaProf,
            experiencia: experienciaArray,
            posicion,
            abreviacionCargo,
            isPhysiotherapeust: isPhysiotherapeustBool,
            fotoPerfil
        });

        const memberTeamSaved = await newMemberTeam.save()
        res.status(201).json(memberTeamSaved)
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "El carnet de identidad ya esta registrado" })
        } else {
            console.error("Error al crear el usuario:", error.message);
            return res.status(500).json({ message: "Error al crear el usuario" })
        }
    }

}

export const getTeam = async (req, res) => {
    try {
        const membersTeam = await Team.find()
        res.status(200).json(membersTeam)

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener los miembros del equipo", error })
    }
}

export const getMemberTeamById = async (req, res) => {
    try {
        const memberTeam = await Team.findById(req.params.memberTeamId);

        if (!memberTeam) {
            return res.status(404).json({ mesage: 'Miembro del equipo no encontrado' })
        }

        res.status(200).json({
            memberTeam
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error al obtener el miembro del equipo' })
    }
}

export const updateMemberTeamById = async (req, res) => {
    try {
        const { memberTeamId } = req.params;
        const { body, file } = req;

        // Remover el campo `carnetIdentidad` para evitar que sea actualizado
        delete body.carnetIdentidad;

        let fotoPerfil;

        // Si se ha subido una nueva imagen, comprímela antes de actualizar
        if (file) {
            // Reemplazar el campo fotoPerfil con la imagen comprimida
            fotoPerfil = file.path;
        }

         // Buscar el miembro actual en la base de datos
         const existingMember = await Team.findById(memberTeamId);
         if (!existingMember) {
             return res.status(404).json({ message: "Miembro del equipo no encontrado" });
         }
 
         // Si hay una nueva imagen y la anterior no es la predeterminada, eliminar la imagen anterior
         if (fotoPerfil && existingMember.fotoPerfil && !existingMember.fotoPerfil.includes("default-profile.jpg")) {
             const publicId = existingMember.fotoPerfil.split("/").pop().split(".")[0];
             await cloudinary.uploader.destroy(`default-folder/${publicId}`);
         }

        // Buscar y actualizar el miembro del equipo
        const updatedMember = await Team.findByIdAndUpdate(
            memberTeamId,
            { ...body, ...(fotoPerfil && { fotoPerfil }) },
            { new: true }
        );

        res.status(200).json(updatedMember);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al actualizar el miembro del equipo" });
    }
};

export const deleteMemberTeamById = async (req, res) => {
    try {
        const { memberTeamId } = req.params;

        const deletedMember = await Team.findByIdAndDelete(memberTeamId)
        if (!deletedMember) {
            return res.status(404).json({ message: "Miembro del equipo no encontrado" })
        }

        if (deletedMember.fotoPerfil && !deletedMember.fotoPerfil.includes("default-profile.jpg")) {
            const publicId = deletedMember.fotoPerfil.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(`team-images/${publicId}`);
        }

        res.status(200).json({ message: "Miembro del equipo eliminado exitosamente", deletedMember })

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al eliminar el miembro", error });
    }

}