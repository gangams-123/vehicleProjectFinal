import app from "./app.js";
import { sequelize } from "./models/index.js";

const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true }).then(() => {
  console.log("Database synced");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});