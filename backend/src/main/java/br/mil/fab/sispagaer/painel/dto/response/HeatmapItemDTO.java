package br.mil.fab.sispagaer.painel.dto.response;

import org.eclipse.microprofile.openapi.annotations.media.Schema;

/**
 * Um ponto de dado do heatmap de calendário.
 *
 * @param data  Data no formato "YYYY-MM-DD" — compatível com ECharts calendar heatmap
 * @param valor Quantidade de publicações nessa data
 */
@Schema(description = "Ponto diário de publicação para o heatmap de calendário")
public record HeatmapItemDTO(

    @Schema(example = "2024-11-15") String data,
    @Schema(example = "7")          int    valor

) {}
