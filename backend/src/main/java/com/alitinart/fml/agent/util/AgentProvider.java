package com.alitinart.fml.agent.util;

import com.alitinart.fml.agent.Agent;

import dev.langchain4j.model.chat.StreamingChatLanguageModel;
import dev.langchain4j.rag.content.retriever.ContentRetriever;
import dev.langchain4j.service.AiServices;

public class AgentProvider {
    private AgentProvider() {
    }

    public static <T extends Agent> T from(Class<T> agentClass,
                                           StreamingChatLanguageModel model,
                                           ContentRetriever retriever) {
        return AiServices.builder(agentClass)
                .streamingChatLanguageModel(model)
                .contentRetriever(retriever)
                .build();
    }
}
