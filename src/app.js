import express from "express";
import morgan from "morgan";
import servicesRoutes from "./routes/services.routes.js";
import blogRoutes from "./routes/blog.routes.js";
import teamRoutes from "./routes/team.routes.js";
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import cors from "cors";
import { createRoles } from "./libs/initialSetup.js";

const app = express()

app.use(cors());

createRoles();

app.use(morgan('dev'));
app.use(express.json())

app.get('/', (req, res) =>{
    res.json({
        message: 'Bienvenido al servidor de Physio Active',
        author: 'Jose Ernesto Castro Alvis',
        status: 'Online',
    })
})


app.use('/api/services', servicesRoutes)
app.use('/api/team', teamRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/blog', blogRoutes)
export default app;