import blog from "../models/blog.js";
import Blog from "../models/blog.js";
import User from "../models/user.js";

export const createBlog = async (req, res) => {
    try {
        const { tituloBlog, contenidoBlog, imagenesBlog, videoBlog } = req.body;

        const autorBlog = req.userId; 

        const newBlog = new Blog({
            tituloBlog,
            contenidoBlog,
            imagenesBlog: Array.isArray(imagenesBlog) ? imagenesBlog : [imagenesBlog],
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
        const { tituloBlog, contenidoBlog, imagenesBlog, videoBlog } = req.body;
        
        const updateBlog = await Blog.findByIdAndUpdate(
            blogId,
            { 
                tituloBlog, 
                contenidoBlog, 
                imagenesBlog : Array.isArray(imagenesBlog) ? imagenesBlog : [imagenesBlog], 
                videoBlog },
            { new: true }
        );
        
        if (!updateBlog) return res.status(404).json({ message: "Blog no encontrado" });
        
        res.status(200).json({ message: "Blog actualizado con exito", blog: updateBlog })
        
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el blog", error });
    }
}

export const deleteBlogById = async (req, res) => {
    try {
        const { blogId } = req.params;
        
        const deletedBlog = await Blog.findByIdAndDelete(blogId);

        if (!deletedBlog) return res.status(404).json({ message: "Blog no encontrado" });

        res.status(200).json({ message: "Blog eliminado con exito"});
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el blog", error});
    }
};