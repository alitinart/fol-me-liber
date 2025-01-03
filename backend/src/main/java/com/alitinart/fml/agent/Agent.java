package com.alitinart.fml.agent;

import dev.langchain4j.service.TokenStream;

public interface Agent {
    TokenStream ask(String userQuery);
}
