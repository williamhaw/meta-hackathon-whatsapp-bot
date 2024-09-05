# WhatsApp Scam Detection Bot Demo

This project is a WhatsApp bot that analyzes incoming messages and images to detect potential scams. It uses advanced AI models to process both text and image content, providing users with an explanation of whether the content is likely to be a scam or not.

## Features

- Analyzes both text messages and images sent via WhatsApp
- Utilizes GPT-4 and LLaVA for image analysis
- Uses GPT-4 and LLaMA 3 for text analysis
- Supports multiple languages
- Responds with a detailed explanation about potential scams
- Easy to set up and deploy

## Prerequisites

- Node.js
- npm or yarn
- Twilio account
- Replicate API token
- OpenAI API key

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/whatsapp-scam-detection-bot.git
   cd whatsapp-scam-detection-bot
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory and add your API keys:
   ```
   REPLICATE_API_TOKEN=your_replicate_api_token
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   OPENAI_API_KEY=your_openai_api_key
   IMAGE_MODEL=llava
   TEXT_MODEL=llama
   PORT=8088
   ```

## Usage

1. Start the server:
   ```
   npm start
   ```

2. Set up your Twilio WhatsApp Sandbox to forward messages to your server's `/whatsapp` endpoint.

3. Send a message or image to your Twilio WhatsApp number to test the bot.

## Configuration

You can configure the AI models used for image and text analysis by changing the `IMAGE_MODEL` and `TEXT_MODEL` variables in the `.env` file:

- For image analysis: `gpt4` or `llava`
- For text analysis: `gpt4` or `llama3`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
