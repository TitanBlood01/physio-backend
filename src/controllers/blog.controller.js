import cloudinary from "../libs/cloudinary.config.js";
import blog from "../models/blog.js";
import Blog from "../models/blog.js";
import User from "../models/user.js";


export const createBlog = async (req, res) => {
    try {
        const { 
            tituloBlog, 
            contenidoBlog,  
            videoBlog 
        } = req.body;

        const autorBlog = req.userId; 

        const imagenesBlog = [];
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: "blog-images",
                    resource_type: "image",
                });
                imagenesBlog.push(result.secure_url);
            }
        }

        const newBlog = new Blog({
            tituloBlog,
            contenidoBlog,
            imagenesBlog,
            videoBlog: videoBlog || null,
            autorBlog
        });

        const savedBlog = await newBlog.save();

        res.status(201).json({ message: "Blog creado con exito", blog: savedBlog});
    } catch (error) {
        res.status(500).json({ message: "Error al crear el blog", error });
    }
};

export const getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find()
            .populate({
                path: "autorBlog",
                select: "teamMember",
                populate: {
                    path: "teamMember",
                    select: "nombre apellido posicion"
                }
            })
            .sort({ createdAt: -1});

        res.status(200).json(blogs);
    } catch (error) {
        res.status(500).json({ message:"Error al obtener los blogs", error });
    }
}

export const getBlogById = async (req, res) => {
    try {
        const { blogId } = req.params;
        
        const blog = await Blog.findById(blogId)
        .populate({
            path: "autorBlog",
            select: "teamMember",
            populate: {
                path: "teamMember",
                select: "nombre apellido posicion"
            }
        })
        
        if (!blog) return res.status(404).json({ message: "Blog no encontrado" });
        
        res.status(200).json(blog);
    } catch (error) {
        res.status(500).json({ message:"Error al obtener el blog", error });
    }
}

export const updateBlogById = async (req, res) => {
    try {
        const { blogId } = req.params;
        const { tituloBlog, contenidoBlog, videoBlog, keepImages } = req.body;
        
        const blogToUpdate = await Blog.findById(blogId);
        if (!blogToUpdate) {
            return res.status(404).json({ message: "Blog no encontrado" });
        }

        // Manejar imágenes: Eliminar imágenes antiguas si no se desean conservar
        if (!keepImages || keepImages === "false") {
            if (blogToUpdate.imagenesBlog && blogToUpdate.imagenesBlog.length > 0) {
                for (const imageUrl of blogToUpdate.imagenesBlog) {
                    const publicId = imageUrl.split("/").pop().split(".")[0];
                    await cloudinary.uploader.destroy(`default-folder/${publicId}`);
                }
            }
            blogToUpdate.imagenesBlog = [];
        }

        // Subir nuevas imágenes si se incluyen en la solicitud
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: "blog-images",
                    resource_type: "image",
                });
                blogToUpdate.imagenesBlog.push(result.secure_url);
            }
        }

        blogToUpdate.tituloBlog = tituloBlog || blogToUpdate.tituloBlog;
        blogToUpdate.contenidoBlog = contenidoBlog || blogToUpdate.contenidoBlog;
        blogToUpdate.videoBlog = videoBlog || blogToUpdate.videoBlog;
        
        const updatedBlog = await blogToUpdate.save();

        res.status(200).json({ message: "Blog actualizado con exito", blog: updatedBlog })
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al actualizar el blog", error });
    }
}

export const deleteBlogById = async (req, res) => {
    try {
        const { blogId } = req.params;
        
        const deletedBlog = await Blog.findByIdAndDelete(blogId);

        if (!deletedBlog) return res.status(404).json({ message: "Blog no encontrado" });

        if (deletedBlog.imagenesBlog && deletedBlog.imagenesBlog.length > 0) {
            for (const imageUrl of deletedBlog.imagenesBlog) {
                const publicId = imageUrl.split("/").pop().split(".")[0];
                await cloudinary.uploader.destroy(`default-folder/${publicId}`);
            }
        }

        res.status(200).json({ message: "Blog eliminado con exito"});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al eliminar el blog", error});
    }
};