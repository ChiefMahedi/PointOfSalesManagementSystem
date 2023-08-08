import express from 'express';
import itemRoutes from './routes/itemRoutes'
const app = express();
const PORT = 5000;
app.use(express.json());
app.use('/item', itemRoutes);
app.listen(PORT, ()=>{
    console.log("Server is listening on port:",PORT);
})