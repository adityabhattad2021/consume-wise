import { AIMessage, BaseMessage, HumanMessage } from "@langchain/core/messages";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { StateGraph } from "@langchain/langgraph";
import { Annotation } from "@langchain/langgraph";
import { tool } from "@langchain/core/tools";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { MongoDBSaver } from "@langchain/langgraph-checkpoint-mongodb";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { MongoClient } from "mongodb";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { z } from "zod";


export async function callAgent(client: MongoClient, query: string, thread_id: string) {

    const embeddings = new GoogleGenerativeAIEmbeddings({
        model: "text-embedding-004", // 768 dimensions
        taskType: TaskType.RETRIEVAL_DOCUMENT,
        title: "Document title",
        apiKey: Bun.env.GOOGLE_API_KEY
    });

    const dbName = "product_database";
    const db = client.db(dbName);
    const collection = db.collection("products");

    const GraphState = Annotation.Root({
        messages: Annotation<BaseMessage[]>({
            reducer: (x, y) => x.concat(y),
        }),
    });

    const productLookupTool = tool(
        async ({ query, n }) => {
            console.log("Product lookup tool called");
    
            const dbConfig = {
                collection: collection,
                indexName: "vector_index",
                textKey: "embedding_text",
                embeddingKey: "embedding",
            };
    
            const vectorStore = new MongoDBAtlasVectorSearch(embeddings, dbConfig);
    
            const result = await vectorStore.similaritySearchWithScore(query, n);
            return JSON.stringify(result);
        },
        {
            name: "product_lookup",
            description: "Gathers details from the product database",
            schema: z.object({
                query: z.string().describe("The search query"),
                n: z.number().describe("Number of results to return"),
            }),
        }
    );
    const tools = [productLookupTool];

    // We can extract the state typing via `GraphState.State`
    const toolNode = new ToolNode<typeof GraphState.State>(tools);

    const llm = new ChatGoogleGenerativeAI({
        model: "gemini-1.5-flash",
        apiKey: Bun.env.GOOGLE_API_KEY,
        verbose: true,
    }).bindTools(tools);


    async function callModel(state: typeof GraphState.State) {
        const prompt = ChatPromptTemplate.fromMessages([
            [
                "system",
                `You are a helpful AI assistant, collaborating with other assistants. Use the provided tools to progress towards answering the question. If you are unable to fully answer, that's OK, another assistant with different tools will help where you left off. Execute what you can to make progress. If you or any of the other assistants have the final answer or deliverable, prefix your response with FINAL ANSWER so the team knows to stop. You have access to the following tools: {tool_names}.\n{system_message}\nCurrent time: {time}.`,
            ],
            new MessagesPlaceholder("messages"),
        ]);

        const formattedPrompt = await prompt.formatMessages({
            system_message: "You are helpful Nutritionist Chatbot Agent.",
            time: new Date().toISOString(),
            tool_names: tools.map((tool) => tool.name).join(", "),
            messages: state.messages,
        });

        const result = await llm.invoke(formattedPrompt);

        return { messages: [result] };
    }


    function shouldContinue(state: typeof GraphState.State) {
        const messages = state.messages;
        const lastMessage = messages[messages.length - 1] as AIMessage;

        // If the LLM makes a tool call, then we route to the "tools" node
        if (lastMessage.tool_calls?.length) {
            return "tools";
        }
        // Otherwise, we stop (reply to the user)
        return "__end__";
    }

    const workflow = new StateGraph(GraphState)
        .addNode("agent", callModel)
        .addNode("tools", toolNode)
        .addEdge("__start__", "agent")
        .addConditionalEdges("agent", shouldContinue)
        .addEdge("tools", "agent");


    const checkpointer = new MongoDBSaver({ client, dbName });

    const app = workflow.compile({ checkpointer });

    const finalState = await app.invoke(
        {
            messages: [new HumanMessage(query)],
        },
        { recursionLimit: 15, configurable: { thread_id: thread_id } }
    );

    console.log(finalState.messages[finalState.messages.length - 1].content);

    return finalState.messages[finalState.messages.length - 1].content;
}


