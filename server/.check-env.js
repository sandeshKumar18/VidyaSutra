const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

console.log("---------------------------------------------------");
console.log("Current Working Directory:", process.cwd());
console.log("Script Directory (__dirname):", __dirname);
console.log("---------------------------------------------------");

// 1. Check if .env exists physically
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
    console.log(" FOUND .env file at:", envPath);
    
    // 2. Read raw content to check for hidden characters/encoding issues
    const rawContent = fs.readFileSync(envPath, 'utf8');
    console.log("Raw Content Length:", rawContent.length);
    console.log(" First 15 chars:", JSON.stringify(rawContent.substring(0, 15)));
    
    // 3. Try to parse it with dotenv
    const result = dotenv.config({ path: envPath });
    
    if (result.error) {
        console.log("Dotenv Error:", result.error);
    } else {
        console.log("Dotenv parsed successfully!");
        console.log("MONGO_URI value:", process.env.MONGO_URI ? "LOADED OK" : "UNDEFINED");
    }
} else {
    console.log(".env file NOT FOUND in this folder.");
    console.log("   Files actually present here:");
    fs.readdirSync(__dirname).forEach(file => {
        console.log("   - " + file);
    });
}
console.log("---------------------------------------------------");