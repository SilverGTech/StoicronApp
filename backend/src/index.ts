import express, {Request, Response} from "express";


const app: express.Application = express();
const PORT: number = 3000;

app.get("/health", (req: Request, res: Response) => {
    res.send("Server is running...");
});

/* Middlewares */
app.use(express.json());
app.use(express.urlencoded({extended: true}));


/*Routers*/
import userRouter from "./users/controllers/userRouter";
app.use("/users", userRouter);



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})