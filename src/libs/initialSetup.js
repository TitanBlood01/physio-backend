import Role from "../models/Role.js";

export const createRoles = async () => {
    try {
        const roles = ["user", "admin", "superAdmin"];

        for (const role of roles) {
            const exists = await Role.findOne({ name: role });
            if (!exists) {
                await new Role({ name: role }).save();
                console.log(`Role '${role}' created`);
            } else {
                console.log(`Role '${role}' already exists`);
            }
        }
    } catch (error) {
        console.error("Error creating roles:", error);
    }
};
