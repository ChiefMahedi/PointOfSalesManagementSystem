import express from 'express';;
import customerRoutes from './routes/customerRoutes';
import cookieParser from 'cookie-parser'
import transactionRoutes from './routes/transactionRoute';
import adminRoutes from './routes/adminRoutes';
const app = express();
const PORT = 5000;
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded());
app.use('/customer', customerRoutes);
app.use('/transaction', transactionRoutes);
app.use('/admin',adminRoutes)
app.listen(PORT, ()=>{
    console.log("Server is listening on port:",PORT);
})

