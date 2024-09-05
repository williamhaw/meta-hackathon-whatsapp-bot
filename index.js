import 'dotenv/config';
import express from 'express';
import twilio from 'twilio';
import { runImageModel, runTextModel } from './models.js';
const app = express();
const port = process.env.PORT || 3000;

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = twilio(accountSid, authToken);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/health', (req, res) => {
    res.send('OK');
});

app.post('/whatsapp', async (req, res) => {
    const incomingMessage = req.body.Body;
    const mediaUrl = req.body.MediaUrl0;
    const from = req.body.From;

    console.log(incomingMessage);
    console.log('Media URL:', mediaUrl);

    let prompt = 'Please explain if the content below is a scam. The response should be in $LANGUAGE and less than 1600 characters long:\n\n';

    // If there's a media URL, it's an image
    if (mediaUrl) {
        try {
            const imageResponse = await runImageModel(mediaUrl, incomingMessage);
            prompt = prompt + `${imageResponse}\n\n`;
            const detectLanguagePrompt = `What is the language of the message below? Reply only with the language, without any description.\n\n${imageResponse}`;
            const languageResponse = await runTextModel(detectLanguagePrompt);
            prompt = prompt.replace('$LANGUAGE', languageResponse);
        } catch (error) {
            console.error('Error analyzing image:', error);
        }
    } else {
        // If there's no media URL, it's a text message
        prompt = prompt + incomingMessage;
        const detectLanguagePrompt = `What is the language of the message below? Reply only with the language, without any description.\n\n${incomingMessage}`;
        const languageResponse = await runTextModel(detectLanguagePrompt);
        prompt = prompt.replace('$LANGUAGE', languageResponse);
    }
    console.log("final prompt:",prompt);
    const textResponse = await runTextModel(prompt);

    // Send the response back to the user
    twilioClient.messages.create({
        body: textResponse,
        from: 'whatsapp:+14155238886',
        to: from
    }).then(message => console.log(message.sid));

    res.sendStatus(200);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
