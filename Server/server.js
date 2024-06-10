// #region Imports/const's/Model
import { ChatOpenAI } from "@langchain/openai";
import express, { response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import Anthropic from "@anthropic-ai/sdk";

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
const messages = [
  [
    "system",
    "You are the best tour guide in the world. You can locate all the fun activities and locations in a city. Answer with three clear sentences. Don't add a large explanation. Give more then 3 options",
  ],
  ["ai", "Hello! What location are you interested in?"],
  [
    "human",
    "I am interested about all the fun activities you can do in this city.",
  ],
  ["ai", "Of course! Here is some info about the requested city:"],
];

const movieMessages = [
  [
    "system",
    "your the best at recommending movies to other people. Yoe give a very short but detailed explanation of what movie you would recommend. Answer with five clear sentences. Give more then 3 options",
  ],
];
// #endregion PromptENGINE

// #region Get
app.get("/result", async (req, res) => {
  // EXPLAIN THIS!!!!
  const result = await model.invoke(messages, { max_tokens: 50 });
  res.send(result.content);
});
// #endregion

// #region Post
app.post("/chat", async (req, res) => {
  // EXPLAIN THIS!!!!
  const { prompt } = req.body;
  messages.push(["human", prompt]); //history
  const response = await model.invoke(messages);
  messages.push(["ai", response.content]); // history
  res.json({ message: response.content });
});
// #endregion

//#region Movie API Intergration
const apiKey = process.env.MOVIE_API_KEY;
let firstTime = true;

const movieAPI = async (movie) => {
  const query = new URLSearchParams(`t=${movie}`).toString(); //EXPLAIN THIS!!!
  const apiUrl = `http://www.omdbapi.com/?apikey=${apiKey}&${query}`;
  const response = await fetch(apiUrl);
  const result = await response.json();
  return result;
};

app.post("/movies", async (req, res) => {
  const { moviePrompt } = req.body;
  if (firstTime) {
    // EXPLAIN THIS!!!
    const movie = await movieAPI(moviePrompt);
    const promptQuestion = `Can you recommend me a movie with the same Metascore as the movie ${movie.Title}? The movie has a Metascore of ${movie.Metascore}`;
    movieMessages.push(["human", promptQuestion]); //history
  } else {
    movieMessages.push(["human", moviePrompt]);
  }
  const result = await model.invoke(movieMessages, { max_tokens: 50 });
  movieMessages.push(["ai", result.content]);
  firstTime = false;

  res.send({ message: result.content });
});
//#endregion Movie API Intergration

// #region LLM Claude
const anthropic = new Anthropic({
  apiKey: process.env["ANTHROPIC_API_KEY"],
});

const storyMSG = [];
app.post("/story", async (req, res) => {
  storyMSG.push({
    role: "user",
    content: [
      {
        type: "text",
        text: req.body.storyPrompt,
      },
    ],
  });
  console.log(storyMSG);

  const msg = await anthropic.messages.create({
    model: "claude-3-opus-20240229",
    max_tokens: 100,
    system:
      "You are an AI assistant with a passion for creative writing and storytelling. Your task is to collaborate with users to create engaging stories, offering imaginative plot twists and dynamic character development. Encourage the user to contribute their ideas and build upon them to create a captivating narrative.",
    messages: storyMSG,
  });
  console.log(msg);
  storyMSG.push({ role: "assistant", content: msg.content[0].text });
  res.json(msg.content[0].text);
});
// #endregion

// #region Port
app.listen(port, () => {
  console.log(`port:${port}`);
});
// #endregion Port
