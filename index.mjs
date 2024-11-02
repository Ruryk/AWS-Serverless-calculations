import { Jimp, JimpMime } from 'jimp';

export const handler = async (event) => {
    try {
        const { image, format } = JSON.parse(event.body);

        if (!['bmp', 'png', 'gif'].includes(format)) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Invalid format specified." })
            };
        }

        const imageBuffer = Buffer.from(image, 'base64');
        const jimpImage = await Jimp.read(imageBuffer);

        let mimeType;
        switch (format) {
            case 'bmp':
                mimeType = JimpMime.bmp;
                break;
            case 'png':
                mimeType = JimpMime.png;
                break;
            case 'gif':
                mimeType = JimpMime.gif;
                break;
            default:
                mimeType = JimpMime.png;
                break;
        }

        const convertedBuffer = await jimpImage.getBuffer(mimeType);

        return {
            statusCode: 200,
            body: JSON.stringify({
                convertedImage: convertedBuffer.toString('base64'),
                message: `Image converted to ${ format } successfully.`
            })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Error converting image", error: error.message })
        };
    }
};
