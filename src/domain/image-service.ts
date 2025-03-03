import {DataSource} from "typeorm/data-source/DataSource";
import {R2} from 'node-cloudflare-r2';
import multer from 'multer';
import fs from 'fs';

export class ImageService {
    private bucket;
    private upload;

    constructor(private readonly db: DataSource) {

        // Configuration du client Cloudflare R2
        const r2 = new R2({
            accountId: "caa6c6a851c36756c3efa2578fdc46d3",
            accessKeyId: "5ea8356afe43f61a5ea510e0bf8516ea",
            secretAccessKey: "a03976f622a83be304ad46f4676e491ef2aded0c92c7bf9feb72c1134f677db7"
        });
        this.bucket = r2.bucket("cinema-js-images");

        // Configuration du stockage local via Multer
        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, '/Users/ethan/Documents/dev/TwitterClone_Server/src/images');
            },
            filename: function (req, file, cb) {
                cb(null, file.fieldname + '-' + Date.now());
            }
        });

        this.upload = multer({storage: storage});
    }

    // Middleware Multer pour l'upload
    getMulterMiddleware() {
        return this.upload.single('image');
    }

    // Méthode d'upload vers Cloudflare R2
    async uploadImage(localPath: string, originalName: string): Promise<string | Error> {
        try {
            const uploadResult = await this.bucket.uploadFile(localPath, originalName);
            fs.unlinkSync(localPath);

            return uploadResult.objectKey;
        } catch (error: any) {
            console.error('Upload Error:', error);
            return new Error('Internal server error');
        }
    }
}