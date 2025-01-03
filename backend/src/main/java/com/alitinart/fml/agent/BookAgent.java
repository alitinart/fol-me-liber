package com.alitinart.fml.agent;

import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.TokenStream;

public interface BookAgent extends Agent {
    @Override
    @SystemMessage("""
            Your job is to answer to the user. Only answer according to the book you were given.
            If you don't understand the question ask the user to re ask.
            Respond in the language the question was asked in.
            Always cite the page where you based your answer from. You can get the page number from the metadata.
            You can write in Markdown to format the text
            """)
    TokenStream ask(String userQuery);
}
