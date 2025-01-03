package com.alitinart.fml.agent.util;

import java.time.Duration;
import java.util.List;

import dev.langchain4j.data.document.Document;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.model.ollama.OllamaEmbeddingModel;
import dev.langchain4j.rag.content.retriever.ContentRetriever;
import dev.langchain4j.rag.content.retriever.EmbeddingStoreContentRetriever;
import dev.langchain4j.store.embedding.EmbeddingStore;
import dev.langchain4j.store.embedding.EmbeddingStoreIngestor;
import dev.langchain4j.store.embedding.chroma.ChromaEmbeddingStore;
import lombok.Getter;

@Getter
public class EmbeddingUtils {
    private final EmbeddingStore<TextSegment> embeddingStore;
    private final EmbeddingModel embeddingModel;
    private final EmbeddingStoreIngestor ingestor;
    private final ContentRetriever contentRetriever;

    public EmbeddingUtils(
            String collectionName,
            String embeddingModelUrl,
            String storeUrl,
            String embeddingModelName,
            Duration timeout
    ) {
        this.embeddingStore = ChromaEmbeddingStore.builder()
                .baseUrl(storeUrl)
                .collectionName(collectionName)
                .logRequests(true)
                .logResponses(true)
                .timeout(timeout)
                .build();

        this.embeddingModel = OllamaEmbeddingModel.builder()
                .modelName(embeddingModelName)
                .baseUrl(embeddingModelUrl)
                .timeout(timeout)
                .build();

        this.ingestor = EmbeddingStoreIngestor.builder()
                .embeddingStore(embeddingStore)
                .embeddingModel(embeddingModel)
                .build();

        this.contentRetriever = EmbeddingStoreContentRetriever.builder()
                .embeddingModel(embeddingModel)
                .embeddingStore(embeddingStore)
                .build();

    }

    public void ingest(Document document) {
        ingestor.ingest(document);
    }

    public void ingest(List<Document> documents) {
        ingestor.ingest(documents);
    }
}