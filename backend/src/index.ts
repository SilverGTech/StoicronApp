import express, {Request, Response} from "express";

const app: express.Application = express();
const PORT: number = 3000;

app.get("/health", (req: Request, res: Response) => {
    res.send("Server is running...");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})