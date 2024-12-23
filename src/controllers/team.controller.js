import Team from "../models/team.js";
Team.createIndexes();

export const createMemberTeam = async (req, res) => {
    try {
        const { nombre, apellido, carnetIdentidad, matriculaProf, experiencia, posicion, isPhysiotherapeust, fotoPerfil, abreviacionCargo } = req.body
        
        const existingMember = await Team.findOne({ carnetIdentidad });
        if (existingMember) {
            return res.status(400).json({ message: "El carnet de identidad ya esta registrado" })
        }
        
        const newMemberTeam = new Team({ nombre, apellido, carnetIdentidad, matriculaProf, experiencia, posicion, abreviacionCargo, isPhysiotherapeust, fotoPerfil })
        const memberTeamSaved = await newMemberTeam.save()
        res.status(201).json(memberTeamSaved)
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "El carnet de identidad ya esta registrado" })
        } else {
            return res.status(500).json({ message: "Error al crear el usuario" })
            
        }

    }

}

export const getTeam = async (req, res) => {
    try {
        const MembersTeam = await Team.find()
        res.status(200).json(MembersTeam)

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener los miembros del equipo", error })
    }
}

export const getMemberTeamById = async (req, res) => {
    try {
        const membersTeam = await Team.findById(req.params.memberTeamId);

        if (!membersTeam) {
            return res.status(404).json({ mesage: 'Miembro del equipo no encontrado' })
        }

        res.status(200).json({
            membersTeam
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error al obtener el miembro del equipo' })
    }
}

export const updateMemberTeamById = async (req, res) => {
    try {
        const { memberTeamId } = req.params;
        const updatedData = {...req.body};

        //Remover el campo `carnetIdentidad` para evitar que sea actualizado
        delete updatedData.carnetIdentidad;
        const updatedMember = await Team.findByIdAndUpdate(memberTeamId, updatedData, {
            new: true
        });

        if (!updatedMember) {
            return res.status(404).json({ message: "Miembro del equipo no encontrado"})
        }
        res.status(200).json(updatedMember) 
        
    } catch (error) {
         console.error(error);
         res.status(500).json({ message: "Error al actualizar el miembro del equipo"})
    }

}

export const deleteMemberTeamById = async (req, res) => {
    try {
        const { memberTeamId } = req.params;
        const deletedMember = await Team.findByIdAndDelete(memberTeamId)

        if (!deletedMember) {
            return res.status(404).json({ message: "Miembro del equipo no encontrado" })
        }

        res.status(200).json({ message: "Miembro del equipo eliminado exitosamente", deletedMember })

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al eliminar el miembro", error });
    }

}