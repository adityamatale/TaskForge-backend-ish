export async function up(client) {
    await client.query(`
        ALTER TABLE tasks
        ADD COLUMN user_id INTEGER
        REFERENCES users(id)
        ON DELETE CASCADE;
    `);
}