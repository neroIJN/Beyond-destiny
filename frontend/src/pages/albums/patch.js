const fs = require('fs');
const path = require('path');

const dir = 'd:/Antigravity/captured-moments/frontend/src/pages/albums';

const regex = /<div key=\{index\} className="album-item">([\s\S]*?)<\/div>\s*<\/div>/g;
const replace = `<motion.div 
                                    key={index} 
                                    className="album-item"
                                    initial={{ y: 50, opacity: 0 }}
                                    whileInView={{ y: 0, opacity: 1 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ duration: 0.8, delay: (index % 3) * 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                                >$1</div>
                                </motion.div>`;

fs.readdirSync(dir).forEach(file => {
    if (file.endsWith('.jsx')) {
        const filePath = path.join(dir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        let newContent = content.replace(regex, replace);
        if (newContent !== content) {
            fs.writeFileSync(filePath, newContent);
            console.log(`Updated ${file}`);
        }
    }
});
console.log('Finished processing JSX files.');
