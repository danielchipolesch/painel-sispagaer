package br.mil.fab.sispagaer.painel.resource;

import br.mil.fab.sispagaer.painel.dto.response.HeatmapBoletimDTO;
import br.mil.fab.sispagaer.painel.exception.ErroResponseDTO;
import br.mil.fab.sispagaer.painel.service.BoletimFinanceiroService;
import io.smallrye.mutiny.Uni;
import jakarta.inject.Inject;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.media.Content;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.eclipse.microprofile.openapi.annotations.parameters.Parameter;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponses;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import java.time.LocalDate;

/**
 * Endpoints de publicações de boletim financeiro.
 *
 * <p>Fornece dados agregados por data para alimentar o heatmap de calendário
 * do painel — sem lógica de negócio, toda delegada ao {@link BoletimFinanceiroService}.</p>
 */
@Path("/boletim-financeiro")
@Produces(MediaType.APPLICATION_JSON)
@Tag(name = "Boletim Financeiro")
public class BoletimFinanceiroResource {

    @Inject
    BoletimFinanceiroService service;

    @GET
    @Path("/publicacoes/heatmap")
    @Operation(
        summary = "Heatmap de publicações de boletim financeiro",
        description = """
            Retorna a frequência diária de publicações de boletim financeiro
            para dois anos comparativos.

            Os dados são agregados por data e prontos para o ECharts calendar heatmap.
            Dias sem publicação são omitidos (o frontend interpreta ausência como zero).
            Cacheado por 1 hora.
            """
    )
    @APIResponses({
        @APIResponse(responseCode = "200", description = "Heatmap retornado com sucesso",
            content = @Content(schema = @Schema(implementation = HeatmapBoletimDTO.class))),
        @APIResponse(responseCode = "400", description = "Parâmetros inválidos",
            content = @Content(schema = @Schema(implementation = ErroResponseDTO.class))),
        @APIResponse(responseCode = "401", description = "API Key ausente ou inválida",
            content = @Content(schema = @Schema(implementation = ErroResponseDTO.class)))
    })
    public Uni<HeatmapBoletimDTO> heatmap(
            @QueryParam("yearA")
            @Min(2000) @Max(2100)
            @Parameter(description = "Ano base do comparativo", example = "2024")
            Integer yearA,

            @QueryParam("yearB")
            @Min(2000) @Max(2100)
            @Parameter(description = "Ano corrente do comparativo", example = "2025")
            Integer yearB) {

        int currentYear = LocalDate.now().getYear();
        int resolvedYearB = (yearB == null) ? currentYear : yearB;
        int resolvedYearA = (yearA == null) ? resolvedYearB - 1 : yearA;

        return service.buscarHeatmap(resolvedYearA, resolvedYearB);
    }
}
