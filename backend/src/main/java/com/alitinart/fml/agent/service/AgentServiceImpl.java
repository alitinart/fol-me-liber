package com.alitinart.fml.agent.service;

import com.alitinart.fml.agent.BookAgent;
import com.alitinart.fml.agent.domain.EventDto;
import com.alitinart.fml.agent.domain.QuestionDto;
import com.alitinart.fml.agent.util.AgentProvider;
import com.alitinart.fml.agent.util.EmbeddingUtils;
import com.alitinart.fml.book.collection.domain.Book;
import com.alitinart.fml.book.collection.repo.BookRepo;
import com.alitinart.fml.exception.MissingParameterException;
import com.alitinart.fml.exception.NotFoundException;
import com.alitinart.fml.exception.PdfReadingException;
import com.alitinart.fml.exception.ScanningException;

import org.apache.logging.log4j.util.Strings;
import org.apache.pdfbox.multipdf.Splitter;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDDocumentInformation;
import org.apache.pdfbox.rendering.ImageType;
import org.apache.pdfbox.rendering.PDFRenderer;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import javax.imageio.ImageIO;
import java.awt.Graphics2D;
import java.awt.Image;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;

import dev.langchain4j.data.document.Document;
import dev.langchain4j.data.document.Metadata;
import dev.langchain4j.model.chat.StreamingChatLanguageModel;
import dev.langchain4j.model.ollama.OllamaStreamingChatModel;
import dev.langchain4j.service.TokenStream;
import lombok.extern.slf4j.Slf4j;
import net.sourceforge.tess4j.Tesseract;
import net.sourceforge.tess4j.TesseractException;

@Service
@Slf4j
public class AgentServiceImpl implements AgentService {
    private static final Integer MAX_PERCENTAGE = 100;
    private final BookRepo bookRepo;
    private final StreamingChatLanguageModel model;
    private final String modelUrl;
    private final String modelName;
    private final String embeddingModelName;
    private final String tesseractDatapath;
    private final String storeUrl;

    @Autowired
    public AgentServiceImpl(
            @Value("${fml.ai.ollama.model.url}") String modelUrl,
            @Value("${fml.ai.ollama.model.name}") String modelName,
            @Value("${fml.ai.ollama.embedding.model.name}") String embeddingModelName,
            @Value("${fml.tesseract.datapath}") String tesseractDataPath,
            @Value("${fml.chroma.url}") String storeUrl,
            BookRepo bookRepo) {
        this.modelUrl = modelUrl;
        this.modelName = modelName;
        this.model = OllamaStreamingChatModel.builder()
                .modelName(modelName)
                .baseUrl(modelUrl)
                .timeout(Duration.ofMinutes(10))
                .temperature(0.4)
                .build();
        this.embeddingModelName = embeddingModelName;
        this.tesseractDatapath = tesseractDataPath;
        this.storeUrl = storeUrl;
        this.bookRepo = bookRepo;
    }

    @Override
    public void ask(QuestionDto questionDto, SseEmitter emitter) {
        Optional<Book> optionalBook = bookRepo.findById(questionDto.getCollectionId());
        if (optionalBook.isEmpty()) {
            throw new NotFoundException("No collection with that name");
        }

        EmbeddingUtils embeddingUtils = new EmbeddingUtils(questionDto.getCollectionId(), modelUrl, storeUrl, embeddingModelName, Duration.ofMinutes(30));
        BookAgent agent = AgentProvider.from(BookAgent.class, model, embeddingUtils.getContentRetriever());

        Book book = optionalBook.get();
        book.setLastUsed(LocalDateTime.now());
        bookRepo.save(book);

        TokenStream assistantResponse = agent.ask(questionDto.getUserQuestion());

        assistantResponse
                .onNext(t -> {
                    try {
                        emitter.send(SseEmitter.event().name(questionDto.getGuid()).data(new EventDto(t)));
                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    }
                })
                .onComplete((t) -> emitter.complete())
                .onError((t) -> {
                    log.error(t.getMessage(), t);
                    emitter.completeWithError(t);
                })
                .start();
    }

    @Override
    public Book ingestBook(MultipartFile file, String collectionName, String bookTitle, String guid, SseEmitter emitter) {
        if (file.isEmpty()) {
            throw new MissingParameterException("File cannot be null");
        }
        EmbeddingUtils embeddingUtils = null;
        Book book = null;

        try (
                InputStream inputStream = file.getInputStream();
                PDDocument pdf = PDDocument.load(inputStream)
        ) {
            Splitter splitter = new Splitter();

            List<PDDocument> pdfSplits = splitter.split(pdf);
            book = saveBookCollection(bookTitle, collectionName, pdf, pdfSplits.get(0));
            embeddingUtils = new EmbeddingUtils(book.getId(), modelUrl, storeUrl, embeddingModelName, Duration.ofMinutes(30));

            for (int i = 0; i < pdfSplits.size(); i++) {
                PDDocument pdfSplit = pdfSplits.get(i);
                Optional<Document> doc = Optional.ofNullable(parseSplit(i, pdfSplit));

                float progress = (((float) i) / pdf.getNumberOfPages()) * 100;
                emitter.send(SseEmitter.event().name(guid).data(progress));

                doc.ifPresent(embeddingUtils::ingest);
            }

            emitter.send(SseEmitter.event().name(guid).data(MAX_PERCENTAGE));
        } catch (Exception e) {
            rollback(embeddingUtils, book.getId());
            log.error("Error while ingesting book", e);
            throw new PdfReadingException(e.getMessage(), emitter);
        }

        return book;
    }

    private void rollback(EmbeddingUtils embeddingUtils, String id) {
        if (!Objects.isNull(embeddingUtils)) {
            embeddingUtils.getEmbeddingStore().removeAll();
        }
        if (!Objects.isNull(id)) {
            bookRepo.deleteById(id);
        }
    }

    private Book saveBookCollection(String title, String collectionName, PDDocument document, PDDocument firstPage) throws IOException {
        PDFRenderer pr = new PDFRenderer(firstPage);
        File pageImage = new File("temp_first_page.png");

        BufferedImage bi = pr.renderImageWithDPI(0, 400, ImageType.RGB);
        ImageIO.write(scaleImage(bi, 100, 150), "png", pageImage);

        String base64Image = "data:image/png;base64," + Base64.getEncoder().encodeToString(Files.readAllBytes(pageImage.toPath()));
        Book collection = new Book(
                title,
                collectionName,
                document.getNumberOfPages(),
                base64Image,
                LocalDateTime.now()
        );

        Book bc = bookRepo.save(collection);
        return bc;
    }

    private Document parseSplit(Integer pageNumber, PDDocument pdfSplit) throws IOException {
        Metadata metadata = metadataExtract(pageNumber, pdfSplit);

        PDFTextStripper textStripper = new PDFTextStripper();
        String text = textStripper.getText(pdfSplit);

        if (Strings.isBlank(text)) {
            return null;
        }
        return new Document(text, metadata);
    }

    private Metadata metadataExtract(Integer pageNumber, PDDocument pdfSplit) {
        PDDocumentInformation pdfInfo = pdfSplit.getDocumentInformation();
        Set<String> metadataKeys = pdfInfo.getMetadataKeys();

        Metadata metadata = new Metadata();
        for (String key :
                metadataKeys) {
            Optional<String> keyValue = Optional.ofNullable(pdfInfo.getCustomMetadataValue(key));
            keyValue.ifPresent(s -> metadata.put(key, s));
        }
        metadata.put("page", pageNumber);

        return metadata;
    }

    private BufferedImage scaleImage(BufferedImage image, int newW, int newH) {
        Image tmp = image.getScaledInstance(newW, newH, Image.SCALE_SMOOTH);
        BufferedImage resized = new BufferedImage(newW, newH, BufferedImage.TYPE_INT_ARGB);

        Graphics2D g2d = resized.createGraphics();
        g2d.drawImage(tmp, 0, 0, null);
        g2d.dispose();

        return resized;
    }
}
