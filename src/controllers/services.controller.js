import cloudinary from "../libs/cloudinary.config.js";
import Service from "../models/services.js";

export const createService = async (req, res) => {
    try {
        const {
            tituloService,
            infoService,
            descriptionService
        } = req.body

        let imageService = "https://res.cloudinary.com/djnufglwv/image/upload/v1735254302/defaults/detszww9dho8aaixt1k6.png";

        if (req.file) {
            imageService = req.file.path;
        }

        const newService = new Service({
            tituloService,
            infoService,
            descriptionService,
            imageService
        })

        const serviceSaved = await newService.save()

        res.status(201).json(serviceSaved)
    } catch (error) {
        if (error.conde === 11000) {
            return res.status(400).json({ message: "El servicio ya esta creado previamente" })
        } else {
            console.error("Error al crear el servicio", error.message);
            return res.status(500).json({ message: "Error al crear el servicio" })
        }
    }
}
export const getServices = async (req, res) => {
    const services = await Service.find()
    res.status(200).json(services)
}


export const getServiceById = async (req, res) => {
    try {
        const service = await Service.findById(req.params.serviceId);

        if (!service) {
            return res.status(404).json({ message: 'Servicio no encontrado ya no realizamos ese servicio' })
        }

        res.status(200).json(service)
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener el servicio' })
    }
}
export const updateServiceById = async (req, res) => {
    try {
        const { serviceId } = req.params;
        const { body, file } = req;

        let imageService;

        if (file) {
            imageService = file.path;
        }

        const existingService = await Service.findById(serviceId);
        if (!existingService) {
            return res.status(404).json({ message: "Servicio no encontrado" })
        }

        if (imageService && existingService.imageService && !existingService.imageService.includes("default-service.jpg")) {
            const publicId = existingService.imageService.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(`default-folder/${publicId}`);
        }

        const updatedService = await Service.findByIdAndUpdate(
            serviceId,
            { ...body, ...(imageService && { imageService }) },
            { new: true }
        )

        res.status(200).json(updatedService)

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al actualizar el servicio" })
    }
}

export const deleteServiceById = async (req, res) => {
    try {
        const { serviceId } = req.params

        const deletedService = await Service.findByIdAndDelete(serviceId)
        if (!deletedService) {
            return res.status(404).json({ message: "Servicio no encontrado" })
        }

        if (deletedService.imageService && !deletedService.imageService.includes("default-service.jpg")) {
            const publicId = deletedService.imageService.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(`default-folder/${publicId}`);
        }

        res.status(200).json({ message: "Servicio eliminado exitosamente", deletedService })

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al eliminar el servicio", error });
    }
}