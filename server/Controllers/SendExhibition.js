import request from 'request';
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
                        "message": `سلام ${req.body.name} عزیز، امیدواریم از بازدیدتان از غرفه کارخانه شیدکو در نمایشگاه ایرانپنکس لذت برده باشید. برای آشنایی بیشتر با محصولات شیدکو، به وب سایت ما مراجعه کنید. www.shidco.org  02188494011`,
                        
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
        console.log(result);
        res.status(200).json(result);

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};
