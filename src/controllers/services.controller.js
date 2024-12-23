import Service from "../models/services.js";

export const createService = async (req, res) => {
    const { tituloService, infoService, descriptionService , imageService } = req.body

    const newService = new Service({
        tituloService, infoService, descriptionService, imageService 
    })

    const serviceSaved = await newService.save()

    res.status(201).json(serviceSaved)
}
export const getServices = async (req, res) => {
    const services = await Service.find()
    res.status(200).json(services)
}
export const getServiceById = async (req, res) => {
    try {
        const service = await Service.findById(req.params.serviceId);

        if (!service) {
            return res.status(404).json({message: 'Servicio no encontrado ya no realizamos ese servicio'})
        }

        res.status(200).json(service)
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Error al obtener el servicio'})
    }
}
export const updateServiceById = async (req, res) => {
    const updatedService = await Service.findByIdAndUpdate(req.params.serviceId, req.body, {
        new: true
    })
    res.status(200).json(updatedService)
}

export const deleteServiceById = async (req, res) => {
    const{serviceId} = req.params
    await Service.findByIdAndDelete(serviceId)
    res.status(204).json()
}