import fs from 'fs/promises';
import path from 'path';

export const loadEmailTemplate = async (templateName: string, replacements: Record<string, string>) => {
    const filePath = path.join(process.cwd(), 'src', 'templates', templateName);
    let html = await fs.readFile(filePath, 'utf8');

    // Simple placeholder replacement: {{key}}
    for (const [key, value] of Object.entries(replacements)) {
        html = html.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }

    return html;
};
