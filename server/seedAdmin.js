import bcrypt from 'bcrypt';
import pool from './config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const seedAdmin = async () => {
    try {
        const name = process.env.name;
        const email = process.env.email;
        const plainPassword = process.env.plainPassword;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(plainPassword, salt);

        const [existing] = await pool.query(
            'SELECT id FROM admin WHERE email = ?',
            [email]
        )

        if (existing.length > 0) {
            console.log(`Admin already exist. Skipping seeding`);

            process.exit(0);
        }

        await pool.query(
            'INSERT INTO admins(name, email, password_hash) VALUES (?,?,?)',
            [name, email, hashedPassword]
        );

        console.log(`Admin seeded successfully!`);
        console.log(` Email: ${email}`);
        console.log(` Password: ${plainPassword}`);
        process.exit(0);
    }

    catch (error) {
        console.error(`Seeding failed : `, error.message);
        process.exit(1);
    }
}

seedAdmin();