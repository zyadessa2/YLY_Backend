import { app } from "./bootstrap";
if (process.env.NODE_ENV !== "production") {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log("Server running on port", port);
    });
}
export default app;
//# sourceMappingURL=index.js.map