import Files from "../../Models/Files.js";

export const getFilesUser = async(req, res) => {
    try {
        const user = req.body.user;
        const file = await Files.findOne({ user: user });

        if (!file) {
            return res.status(404).send('File not found');
        }

        res.setHeader('Content-Disposition', 'attachment; filename=file.pdf');
        res.setHeader('Content-Type', 'application/pdf');
        res.send(file.file);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};
