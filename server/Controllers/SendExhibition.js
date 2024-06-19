import request from 'request';
import ExhibitionUser from '../Models/ExhibitionUser.js';
export const SendExhibition = async (req, res) => {
    try {
        console.log(req.body)
        const sendRequest = () => {
            return new Promise((resolve, reject) => {
                request.post({
                    url: 'http://ippanel.com/api/select',
                    body: {
                        "op": "send",
                        "uname": "09129348033",
                        "pass": "Shidco@2024",
                        "message": `سلام ${req.body.name} عزیز  ضمن عرض تشکر از بازدید شما از غرفه کارخانه شیدکو در نمایشگاه ایرانپنکس ، لطفا برای آشنایی بیشتر با محصولات شیدکو ، به وبسایت ما مراجعه کنید. www.shidco.org 02188494011`,
                        
                        "from": "+983000505",
                        "to": [`${req.body.phone}`],
                    },
                    json: true,
                }, (error, response, body) => {
                    if (!error && response.statusCode === 200) {
                        resolve(response.body);
                    } else {
                        reject(error || new Error(`Request failed with status ${response.statusCode}`));
                    }
                });
            });
        };

        const result = await sendRequest();
        const responseNd = await ExhibitionUser.create({
            PhoneNumber: req.body.phone,
            Name : req.body.name
        })
        res.status(200).json(result);

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};
