import Files from "../../Models/Files.js";
export const fileUploader = async (req, res) => {
    try {
        const userEmail = req.body.user;
        const newFile = new Files({
            file: req.file.buffer,
            user: userEmail,
        });
        await newFile.save();

        res.status(201).send('file uploaded successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};