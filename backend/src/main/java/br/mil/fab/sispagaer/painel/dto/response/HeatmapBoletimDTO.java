package br.mil.fab.sispagaer.painel.dto.response;

import org.eclipse.microprofile.openapi.annotations.media.Schema;

import java.util.List;

/**
 * Dados do heatmap de publicações de boletim financeiro para dois anos.
 *
 * <p>Retorna os dados prontos para consumo pelo ECharts {@code calendar heatmap},
 * evitando qualquer transformação adicional no frontend.</p>
 *
 * @param yearA      Ano base (anterior)
 * @param yearB      Ano corrente
 * @param dadosYearA Lista de pontos diários para yearA
 * @param dadosYearB Lista de pontos diários para yearB
 */
@Schema(description = "Heatmap de publicações de boletim financeiro para dois anos comparativos")
public record HeatmapBoletimDTO(

    @Schema(example = "2024") int yearA,
    @Schema(example = "2025") int yearB,

    List<HeatmapItemDTO> dadosYearA,
    List<HeatmapItemDTO> dadosYearB

) {}
