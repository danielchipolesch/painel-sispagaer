package br.mil.fab.sispagaer.painel.config;

import jakarta.ws.rs.ApplicationPath;
import jakarta.ws.rs.core.Application;
import org.eclipse.microprofile.openapi.annotations.OpenAPIDefinition;
import org.eclipse.microprofile.openapi.annotations.info.Contact;
import org.eclipse.microprofile.openapi.annotations.info.Info;
import org.eclipse.microprofile.openapi.annotations.info.License;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

/**
 * Configura o contrato OpenAPI (Swagger) da aplicação.
 *
 * <p>Por padrão, a API não exige autenticação. Para habilitar em produção:</p>
 * <ol>
 *   <li>Defina {@code sispagaer.security.enabled=true} no {@code application.properties}.</li>
 *   <li>Restaure os imports e o bloco {@code components} comentado abaixo.</li>
 *   <li>Descomente {@code @SecurityRequirement} em cada Resource.</li>
 *   <li>Injete {@code API_KEY} via Secret do Kubernetes.</li>
 * </ol>
 *
 * <p>Acesse a documentação em: {@code /swagger-ui}</p>
 */
@OpenAPIDefinition(
    info = @Info(
        title = "Painel SISPAGAER — API",
        version = "1.0.0",
        description = """
            API de dados de folha de pagamento do COMAER.

            Fornece endpoints de consulta ao Data Warehouse (DW) de pessoal,
            alimentando o painel analítico do SISPAGAER.

            Autenticação via X-API-Key está desabilitada por padrão (ambiente de desenvolvimento).
            """,
        contact = @Contact(
            name = "Diretoria de Administração da Aeronáutica — DIRAD",
            email = "ouvidoria.dirad@fab.mil.br"
        ),
        license = @License(
            name = "Uso restrito — FAB",
            url = "https://www.fab.mil.br"
        )
    ),
    // PRODUÇÃO: restaure os imports (Components, SecurityScheme, SecuritySchemeIn, SecuritySchemeType)
    // e descomente o bloco abaixo para habilitar o botão "Authorize" no Swagger UI:
    //
    // components = @Components(
    //     securitySchemes = @SecurityScheme(
    //         securitySchemeName = "ApiKey",
    //         type = SecuritySchemeType.APIKEY,
    //         description = "Chave de API. Envie no header X-API-Key.",
    //         apiKeyName = "X-API-Key",
    //         in = SecuritySchemeIn.HEADER
    //     )
    // ),
    tags = {
        @Tag(name = "Folha de Pagamento", description = "Consultas ao fato central do DW: fat_folha_pagamento"),
        @Tag(name = "Dimensões",          description = "Consultas às dimensões do Data Warehouse (postos, OMs, rubricas, tempo)")
    }
)
@ApplicationPath("/api/v1")
public class OpenApiConfig extends Application {
    // Classe de configuração — sem lógica de negócio.
}


