

export default {
    dialect: "postgresql",
    schema: "./src/models/schema.js",
    out: "./drizzle",
    dbCredentials: {
        url: process.env.DATABASE_URL ?? "postgresql://school_user:school_pass@localhost:5433/schoolos",
    },
};