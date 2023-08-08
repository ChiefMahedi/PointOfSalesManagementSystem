import express from 'express';;
import itemRoutes from './routes/itemRoutes';
import customerRoutes from './routes/customerRoutes';
const app = express();
const PORT = 5000;
app.use(express.json());
app.use(express.urlencoded());
app.use('/item', itemRoutes);
app.use('/customer', customerRoutes);
app.listen(PORT, ()=>{
    console.log("Server is listening on port:",PORT);
})