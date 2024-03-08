// #region Imports/const's/Model
import { ChatOpenAI } from "@langchain/openai";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

console.log("hello world");
console.log(process.env.AZURE_OPENAI_API_KEY);

const app = express();
const port = 4000;
app.use(cors());
app.use(bodyParser.json());

//keys to ChatOpenAI
const model = new ChatOpenAI({
  temperature: 1.0,
  azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
  azureOpenAIApiVersion: process.env.OPENAI_API_VERSION,
  azureOpenAIApiInstanceName: process.env.INSTANCE_NAME,
  azureOpenAIApiDeploymentName: process.env.ENGINE_NAME,
});
// #endregion Imports/const's/Model

// #region PromptENGINE
// EXPLAIN THIS!!!!
const startMessages = [
  [
    "system",
    "You are the best tour guide in the world. You can locate all the fun activities and locations in a city. Answer with one short clear sentence. Don't add a large explanation.",
  ],
  ["ai", "Hello! What location are you interested in?"],
  [
    "human",
    "I am interested about all the fun activities you can do in this city.",
  ],
  ["ai", "Of course! Here is some info about the requested city:"],
];
// #endregion PromptENGINE

// #region Get
app.get("/result", async (req, res) => {
  // EXPLAIN THIS!!!!
  const result = await model.invoke(startMessages, { max_tokens: 50 });
  res.send(result.content);
});
// #endregion

// #region Post
app.post("/chat", async (req, res) => {
  // EXPLAIN THIS!!!!
  const { prompt } = req.body;
  startMessages.push(["human", prompt]); //history
  const response = await model.invoke(startMessages);
  startMessages.push(["ai", response.content]); // history
  res.json({ message: response.content });
});
// #endregion

// #region Port
app.listen(port, () => {
  console.log(`port:${port}`);
});
// #endregion Port
